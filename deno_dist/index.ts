import { isInspectorLike } from 'npm:@exotjs/inspector/helpers';
import { ExotMiddlewareOptions } from './types.ts';
import type { MiddlewareHandler } from 'https://deno.land/x/hono@v4.1.0/mod.ts';

export const inspectorMiddleware = (
  options: ExotMiddlewareOptions
): MiddlewareHandler => {
  const { inspector, traceIdHeader = 'X-Trace-Id' } = options;
  if (!isInspectorLike(inspector)) {
    throw new Error(`Invalid inspector instance.`);
  }
  const { addAttribute, trace } = inspector.instruments.traces;
  return async (c, next) => {
    if (
      !inspector.instruments.traces.active &&
      !inspector.instruments.metrics.active
    ) {
      return next();
    }
    return trace(
      'request',
      (ctx) => {
        if (inspector.instruments.traces.active) {
          if (traceIdHeader && ctx.rootSpan.uuid) {
            c.res.headers.append(traceIdHeader, ctx.rootSpan.uuid);
          }
          addAttribute(ctx.rootSpan, 'method', c.req.method);
          addAttribute(ctx.rootSpan, 'path', c.req.path);
        }
        return next();
      },
      {
        onEnd(ctx) {
          if (inspector.instruments.metrics.active) {
            const status = String(c.res.status).slice(0, 1) + 'xx';
            inspector.instruments.metrics.push({
              'response:latency': [
                {
                  values: [ctx.rootSpan.duration],
                },
              ],
              [`response:${status}`]: [
                {
                  values: [1],
                },
              ],
            });
          }
          if (c.error && inspector.instruments.errors.active) {
            inspector.instruments.errors.push(
              {
                attributes: {
                  method: c.req.method,
                  path: c.req.path,
                },
                message: String(c.error.message || c.error),
                stack: c.error?.stack,
              },
              'hono'
            );
          }
        },
      }
    );
  };
};

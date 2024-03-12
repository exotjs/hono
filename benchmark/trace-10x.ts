import { Hono } from 'hono';
import { Inspector } from '@exotjs/inspector';
import { inspectorMiddleware } from '../lib/index.js';

const inspector = new Inspector();

const { trace } = inspector.instruments.traces;

const app = new Hono();

app.use(inspectorMiddleware({
  traceIdHeader: null,
  inspector,
}));

app.get('/', (c) => {
  return trace('t1', () => {
    return trace('t2', () => {
      return trace('t3', () => {
        return trace('t4', () => {
          return trace('t5', () => {
            return trace('t6', () => {
              return trace('t7', () => {
                return trace('t8', () => {
                  return trace('t9', () => c.text('Hi'));
                });
              });
            });
          });
        });
      });
    });
  });
});

export default app;

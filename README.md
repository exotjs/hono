# Exot Inspector Integration with Hono

This package includes middleware for [Hono](https://hono.dev), enabling automatic tracing of incoming requests and seamless integration with other features of Exot Inspector.

## Compatibility

Hono is a modern, cross-runtime framework that supports various platforms. However, Exot Inspector requires specific Node.js built-in modules and officially supports only Node.js, Bun, and Deno.

## Install

```sh
npm install @exotjs/hono
```

## Usage

```ts
import { Hono } from 'hono';
import { Inspector } from '@exotjs/inspector';
import { inspectorMiddleware } from '@exotjs/hono';

const inspector = new Inspector();

const { trace } = inspector.instruments.traces;

const app = new Hono();

app.use(inspectorMiddleware({
  inspector,
}));

app.get('/', (c) => {
  return trace('hello', () => c.text('Hello Hono!'));
});

export default app;
```

## Server Metrics

In addition to built-in request tracing, this middleware automatically collects basic server metrics, visible in the [Exot App](https://exot.dev/app/):

- Request latency
- Response status codes

## Configuration

### `inspector: Inspector` (required)

Provide the instance of the Inspector.

### `traceIdHeader: string`

Specify the header name for the "trace ID." Set to null to disable. Default is `X-Trace-Id`.

## Performance

The following table illustrates the performance change per request under three different scenarios.

|Test|Change per request|
|----|------|
|Inspector deactivated|+0.24ms|
|Tracing disabled (metrics only)|+0.96ms|
|Tracing enabled (metrics + tracing)|+2.21ms|

As a rule of thumb, approximately ~1ms is added to each request when tracing is disabled and only server metrics are collected. If the entire inspector, including metrics, is deactivated, only negligible sub-milliseconds are added to each request. With tracing enabled and metrics collected, expect about ~2ms.

Refer to the [benchmark](/benchmark) folder for more details.

## Contributing

See [Contributing Guide](https://github.com/exotjs/hono/blob/main/CONTRIBUTING.md) and please follow our [Code of Conduct](https://github.com/exotjs/hono/blob/main/CODE_OF_CONDUCT.md).


## License

MIT
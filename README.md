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

## Configuration

### `inspector: Inspector` (required)

Provide the instance of the Inspector.

### `traceIdHeader: string`

Specify the header name for the "trace ID." Set to null to disable. Default is `X-Trace-Id`.

## Contributing

See [Contributing Guide](https://github.com/exotjs/hono/blob/main/CONTRIBUTING.md) and please follow our [Code of Conduct](https://github.com/exotjs/hono/blob/main/CODE_OF_CONDUCT.md).


## License

MIT
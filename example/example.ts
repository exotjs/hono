import { Hono } from 'hono';
import { Inspector } from '@exotjs/inspector';
import { inspectorMiddleware } from '../lib/index.js';

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

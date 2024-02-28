import { Hono } from 'hono';
import { Inspector } from '@exotjs/inspector';
import { inspectorMiddleware } from '../lib/index.js';

const inspector = new Inspector();

inspector.deactivate();

const app = new Hono();

app.use(inspectorMiddleware({
  traceIdHeader: null,
  inspector,
}));

app.get('/', (c) => c.text('Hi'));

export default app;

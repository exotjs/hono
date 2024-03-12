import {
  assertEquals,
  assert,
} from 'https://deno.land/std@0.213.0/assert/mod.ts';
import { Hono } from 'https://deno.land/x/hono@v4.1.0/mod.ts';
import { Inspector } from 'npm:@exotjs/inspector';
import { MemoryStore } from 'npm:@exotjs/inspector/store';
import { inspectorMiddleware } from '../deno_dist/mod.ts';

/**
 * Run the tests with --allow-hrtime to get precise times
 */

Deno.test('Hono', async (t) => {
  const store = new MemoryStore();
  const inspector = new Inspector({
    instruments: {
      logs: {
        disabled: true,
      },
    },
    store,
  });
  const app = new Hono();
  app.use(
    inspectorMiddleware({
      inspector,
    })
  );
  app.get('/', (c) => c.text('Hello'));

  await t.step('should create a new span', async () => {
    const resp = await app.fetch(new Request('http://localhost:8080/'));
    assertEquals(await resp.text(), 'Hello');
    assert(resp.headers.get('X-Trace-Id'));
    await new Promise((resolve) => {
      setTimeout(() => {
        const value: string = store.lists.get('traces')?.[0]?.value;
        assert(value);
        assert(value.includes('"name":"request"'));
        assert(value.includes('"method":"GET"'));
        assert(value.includes('"path":"/"'));
        resolve(void 0);
      }, 100);
    });
  });

  inspector.destroy();
});

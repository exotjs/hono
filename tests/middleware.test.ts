import { Hono } from 'hono';
import { describe, expect, it } from 'vitest';
import { Inspector } from '@exotjs/inspector';
import { MemoryStore } from '@exotjs/inspector/store';
import { inspectorMiddleware } from '../lib/index.js';

describe('Middleware', () => {
  it('should throw an error if inspector option is missing', () => {
    expect(() => inspectorMiddleware({} as any));
  });

  it('should throw an error if inspector option is invalid', () => {
    expect(() => inspectorMiddleware({ inspector: {} as any }));
  });

  it('should trace request', async () => {
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
    const resp = await app.fetch(new Request('http://localhost:8080/'));
    expect(await resp.text()).toEqual('Hello');
    expect(resp.headers.get('X-Trace-Id')).toBeDefined();
    await new Promise((resolve) => {
      setTimeout(() => {
        const value: string = store.lists.get('traces')?.[0]?.value;
        expect(value).toBeDefined();
        expect(value.includes('"name":"request"'));
        expect(value.includes('"method":"GET"'));
        expect(value.includes('"path":"/"'));
        resolve(void 0);
      }, 100);
    });
  });

  it('should track error', async () => {
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
    app.get('/', () => {
      throw new Error('test error');
    });
    const resp = await app.fetch(new Request('http://localhost:8080/'));
    expect(resp.status).toEqual(500);
    expect(resp.headers.get('X-Trace-Id')).toBeDefined();
    await new Promise((resolve) => {
      setTimeout(() => {
        const value: string = store.lists.get('errors')?.[0]?.value;
        expect(value).toBeDefined();
        expect(value.includes('"message":"test error"'));
        expect(value.includes('"method":"GET"'));
        expect(value.includes('"path":"/"'));
        resolve(void 0);
      }, 100);
    });
  });
});

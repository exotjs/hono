import type { Inspector } from '@exotjs/inspector';

export interface ExotMiddlewareOptions {
  inspector: Inspector;
  traceIdHeader?: string | null | false;
}

export interface ExotBunWebSocketsOptions {
  inspector: Inspector;
}

export interface BunWebSocket<Data = any> {
  message: (
    ws: BunServerWebSocket<Data>,
    message: string | ArrayBuffer | Uint8Array
  ) => void;
  open?: (ws: BunServerWebSocket<Data>) => void;
  close?: (ws: BunServerWebSocket<Data>) => void;
  error?: (ws: BunServerWebSocket<Data>, error: Error) => void;
  drain?: (ws: BunServerWebSocket<Data>) => void;
}

export interface BunServerWebSocket<Data = any> {
  readonly data: Data;
  readonly readyState: number;
  readonly remoteAddress: string;
  send(message: string | ArrayBuffer | Uint8Array, compress?: boolean): number;
  close(code?: number, reason?: string): void;
  subscribe(topic: string): void;
  unsubscribe(topic: string): void;
  publish(topic: string, message: string | ArrayBuffer | Uint8Array): void;
  isSubscribed(topic: string): boolean;
  cork(cb: (ws: BunServerWebSocket) => void): void;
}

export interface BunServer<Data = any> {
  port?: number;
  upgrade: (req: Request, options: { data: Data }) => boolean;
}

export interface BunWebSocketHandler<Data = any> {
  fetch: (
    req: Request,
    server: BunServer<Data>
  ) => Response | Promise<Response | void> | void;
  websocket: BunWebSocket<Data>;
}

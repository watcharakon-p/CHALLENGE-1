import type { WebSocketServer } from "ws";

let wssRef: WebSocketServer | null = null;

export function attachWss(wss: WebSocketServer) {
  wssRef = wss;
}

export function wsBroadcast(type: string, data: unknown) {
  if (!wssRef) return;
  const msg = JSON.stringify({ type, data });
  (wssRef as any).clients.forEach((client: any) => {
    if (client.readyState === 1) client.send(msg);
  });
}

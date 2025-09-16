import type { Request, Response } from "express";
const clients = new Set<Response>();
export function sseHandler(req: Request, res: Response) {
  res.set({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
  });
  
  res.flushHeaders?.();
  res.write(`event: hello\ndata: {"ok":true}\n\n`);
  clients.add(res);
  req.on("close", () => clients.delete(res));
}
export function sseBroadcast(event: string, data: unknown) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  for (const c of clients) c.write(payload);
}

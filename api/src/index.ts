import { createServer } from "./server";
import { WebSocketServer } from "ws";
import { attachWss } from "./rt/ws";

const port = Number(process.env.PORT || 3001);
const app = createServer();
const server = app.listen(port, () =>
  console.log(`[api] http://localhost:${port}`)
);

const wss = new WebSocketServer({ server, path: "/rt/ws" });

attachWss(wss);
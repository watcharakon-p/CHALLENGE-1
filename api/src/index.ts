import { createServer } from "./server";

const port = Number(process.env.PORT || 3001);
const app = createServer();
app.listen(port, () =>
  console.log(`[api] http://localhost:${port}`)
);
import { app } from "./app";

const host = '0.0.0.0'
const port = 3333

app.listen({
  host,
  port
}).then(() => {
  console.log(`🎉 server is running on ${host}:${port} ...`)
})
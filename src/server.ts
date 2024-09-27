import { app } from './app'
import { env } from './env'

const host = '0.0.0.0'
const port = env.PORT

app
  .listen({
    host,
    port,
  })
  .then(() => {
    console.log(`🎉 server is running on ${host}:${port}...`)
  })

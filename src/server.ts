import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';
// import { server } from './socket.io/socket.js'
import mainRouter from './routes/index.js';

const app = express()
const port = process.env.PORT || 3000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

app.use(express.static(path.join(__dirname, '../client')))
app.use(express.json());

app.use(mainRouter);

// app.get('*', (_req, res) => {
//   res.sendFile(path.join(__dirname, '../client/index.html'))
// })

app.listen(port, () => {
  console.log(`Server listening on http://localhost:${port}`)
})

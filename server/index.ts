import http from "http"
import { WebSocketServer, WebSocket } from "ws"
import { randomUUID, type UUID } from "node:crypto"

export type Message =
  | {
      username: string
      type: "LOGIN"
    }
  | {
      text: string
      type: "text"
    }

function handleMessage(message: string, userId: UUID) {
  console.log(`${userId} sent ${message}`)

  // TODO add validation
  const data = JSON.parse(message) as Message

  if (data.type === "LOGIN") {
    clients[userId] = {
      ...clients[userId],
      username: data.username,
    }

    Object.values(clients).forEach(({ connection }) => {
      if (connection.readyState === WebSocket.OPEN) {
        connection.send(data.username)
      }
    })
  }
}

// Set up server
const PORT = process.env.PORT || 3001
const server = http.createServer()
const ws = new WebSocketServer({ server })

const clients: Record<UUID, { connection: WebSocket; username?: string }> = {}

server.listen(PORT, () => console.log(`listening on port ${PORT}`))

ws.on("connection", (connection) => {
  const userId = randomUUID()
  console.log("\nReceived a new connection")

  clients[userId] = { connection }
  console.log(`${userId} connected`)

  connection.onmessage = ({ data }) => handleMessage(data.toString(), userId)

  connection.onclose = () => {
    console.log(`${userId} disconnected`)

    delete clients[userId]
    console.log(Object.keys(clients))
  }
})

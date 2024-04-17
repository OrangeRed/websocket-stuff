import { type NextApiRequest, type NextApiResponse } from "next"

import { Server as HttpServer } from "http"
import { Server as SocketServer } from "socket.io"

export const config = {
  api: {
    bodyParser: false,
  },
}

export type NextApiResponseWithSocketServer = NextApiResponse & {
  socket: NextApiResponse["socket"] & {
    server: HttpServer & {
      io: SocketServer<
        ClientToServerEvents,
        ServerToClientEvents,
        {}, // InterServerEvents
        {} // SocketData
      >
    }
  }
}

export type ServerToClientEvents = {
  pong: (str: string) => void
  videoQueue: (videos: string[]) => void
  users: (socketIds: string[]) => void
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
}

export type ClientToServerEvents = {
  ping: (str: string) => void
  hello: () => void
  getUsers: () => void
  setUser: (name: string) => void
  video: (url: string) => void
}

const USERS: { [key: string]: string } = {}

// TODO
const VIDEOS: string[] = []

const ioHandler = (
  req: NextApiRequest,
  res: NextApiResponseWithSocketServer,
) => {
  if (!res?.socket?.server?.io) {
    const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(
      res.socket.server,
      {
        path: "/api/socket/io",
        addTrailingSlash: false,
      },
    )

    const getCurrentUsers = async () => {
      const currentUsers: string[] = []
      for (const sock of await io.fetchSockets()) {
        currentUsers.push(USERS[sock.id] ?? sock.id)
      }

      return currentUsers
    }

    io.on("connect", async (socket) => {
      socket.on("disconnect", async () => {
        delete USERS[socket.id]

        io.emit("users", await getCurrentUsers())
      })

      socket.on("ping", (str) => {
        console.log("ping: ", str)
        io.emit("pong", str)
      })

      socket.on("getUsers", async () => {
        io.emit("users", await getCurrentUsers())
      })

      socket.on("setUser", async (name) => {
        USERS[socket.id] = name

        console.log(USERS, "\n")
        io.emit("users", await getCurrentUsers())
      })

      socket.on("video", (url) => {
        console.log("On Server:", url)
        VIDEOS.push(url)
        io.emit("videoQueue", VIDEOS)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler

import { Server as HttpServer } from "http"
import { Server as SocketServer } from "socket.io"
import { type NextApiResponse, type NextApiRequest } from "next"

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
  // noArg: () => void;
  // basicEmit: (a: number, b: string, c: Buffer) => void;
  // withAck: (d: string, callback: (e: number) => void) => void;
}

export type ClientToServerEvents = {
  ping: (str: string) => void
  hello: () => void
}

const ioHandler = (
  req: NextApiRequest,
  res: NextApiResponseWithSocketServer,
) => {
  if (!res?.socket?.server?.io) {
    const path = "/api/socket/io"

    const io = new SocketServer<ClientToServerEvents, ServerToClientEvents>(
      res.socket.server,
      {
        path: path,
        addTrailingSlash: false,
      },
    )

    io.on("connect", (socket) => {
      console.log(socket.id)

      socket.on("ping", (str) => {
        console.log("ping: ", str)
        io.emit("pong", str)
      })
    })

    res.socket.server.io = io
  }

  res.end()
}

export default ioHandler

export const config = {
  api: {
    bodyParser: false,
  },
}

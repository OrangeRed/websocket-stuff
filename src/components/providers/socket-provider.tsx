"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { io as ClientIO, type Socket } from "socket.io-client"
import {
  type ClientToServerEvents,
  type ServerToClientEvents,
} from "@/pages/api/socket/io"

type SocketContextType = {
  socket: Socket<ServerToClientEvents, ClientToServerEvents> | null
  isConnected: boolean
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
})

export const useSocket = () => {
  return useContext(SocketContext)
}

export const SocketProvider = ({
  name,
  children,
}: {
  name: string
  children: React.ReactNode
}) => {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketInstance: Socket<ServerToClientEvents, ClientToServerEvents> =
      ClientIO(process.env.NEXT_PUBLIC_SITE_URL!, {
        path: "/api/socket/io",
        addTrailingSlash: false,
      })

    socketInstance.on("connect", () => {
      console.log(name)
      socketInstance.emit("setUser", name)
      // socketInstance.emit("getUsers")

      setIsConnected(true)
    })

    socketInstance.on("disconnect", () => {
      setIsConnected(false)
      // socketInstance.emit("getUsers")
    })

    socketInstance.on("pong", (str) => console.log("pong:", str))

    setSocket(socketInstance)

    return () => {
      socketInstance.disconnect()
    }
  }, [])

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  )
}

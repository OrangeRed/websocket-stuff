"use client"

import { useEffect, useState } from "react"
import { useSocket } from "./providers/socket-provider"

const MediaDisplay = () => {
  const [media, setMedia] = useState<string[]>()

  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (socket) {
      console.log("add listener")

      socket.on("users", (sockets) => {
        console.log(sockets)
        setMedia(sockets)
      })
    }

    return () => {
      socket?.disconnect()
    }
  }, [socket])

  if (!isConnected) {
    return <span className="dark:text-yellow-400">Connecting...</span>
  }

  if (!media) {
    return <span className="dark:text-red-400">No media</span>
  }

  return (
    <div className="flex flex-col items-center dark:text-green-400">
      {media.map((song) => {
        return <p key={song}>{song}</p>
      })}
    </div>
  )
}

export default MediaDisplay

"use client"

import { useEffect, useState } from "react"

import { useSocket } from "@/components/providers/socket-provider"

const MediaDisplay = () => {
  const [media, setMedia] = useState<string[]>()
  const [users, setUsers] = useState<string[]>()

  const { socket, isConnected } = useSocket()

  useEffect(() => {
    if (socket) {
      console.log("add listener")

      socket.on("users", (sockets) => {
        console.log(sockets)
        setUsers(sockets)
      })

      socket.on("videoQueue", (videos) => {
        console.log(videos)
        setMedia(videos)
      })
    }

    return () => {
      socket?.disconnect()
    }
  }, [socket])

  if (!isConnected) {
    return <span className="dark:text-yellow-400">Connecting...</span>
  }

  return (
    <>
      {media ? (
        <div className="flex flex-col items-center dark:text-green-400">
          {media.map((song) => {
            return <p key={song}>{song}</p>
          })}
        </div>
      ) : (
        <span className="dark:text-red-400">No media</span>
      )}

      <div className="absolute bottom-3 flex flex-col items-center text-base opacity-60">
        {users?.join(", ")}
      </div>
    </>
  )
}

export default MediaDisplay

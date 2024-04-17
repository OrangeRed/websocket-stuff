"use client"

import { useEffect, useState } from "react"

import { useSocket } from "@/components/providers/socket-provider"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

import { colorsFromString } from "@/lib/utils"

const ConnectedUsers = ({ name }: { name: string }) => {
  const { socket } = useSocket()
  const [users, setUsers] = useState<string[]>()

  useEffect(() => {
    if (socket) {
      socket.on("users", setUsers)
    }
  }, [socket])

  return (
    <>
      {users?.map((user, idx) => {
        if (user === name) {
          return null
        }

        const [bgColor, textColor] = colorsFromString(user)

        return (
          <Avatar
            className="whitespace-nowrap border animate-in"
            key={`other-user-${idx}`}
            style={{ background: bgColor, color: textColor }}
          >
            <AvatarFallback
              className="cursor-pointer bg-transparent text-xl dark:bg-transparent"
              title={user}
            >
              {user.replace("Anonymous ", "").slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        )
      })}
    </>
  )
}

export default ConnectedUsers

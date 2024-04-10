"use client"

import { useSocket } from "@/components/providers/socket-provider"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

const ConnectionIndicator = ({ className }: { className?: string }) => {
  const { socket, isConnected } = useSocket()

  if (!isConnected) {
    return (
      <Badge
        className={cn(
          "h-4 w-4 border-2 p-0 dark:border-white/60 dark:bg-red-600",
          className,
        )}
      />
    )
  }

  if (socket === null) {
    return (
      <Badge
        className={cn(
          "h-4 w-4 border-2 p-0 dark:border-white/60 dark:bg-yellow-600",
          className,
        )}
      />
    )
  }

  return (
    <Badge
      className={cn(
        "h-4 w-4 border-2 p-0 dark:border-white/60 dark:bg-emerald-600",
        className,
      )}
      onClick={() => {
        socket.emit("ping", "test")
      }}
    />
  )
}

export default ConnectionIndicator

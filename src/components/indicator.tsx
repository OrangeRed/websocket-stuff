"use client"

import { useSocket } from "@/components/providers/socket-provider"
// import { Badge } from "@/components/ui/badge";

export const SocketIndicator = () => {
  const { socket, isConnected } = useSocket()

  if (!isConnected) {
    return (
      <span className="border-none bg-yellow-600 p-2 text-white">
        Fallback: Polling every 1s
      </span>
    )
  }

  return (
    <div className="flex flex-col">
      <span className="border-none bg-emerald-600 p-2 text-white">
        Live: Real-time updates
      </span>
      <button
        onClick={() => {
          socket?.emit("ping", "test")
        }}
      >
        Ping?
      </button>
    </div>
  )
}

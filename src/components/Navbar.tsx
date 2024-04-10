"use server"

import { cookies } from "next/headers"

import { cn, colorsFromString } from "@/lib/utils"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"

import NameModal from "@/components/NameModal"
import ConnectionIndicator from "./ConnectionIndicator"

export default async function Navbar({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const [bgColor, textColor] = colorsFromString(name)

  return (
    <nav className={cn("grid h-12 w-full grid-cols-3 gap-x-4", className)}>
      <span className="col-start-2 flex items-center justify-center">
        Navbar
      </span>

      <div className="flex h-full w-full items-center justify-end gap-2 px-4">
        <NameModal defaultName={cookies().has("name") ? name : ""}>
          <Button
            className={cn("rounded-full p-0 ")}
            style={{ background: bgColor, color: textColor }}
          >
            <Avatar className="border">
              <AvatarFallback
                className="bg-transparent text-xl dark:bg-transparent"
                title={name}
              >
                {name.replace("Anonymous ", "").slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <ConnectionIndicator className="absolute bottom-0.5 right-3" />
          </Button>
        </NameModal>
      </div>
    </nav>
  )
}

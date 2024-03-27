"use server"

import path from "path"
import { readFileSync } from "fs"
import { cookies } from "next/headers"

import { cn, colorsFromString } from "@/lib/utils"
import { Avatar, AvatarFallback } from "./ui/avatar"
import { Button } from "./ui/button"

import NameModal from "@/components/NameModal"

function getRandomAnimalName() {
  const animals = readFileSync(
    path.resolve(process.cwd(), "public/animals.txt"),
    "utf-8",
  ).split("\n")

  const animal = animals[Math.floor(Math.random() * animals.length)]
    .split(" ")
    .at(-1)!

  return `Anonymous ${animal}`
}

export default async function Navbar({ className }: { className?: string }) {
  const name = cookies().get("name")?.value ?? getRandomAnimalName()
  const [bgColor, textColor] = colorsFromString(name)

  return (
    <nav className={cn("grid h-12 w-full grid-cols-3 gap-4", className)}>
      <span className="col-start-2 flex items-center justify-center">
        Navbar
      </span>
      <div className="flex w-full items-center justify-end px-4">
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
          </Button>
        </NameModal>
      </div>
    </nav>
  )
}

"use server"

import path from "path"
import { readFileSync } from "fs"
import { cookies } from "next/headers"

import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

import NameModal from "@/components/TestModal"

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
  const name = cookies().get("nickname")?.value ?? getRandomAnimalName()

  return (
    <nav className={cn("grid h-12 w-full grid-cols-3 gap-4", className)}>
      <span className="col-start-2 flex items-center justify-center">
        Navbar
      </span>
      <div className="flex w-full items-center justify-end px-4">
        <NameModal defaultName={name}>
          <Avatar className="border-2 ">
            {/* <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" /> */}
            <AvatarFallback
              className="bg-transparent text-xl dark:bg-transparent"
              title={name}
            >
              {name.includes("Anonymous")
                ? name.split(" ").at(-1)!.slice(0, 2)
                : name.slice(0, 2)}
            </AvatarFallback>
          </Avatar>
        </NameModal>
      </div>
    </nav>
  )
}

"use server"

import { cookies } from "next/headers"

/**
 * Server action to set the `name` cookie
 */
export async function setNicknameCookie(name: string) {
  const nameCookie = cookies().get("name")

  if (nameCookie?.value !== name) {
    console.log(`New Cookie: ${name}`)

    const oneDay = 24 * 60 * 60 * 1000 //ms
    cookies().set("name", name, { maxAge: oneDay })
  }
}

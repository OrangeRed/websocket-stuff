"use server"

import { cookies } from "next/headers"

export default async function setNicknameCookie(nickname: string) {
  const nameCookie = cookies().get("nickname")

  if (nameCookie?.value !== nickname) {
    console.log(nickname)
    cookies().set("nickname", nickname)
  }
}

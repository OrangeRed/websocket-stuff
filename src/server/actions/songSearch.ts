"use server"

export async function songSearch(query: string, search: string) {
  await new Promise<void>((resolve) => {
    setTimeout(() => resolve(), 1000)
  })

  console.log(search, query)
  return [{ name: "This is a test" }, { name: "This is another test" }]
}

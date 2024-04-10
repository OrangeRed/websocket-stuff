"use client"

import { useEffect, useState } from "react"

import { Button } from "./ui/button"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "./ui/command"

import {
  PlaySquareIcon,
  AudioWaveformIcon,
  PlusIcon,
  ShieldCloseIcon,
} from "lucide-react"

import { useSocket } from "./providers/socket-provider"

import { cn } from "@/lib/utils"
import { songSearch } from "@/server/actions/songSearch"

const OPTIONS = {
  youtube: {
    icon: <PlaySquareIcon className="mr-2 h-4 w-4" />,
    // TODO action: youtubeSearch,
    action: (v: string) => songSearch(v, "Youtube"),
  },
  spotify: {
    icon: <AudioWaveformIcon className="mr-2 h-4 w-4" />,
    // TODO action: spotifySearch,
    action: (v: string) => songSearch(v, "Spotify"),
  },
} as const

type SearchResults = Awaited<ReturnType<typeof songSearch>>

const MediaSearch = () => {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [query, setQuery] = useState("")
  const [engine, setEngine] = useState<keyof typeof OPTIONS>()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [results, setResults] = useState<SearchResults>()

  const { socket } = useSocket()

  useEffect(() => {
    if (dialogOpen) {
      setQuery("")
      setEngine(undefined)
      setResults(undefined)
    }
  }, [dialogOpen])

  async function handleSearch(value: string) {
    try {
      if (!Object.keys(OPTIONS).includes(value)) {
        throw new Error("500")
      } else if (query.length < 3) {
        throw new Error("Must be three or more characters long")
      }

      setLoading(true)
      setEngine(value as keyof typeof OPTIONS)

      const getResults = async () => {
        setResults(await OPTIONS[value as keyof typeof OPTIONS].action(query))
        setQuery("")
        setLoading(false)
      }

      getResults()
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        // TODO move logging to server
        console.log(err)
      }
    }
  }

  function broadcastMessage(message: string) {
    console.log("Emitting event: video", message)
    socket?.emit("video", message)
  }

  return (
    <>
      <Button
        className="absolute bottom-5 right-5 rounded-xl"
        onClick={() => setDialogOpen(true)}
        variant="default"
        size="icon"
      >
        <PlusIcon />
      </Button>

      <CommandDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        shouldFilter={!!results?.length}
      >
        <CommandInput
          error={error}
          placeholder={
            results?.length ? "Filter results..." : "Search for a song..."
          }
          value={query}
          onValueChange={(v) => {
            setError("")
            setQuery(v)
            if (!results?.length) {
              setEngine(undefined)
            }
          }}
        />

        <CommandList>
          {error === "500" && (
            <div className="flex items-center justify-center">
              <ShieldCloseIcon />
              <CommandEmpty>Something went wrong.</CommandEmpty>
            </div>
          )}

          {loading && <CommandLoading>Loading...</CommandLoading>}

          {!loading && engine && (
            <>
              <CommandGroup
                heading={`${engine} Results`}
                className={cn(
                  "[&_[cmdk-group-heading]]:capitalize",
                  results?.length || "hidden",
                )}
              >
                {results?.map((result, idx) => (
                  <CommandItem
                    key={`test-${idx}`}
                    value={result.name}
                    onSelect={broadcastMessage}
                  >
                    {result.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty>
                {!results?.length
                  ? "No Search Results."
                  : "No Matching Results."}
              </CommandEmpty>
            </>
          )}

          {!loading && !engine && (
            <CommandGroup heading="Search Engines">
              {Object.entries(OPTIONS).map(([key, { icon }]) => {
                return (
                  <CommandItem
                    className="capitalize"
                    key={key}
                    value={key}
                    onSelect={handleSearch}
                  >
                    {icon}
                    {key}
                  </CommandItem>
                )
              })}
            </CommandGroup>
          )}
        </CommandList>
      </CommandDialog>
    </>
  )
}

export default MediaSearch

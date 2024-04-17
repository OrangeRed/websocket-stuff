"use client"

import { useEffect, useState } from "react"

import { AudioWaveformIcon, PlaySquareIcon } from "lucide-react"

import { useSocket } from "@/components/providers/socket-provider"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandLoading,
} from "@/components/ui/command"

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

const MediaSearch = ({ className }: { className?: string }) => {
  const [query, setQuery] = useState("")
  const [engine, setEngine] = useState<keyof typeof OPTIONS>()

  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [results, setResults] = useState<SearchResults>()

  const { socket } = useSocket()

  useEffect(() => {
    if (query && engine) {
      const getResults = async () => {
        setResults(await OPTIONS[engine].action(query))
        setLoading(false)
      }

      setOpen(true)
      setLoading(true)
      setResults(undefined)
      getResults()
    }
  }, [!!(query && engine)])

  function broadcastMessage(message: string) {
    socket?.emit("video", message)

    setOpen(false)
    setEngine(undefined)
    setQuery("")
  }

  return (
    <div className={cn("[&_div]:border-0", className)}>
      <Command shouldFilter={false} loop>
        <CommandInput
          placeholder="Search for a song..."
          value={query}
          onValueChange={(v) => setQuery(v)}
        />

        <CommandList>
          <CommandGroup
            className={cn(query.length < 2 ? "hidden" : "")}
            heading="Search Engines"
          >
            {Object.entries(OPTIONS).map(([key, { icon }]) => {
              return (
                <CommandItem
                  className="capitalize"
                  key={key}
                  value={key}
                  onSelect={(v) => setEngine(v as keyof typeof OPTIONS)}
                >
                  {icon}
                  {key}
                </CommandItem>
              )
            })}
          </CommandGroup>
        </CommandList>
      </Command>

      <CommandDialog
        shouldFilter
        open={open}
        onOpenChange={() => {
          setOpen(false)
          setEngine(undefined)
          setQuery("")
        }}
      >
        <CommandInput placeholder="Filter results..." />

        <CommandList>
          {loading ? (
            <CommandLoading>Loading Results...</CommandLoading>
          ) : (
            <>
              {results?.map((result, idx) => (
                <CommandItem
                  key={`test-${idx}`}
                  value={result.name}
                  onSelect={broadcastMessage}
                >
                  {result.name}
                </CommandItem>
              ))}

              <CommandEmpty>
                {!results?.length
                  ? "No Search Results."
                  : "No Matching Results."}
              </CommandEmpty>
            </>
          )}
        </CommandList>
      </CommandDialog>
    </div>
  )
}

export default MediaSearch

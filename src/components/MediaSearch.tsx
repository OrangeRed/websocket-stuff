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

import { cn } from "@/lib/utils"
import { PlaySquareIcon, AudioWaveformIcon, PlusIcon } from "lucide-react"
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

export default function MediaSearch() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const [query, setQuery] = useState("")
  const [engine, setEngine] = useState<keyof typeof OPTIONS>()

  const [loading, setLoading] = useState(false)
  const [results, setResults] =
    useState<Awaited<ReturnType<typeof songSearch>>>()
  const [error, setError] = useState<unknown>()

  useEffect(() => {
    if (dialogOpen) {
      setQuery("")
      setEngine(undefined)
      setResults(undefined)
    }
  }, [dialogOpen])

  async function handleSearch(value: string) {
    console.log(value)

    try {
      // TODO validate
      // validate()
      setLoading(true)
      setEngine(value as keyof typeof OPTIONS)

      const getResults = async () => {
        setResults(await OPTIONS[value as keyof typeof OPTIONS].action(query))
        setQuery("")
        setLoading(false)
      }

      getResults()
    } catch (err) {
      setError(err)
    }
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
        shouldFilter={!!results}
      >
        <CommandInput
          placeholder={results ? "Filter results..." : "Search for a song..."}
          value={query}
          onValueChange={setQuery}
        />

        <CommandList>
          {loading ? (
            <CommandLoading>Loading...</CommandLoading>
          ) : engine ? (
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
                    // TODO something
                    onSelect={() => console.log(result.name)}
                  >
                    {result.name}
                  </CommandItem>
                ))}
              </CommandGroup>
              <CommandEmpty>No Matching Results</CommandEmpty>
            </>
          ) : (
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

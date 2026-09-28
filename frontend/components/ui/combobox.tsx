"use client"

import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "cn"

export interface ComboboxOption {
  value: string
  label: string
}

interface ComboboxProps {
  value: string
  onValueChange: (value: string) => void
  options: ComboboxOption[]
  placeholder?: string
  id?: string
  className?: string
}

export function Combobox({
  value,
  onValueChange,
  options,
  placeholder = "Select…",
  id,
  className,
}: ComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const listRef = React.useRef<HTMLUListElement>(null)
  const containerRef = React.useRef<HTMLDivElement>(null)
  const [focusedIndex, setFocusedIndex] = React.useState(-1)

  const selectedLabel = options.find((o) => o.value === value)?.label ?? ""

  const filtered = React.useMemo(() => {
    if (!query) return options
    const lower = query.toLowerCase()
    return options.filter((o) => o.label.toLowerCase().includes(lower))
  }, [options, query])

  // Close on outside click
  React.useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [open])

  // Scroll focused item into view
  React.useEffect(() => {
    if (focusedIndex >= 0 && listRef.current) {
      const item = listRef.current.children[focusedIndex] as HTMLElement | undefined
      item?.scrollIntoView({ block: "nearest" })
    }
  }, [focusedIndex])

  function select(optionValue: string) {
    onValueChange(optionValue)
    setQuery("")
    setOpen(false)
    inputRef.current?.blur()
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!open && (e.key === "ArrowDown" || e.key === "Enter")) {
      e.preventDefault()
      setOpen(true)
      return
    }
    if (!open) return

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault()
        setFocusedIndex((i) => (i < filtered.length - 1 ? i + 1 : 0))
        break
      case "ArrowUp":
        e.preventDefault()
        setFocusedIndex((i) => (i > 0 ? i - 1 : filtered.length - 1))
        break
      case "Enter":
        e.preventDefault()
        if (focusedIndex >= 0 && filtered[focusedIndex]) {
          select(filtered[focusedIndex].value)
        }
        break
      case "Escape":
        e.preventDefault()
        setOpen(false)
        setQuery("")
        break
    }
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      <div className="relative">
        <input
          ref={inputRef}
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls="combobox-listbox"
          aria-haspopup="listbox"
          aria-autocomplete="list"
          autoComplete="off"
          className="h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 pr-8 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30"
          placeholder={placeholder}
          value={open ? query : selectedLabel}
          onFocus={() => {
            setOpen(true)
            setQuery("")
            setFocusedIndex(-1)
          }}
          onChange={(e) => {
            setQuery(e.target.value)
            setFocusedIndex(-1)
            if (!open) setOpen(true)
          }}
          onKeyDown={handleKeyDown}
        />
        <ChevronDownIcon className="pointer-events-none absolute right-2 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      </div>

      {open && (
        <ul
          id="combobox-listbox"
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10"
        >
          {filtered.length === 0 ? (
            <li className="px-2.5 py-2 text-sm text-muted-foreground">
              No results found
            </li>
          ) : (
            filtered.map((option, index) => (
              <li
                key={option.value}
                role="option"
                aria-selected={option.value === value}
                data-focused={index === focusedIndex || undefined}
                className={cn(
                  "relative flex cursor-default items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm outline-hidden select-none hover:bg-accent hover:text-accent-foreground data-[focused]:bg-accent data-[focused]:text-accent-foreground",
                )}
                onMouseEnter={() => setFocusedIndex(index)}
                onMouseDown={(e) => {
                  e.preventDefault() // prevent blur before select
                  select(option.value)
                }}
              >
                <span className="flex-1">{option.label}</span>
                {option.value === value && (
                  <CheckIcon className="size-4 shrink-0" />
                )}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  )
}

"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { 
    Popover, 
    PopoverContent, 
    PopoverAnchor 
} from "@/components/ui/popover"
import { 
    Command, 
    CommandGroup, 
    CommandItem, 
    CommandList 
} from "@/components/ui/command"
import { cn } from "@/lib/utils"

interface InputAutocompleteProps {
    id?: string,
    name: string,
    value: string
    onChange: (value: string) => void
    onBlur?: () => void
    options: string[]
    placeholder?: string
    className?: string
    ["aria-invalid"]?: boolean
}

export function InputAutocomplete({ 
    id, 
    name, 
    value, 
    onChange, 
    onBlur,
    options, 
    placeholder,
    className,
    "aria-invalid": ariaInvalid
}: InputAutocompleteProps) {
    const [isOpen, setIsOpen] = React.useState(false)
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [width, setWidth] = React.useState<number | undefined>(undefined)

    // Manual filtering for better control over "should open" logic
    const filteredOptions = React.useMemo(() => {
        if (!value) return []
        return options.filter(
            (option) =>
                option.toLowerCase().includes(value.toLowerCase()) &&
                option.toLowerCase() !== value.toLowerCase()
        ).slice(0, 10)
    }, [options, value])

    React.useEffect(() => {
        if (filteredOptions.length > 0 && !isOpen && value.length > 0) {
            setIsOpen(true)
        } else if (filteredOptions.length === 0 && isOpen) {
            setIsOpen(false)
        }
    }, [filteredOptions, value.length])

    // Update width to match input
    React.useEffect(() => {
        if (containerRef.current) {
            setWidth(containerRef.current.offsetWidth)
        }
    }, [isOpen])

    return (
        <div ref={containerRef} className={cn("w-full", className)}>
            <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverAnchor asChild>
                    <Input
                        id={id || ''}
                        name={name}
                        value={value}
                        autoComplete="off"
                        onChange={(e) => {
                            onChange(e.target.value)
                            if (e.target.value.length > 0) {
                                setIsOpen(true)
                            }
                        }}
                        onFocus={() => {
                            if (filteredOptions.length > 0) setIsOpen(true)
                        }}
                        onBlur={onBlur}
                        placeholder={placeholder}
                        aria-invalid={ariaInvalid}
                    />
                </PopoverAnchor>
                <PopoverContent 
                    className="p-0 shadow-md border dark:border-zinc-800 dark:bg-zinc-900 overflow-hidden"
                    style={{ width: width ? `${width}px` : 'auto' }}
                    align="start"
                    sideOffset={4}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <Command className="bg-transparent" filter={(value, search) => {
                        if (value.toLowerCase().includes(search.toLowerCase())) return 1
                        return 0
                    }}>
                        <CommandList>
                            <CommandGroup>
                                {filteredOptions.map((option) => (
                                    <CommandItem
                                        key={option}
                                        value={option}
                                        onSelect={() => {
                                            onChange(option)
                                            setIsOpen(false)
                                        }}
                                        className="cursor-pointer"
                                    >
                                        <HighlightText text={option} highlight={value} />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    )
}

function HighlightText({ text, highlight }: { text: string; highlight: string }) {
    if (!highlight.trim()) return <span>{text}</span>
    
    const parts = text.split(new RegExp(`(${highlight})`, "gi"))
    
    return (
        <span>
            {parts.map((part, i) => (
                <span
                    key={i}
                    className={
                        part.toLowerCase() === highlight.toLowerCase()
                            ? "font-bold text-primary"
                            : ""
                    }
                >
                    {part}
                </span>
            ))}
        </span>
    )
}
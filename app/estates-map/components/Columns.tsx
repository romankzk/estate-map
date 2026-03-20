"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Estate, EstateSnapshot } from "../types"
import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { EstateTypes, PropertyTypes } from "../utils/enums"
import { cn } from "@/lib/utils"
import { TypeLabel } from "./ui/TypeLabel"
import { Button } from "@/components/ui/button"

function renderTypeBadges(type: string) {
  return (
    <Badge className={cn("inline-flex items-center gap-2",
      type == "royal" ? "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" :
        type == "private" ? "bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300" :
          type == "church" ? "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" :
            "bg-zinc-50 text-zinc-700 dark:bg-zinc-950 dark:text-zinc-300"
    )}>
      <TypeLabel typeKey={type} iconSize={12} />
    </Badge>
  )
}

export const columns: ColumnDef<Estate>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Назва",
  },
  {
    accessorKey: "estateType",
    header: "Тип",
    cell: ({ row }) => EstateTypes.get(row.getValue("estateType")).label.toLowerCase()
  },
  {
    accessorKey: "propertyType",
    header: "Форма власності",
    cell: ({ row }) => renderTypeBadges(row.getValue("propertyType"))
  },

  {
    accessorKey: "voivodeship",
    header: "Воєводство",
  },
  {
    accessorKey: "district",
    header: "Повіт",
  },
  {
    accessorKey: "contents",
    header: "Склад",
    cell: ({ row }) => {
      let contents = row.getValue("contents");

      if (Array.isArray(contents) && contents.length > 0) {
        contents.sort((a, b) => a.date.localeCompare(b.date));

        return (
          <>
            {contents.map((snapshot, idx) => {
              return (
                <HoverCard openDelay={10} closeDelay={100} key={idx}>
                  <HoverCardTrigger asChild>
                    <Button size="xs" variant="link">{snapshot.date}</Button>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex w-64 flex-col gap-0.5 dark:bg-[#111827] text-xs truncate text-wrap">
                    {snapshot.items.join(', ')}
                  </HoverCardContent>
                </HoverCard>
              )
            })}
          </>
        )
      }
    },
  }
]
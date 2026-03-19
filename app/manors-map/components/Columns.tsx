"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Manor } from "../types"
import { Badge } from "@/components/ui/badge"
import { OwnershipTypes } from "../utils/constants"
import { Crown } from "lucide-react"
import { cn } from "@/lib/utils"
import { TypeLabel } from "./TypeLabel"

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

export const columns: ColumnDef<Manor>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Назва",
  },
  {
    accessorKey: "type",
    header: "Тип",
    cell: ({ row }) => renderTypeBadges(row.getValue("type"))
  },
  {
    accessorKey: "voivodeship",
    header: "Воєводство",
  },
  {
    accessorKey: "district",
    header: "Повіт",
  },
]
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Estate, EstateSnapshot } from "../types"
import { Badge } from "@/components/ui/badge"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"
import { EstateTypes, PropertyTypes, Statuses } from "../utils/enums"
import { cn } from "@/lib/utils"
import { TypeLabel } from "./ui/TypeLabel"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp } from "lucide-react"

function renderTypeBadges(type: string) {
  const colors = {
    royal: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800",
    private: "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800",
    church: "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800",
    mixed: "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800"
  };

  const activeColor = colors[type as keyof typeof colors] || "bg-zinc-50 text-zinc-700 border-zinc-200";

  return (
    <Badge variant="outline" className={cn("flex items-center gap-1.5 px-2 py-0.5 font-semibold transition-colors", activeColor)}>
      <TypeLabel typeKey={type} iconSize={12} isShort={true} />
    </Badge>
  )
}

export const columns: ColumnDef<Estate>[] = [
  {
    accessorKey: "id",
    size: 50,
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-0.5"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          ID
          {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
          {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
        </Button>
      )
    },
  },
  {
    accessorKey: "name",
    size: 200,
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-0.5"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Назва
          {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
          {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
        </Button>
      )
    },
    cell: ({ row }) => {
      return (
        <span className="font-medium truncate block">
          {row.getValue("name")}
        </span>
      )
    }
  },
  {
    accessorKey: "estateType",
    size: 100,
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-0.5"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Тип
          {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
          {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
        </Button>
      )
    },
    cell: ({ row }) => EstateTypes.get(row.getValue("estateType")).label.toLowerCase()
  },
  {
    accessorKey: "propertyType",
    size: 150,
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-0.5"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Форма власності
          {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
          {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
        </Button>
      )
    },
    cell: ({ row }) => renderTypeBadges(row.getValue("propertyType"))
  },
  {
    accessorKey: "province",
    size: 150,
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-0.5"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Воєводство
          {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
          {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
        </Button>
      )
    },
    cell: ({ row }) => {
      let snapshots = row.getValue("snapshots") as EstateSnapshot[];

      if (snapshots.length > 0) {
        return snapshots[0].province;
      } else {
        return "";
      }
    }
  },
  {
    accessorKey: "district",
    size: 150,
    header: ({ column }) => {
      const isSorted = column.getIsSorted();
      return (
        <Button
          variant="ghost"
          className="px-0.5"
          onClick={() => column.toggleSorting(isSorted === "asc")}
        >
          Повіт
          {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
          {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
        </Button>
      )
    },
    cell: ({ row }) => {
      let snapshots = row.getValue("snapshots") as EstateSnapshot[];

      if (snapshots.length > 0) {
        return snapshots[0].district;
      } else {
        return "";
      }
    }
  },
  {
    accessorKey: "snapshots",
    size: 200,
    header: ({ column }) => {
      return (
        <div className="px-2">
          Склад
        </div>
      )
    },
    cell: ({ row }) => {
      let snapshots = row.getValue("snapshots") as EstateSnapshot[];

      if (snapshots.length > 0) {
        return (
          <>
            {snapshots.map((snapshot, idx) => {
              return (
                <HoverCard openDelay={10} closeDelay={100} key={idx}>
                  <HoverCardTrigger asChild className="truncate text-wrap">
                    <Badge variant="outline" className="px-2 text-xs bg-white dark:bg-[#111827] mr-0.5">
                      {snapshot.year}
                    </Badge>
                  </HoverCardTrigger>
                  <HoverCardContent className="flex w-64 flex-col gap-0.5 dark:bg-[#111827] text-xs truncate text-wrap">
                    {snapshot.items?.join(', ')}
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
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Estate, EstateSnapshot } from "../../types"
import { Badge } from "@/components/ui/badge"
import { EstateTypes, PropertyTypes, Statuses } from "../../utils/enums"
import { cn } from "@/lib/utils"
import { TypeLabel } from "../../components/ui/TypeLabel"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, ChevronDown, ChevronRight, CircleCheck, Clock, Edit, List, Trash2 } from "lucide-react"

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

export const getEstateColumns = (
  onEdit: (estate: Estate) => void,
  onDelete: (id: number) => void
): ColumnDef<Estate>[] => [
  {
    id: "expander",
    size: 50,
    header: () => null,
      cell: ({ row }) => (
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-8 w-8"
          onClick={(e) => {
            e.stopPropagation();
            row.toggleExpanded();
          }}
        >
          {row.getIsExpanded() ? (
            <ChevronDown className="size-4" />
          ) : (
            <ChevronRight className="size-4" />
          )}
        </Button>
      ),
  },
{
  accessorKey: "id",
    size: 50,
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            className="p-0"
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
  accessorKey: "center",
    size: 100,
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            className="px-0.5"
            onClick={() => column.toggleSorting(isSorted === "asc")}
          >
            Центр
            {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
            {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
          </Button>
        )
      },
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
          let contents = row.original.contents as EstateSnapshot[];
          let sortedItems = contents
            .filter((s: EstateSnapshot) => s.status === Statuses.Approved)
            .sort((a: any, b: any) => b.date.localeCompare(a.date));

          if (sortedItems.length > 0) {
            return sortedItems[0].province;
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
          let contents = row.original.contents as EstateSnapshot[];
          let sortedItems = contents
            .filter((s: EstateSnapshot) => s.status === Statuses.Approved) // Get only approved items
            .sort((a: any, b: any) => b.date.localeCompare(a.date)); // Sort by date

          if (sortedItems.length > 0) {
            return sortedItems[0].district;
          } else {
            return "";
          }
        }
},
{
  accessorKey: "status",
    size: 150,
      header: ({ column }) => {
        const isSorted = column.getIsSorted();
        return (
          <Button
            variant="ghost"
            className="px-0.5"
            onClick={() => column.toggleSorting(isSorted === "asc")}
          >
            Статус
            {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
            {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
          </Button>
        )
      },
        cell: ({ row }) => (
          <Badge
            className={cn(row.getValue('status') === Statuses.Approved ?
              "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" :
              "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800")}
          >
            {row.getValue('status') === Statuses.Approved ? (
              <><CircleCheck /> Схвалено</>
            ) : (
              <><Clock /> Очікує перевірки</>
            )}
          </Badge>
        )
},
{
  id: "actions",
    size: 150,
      header: () => <div className="text-right">Дії</div>,
        cell: ({ row }) => (
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row.original);
              }}
              title="Редагувати"
            >
              <Edit className="w-4 h-4" />
            </Button>
            <Button
              variant="destructive"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row.original.id);
              }}
              title="Видалити"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>)
}
]
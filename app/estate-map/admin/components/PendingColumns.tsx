"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Estate, EstateSnapshot } from "../../types"
import { Badge } from "@/components/ui/badge"
import { EstateTypes, PropertyTypes, Statuses } from "../../utils/enums"
import { cn } from "@/lib/utils"
import { TypeLabel } from "../../components/ui/TypeLabel"
import { Button } from "@/components/ui/button"
import { ArrowDown, ArrowUp, Check, ChevronDown, ChevronRight, CircleCheck, Clock, Edit, List, Trash2, X } from "lucide-react"

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

export const getPendingEstateColumns = (
    onApprove: (estate: Estate) => void,
    onReject: (id: number) => void,
    onEdit: (estate: Estate) => void
): ColumnDef<Estate>[] => [
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
            cell: ({ row }) => {
                const type = row.getValue("estateType") as string;
                return EstateTypes.get(type)?.label.toLowerCase() || type;
            }
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
                        <><CircleCheck className="size-3 mr-1" /> Схвалено</>
                    ) : (
                        <><Clock className="size-3 mr-1" /> Очікує перевірки</>
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
                            onApprove(row.original);
                        }}
                        title="Схвалити"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                        <Check className="w-4 h-4" />
                    </Button>
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
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onReject(row.original.id);
                        }}
                        title="Відхилити"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>)
        }
    ]


/* Snapshot columns */
export const getPendingSnapshotColumns = (
    onApprove: (snapshot: any) => void,
    onReject: (estateId: number, index: number) => void,
    onEdit: (snapshot: any) => void
): ColumnDef<any>[] => [
        {
            accessorKey: "id",
            size: 80,
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
                        Назва маєтку
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
            accessorKey: "year",
            size: 100,
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className="px-0.5"
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        Рік
                        {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
                        {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
                    </Button>
                )
            },
        },
        {
            accessorKey: "sourceSignature",
            size: 150,
            header: ({ column }) => {
                const isSorted = column.getIsSorted();
                return (
                    <Button
                        variant="ghost"
                        className="px-0.5"
                        onClick={() => column.toggleSorting(isSorted === "asc")}
                    >
                        Джерело
                        {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
                        {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
                    </Button>
                )
            },
        },
        {
            accessorKey: "items",
            size: 100,
            header: "Пунктів",
            cell: ({ row }) => {
                const items = row.original.items as string[];
                return items?.length || 0;
            }
        },
        {
            accessorKey: "province",
            size: 150,
            header: "Воєводство",
        },
        {
            accessorKey: "status",
            size: 150,
            header: "Статус",
            cell: ({ row }) => (
                <Badge
                    className={cn(row.getValue('status') === Statuses.Approved ?
                        "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" :
                        "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800")}
                >
                    {row.getValue('status') === Statuses.Approved ? (
                        <><CircleCheck className="size-3 mr-1" /> Схвалено</>
                    ) : (
                        <><Clock className="size-3 mr-1" /> Очікує перевірки</>
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
                            onApprove(row.original);
                        }}
                        title="Схвалити"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                    >
                        <Check className="w-4 h-4" />
                    </Button>
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
                        variant="outline"
                        size="sm"
                        onClick={(e) => {
                            e.stopPropagation();
                            onReject(row.original.estateId, row.original.snapshotIndex);
                        }}
                        title="Відхилити"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                        <X className="w-4 h-4" />
                    </Button>
                </div>)
        }
    ]
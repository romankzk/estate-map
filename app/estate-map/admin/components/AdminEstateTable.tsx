"use client";

import * as React from "react"
import { Estate } from "@/app/estate-map/types";
import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, List, Check, X, CircleCheck, Clock, Search, ArrowUp, ArrowDown } from "lucide-react";
import { EstateTypes, PropertyTypes, Statuses } from "@/app/estate-map/utils/enums";
import { deleteEstate, updateEstate, updateEstateSnapshot, deleteEstateSnapshot } from "@/lib/data-utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { EditEstateDialog } from "./EditEstateDialog";
import { ManageSnapshotsDialog } from "./ManageSnapshotsDialog";
import { Badge } from "@/components/ui/badge";
import { EditSnapshotDialog } from "./EditSnapshotDialog";
import { cn } from "@/lib/utils";
import { TablePagination } from "../../components/ui/TablePagination";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group";

interface AdminEstateTableProps {
    estates: Estate[];
    pendingItems?: any[];
    pendingFilter?: boolean;
}

export function AdminEstateTable({ estates, pendingItems = [], pendingFilter = false }: AdminEstateTableProps) {
    const router = useRouter();
    const [editingEstate, setEditingEstate] = useState<Estate | null>(null);
    const [managingSnapshotsEstate, setManagingSnapshotsEstate] = useState<Estate | null>(null);
    const [editingSnapshot, setEditingSnapshot] = useState<{ estateId: number, index: number, snapshot: any } | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Ви впевнені, що хочете видалити "${name}"?`)) {
            try {
                await deleteEstate(id);
                toast.success(`"${name}" видалено`, { position: "bottom-center" });
                router.refresh();
            } catch (error) {
                toast.error(`Помилка: ${error}`, { position: "bottom-center" });
            }
        }
    };

    const handleRejectSnapshot = async (estateId: number, index: number) => {
        if (confirm(`Ви впевнені, що хочете видалити цей склад маєтку?`)) {
            try {
                await deleteEstateSnapshot(estateId, index);
                toast.success(`Склад відхилено та видалено`, { position: "bottom-center" });
                router.refresh();
            } catch (error) {
                toast.error(`Сталася помилка: ${error}`, { position: "bottom-center" });
            }
        }
    };

    const handleApproveEstate = async (estate: Estate) => {
        try {
            await updateEstate(estate.id, { ...estate, status: Statuses.Approved });
            toast.success(`"${estate.name}" схвалено`, { position: "bottom-center" });
            router.refresh();
        } catch (error) {
            toast.error(`Сталася помилка: ${error}`, { position: "bottom-center" });
        }
    };

    const handleApproveSnapshot = async (estateId: number, snapshotIndex: number, snapshot: any) => {
        try {
            await updateEstateSnapshot(estateId, snapshotIndex, { ...snapshot, status: Statuses.Approved });
            toast.success(`Склад маєтку схвалено`, { position: "bottom-center" });
            router.refresh();
        } catch (error) {
            toast.error(`Сталася помилка: ${error}`, { position: "bottom-center" });
        }
    };

    const displayData = useMemo(() => {
        if (!pendingFilter) {
            return estates;
        }
        else {
            return pendingItems;
        }
    }, [estates, pendingItems]);

    const columns = useMemo<ColumnDef<any>[]>(() => {
        const baseColumns: ColumnDef<any>[] = [
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
                accessorKey: "displayName",
                size: 200,
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            className="p-0"
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                        >
                            Назва
                            {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
                            {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
                        </Button>
                    )
                },
                cell: ({ row }) => (
                    <div className="flex flex-col truncate">
                        <span className="font-medium truncate">{row.original.displayName || row.original.name}</span>
                        {pendingFilter && (
                            <span className="text-xs text-muted-foreground truncate">{row.original.displayType}</span>
                        )}
                    </div>
                )
            },
            {
                accessorKey: "estateType",
                size: 100,
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            className="p-0"
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                        >
                            Тип
                            {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
                            {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const type = row.original.estateType;
                    return type ? (EstateTypes.get(type)?.label || type) : "-";
                },
            },
            {
                accessorKey: "propertyType",
                size: 120,
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            className="p-0"
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                        >
                            Власність
                            {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
                            {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const type = row.original.propertyType;
                    return type ? (PropertyTypes.get(type)?.label || type) : "-";
                },
            },
            {
                accessorKey: "province",
                size: 120,
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            className="p-0"
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                        >
                            Воєводство
                            {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
                            {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
                        </Button>
                    )
                },
                cell: ({ row }) => row.original.province || "-",
            },
            {
                accessorKey: "records",
                size: 100,
                header: ({ column }) => {
                    const isSorted = column.getIsSorted();
                    return (
                        <Button
                            variant="ghost"
                            className="p-0"
                            onClick={() => column.toggleSorting(isSorted === "asc")}
                        >
                            Записів
                            {isSorted === "asc" && <ArrowUp className="ml-1 size-3" />}
                            {isSorted === "desc" && <ArrowDown className="ml-1 size-3" />}
                        </Button>
                    )
                },
                cell: ({ row }) => {
                    const isSnapshot = row.original.type === 'snapshot';
                    if (!isSnapshot) {
                        return row.original.contents.length || "-";
                    } else {
                        return "-"
                    }
                }
            },
            {
                id: "status",
                size: 150,
                header: "Статус",
                cell: ({ row }) => (
                    <Badge
                        className={cn(row.original.status === Statuses.Approved ?
                            "bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300" :
                            "bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300")}
                    >
                        {row.original.status === Statuses.Approved ? (
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
                cell: ({ row }) => {
                    const item = row.original;
                    const isSnapshot = item.type === 'snapshot';
                    const isPending = item.status === Statuses.Pending;

                    return (
                        <div className="flex justify-end gap-2">
                            {isPending ? (
                                <>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => isSnapshot
                                            ? handleApproveSnapshot(item.estateId, item.snapshotIndex, item)
                                            : handleApproveEstate(item)
                                        }
                                        title="Схвалити"
                                        className="text-green-600 hover:text-green-700 hover:bg-green-50"
                                    >
                                        <Check className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => isSnapshot
                                            ? setEditingSnapshot({ estateId: item.estateId, index: item.snapshotIndex, snapshot: item })
                                            : setEditingEstate(item)
                                        }
                                        title="Редагувати"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => isSnapshot
                                            ? handleRejectSnapshot(item.estateId, item.snapshotIndex)
                                            : handleDelete(item.id, item.name)
                                        }
                                        title="Відхилити"
                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                    >
                                        <X className="w-4 h-4" />
                                    </Button>
                                </>
                            ) : (
                                <>
                                    {!isSnapshot && (
                                        <>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setManagingSnapshotsEstate(item)}
                                                title="Керувати складом"
                                            >
                                                <List className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingEstate(item)}
                                                title="Редагувати"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(item.id, item.name)}
                                                title="Видалити"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                    );
                },
            },
        ];

        return baseColumns;
    }, [pendingItems]);

    const [sorting, setSorting] = React.useState<SortingState>([
        {
            id: 'id',
            desc: false,
        },
    ])

    const table = useReactTable({
        data: displayData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
            sorting,
        },
    });

    return (
        <div className="space-y-4">
            {/* Table search input */}
            <div className="flex items-center gap-2">
                <InputGroup className="max-w-sm">
                    <InputGroupInput
                        placeholder="Шукати..."
                        value={globalFilter ?? ""}
                        onChange={(event) =>
                            setGlobalFilter(event.target.value)
                        }
                    />
                    <InputGroupAddon>
                        <Search />
                    </InputGroupAddon>
                </InputGroup>
            </div>
            <div className="rounded-md border">
                <Table className="table-fixed">
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead 
                                        key={header.id}
                                        style={{ width: `${header.getSize()}px` }}
                                    >
                                        {header.isPlaceholder
                                            ? null
                                            : flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                    </TableHead>
                                ))}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow key={row.id}>
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell 
                                            key={cell.id}
                                            className="truncate"
                                            style={{ width: `${cell.column.getSize()}px` }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center text-muted-foreground"
                                >
                                    Нічого не знайдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>

            {/* Pagination controls */}
            <TablePagination table={table} />

            {editingEstate && (
                <EditEstateDialog
                    estate={editingEstate}
                    open={!!editingEstate}
                    onOpenChange={(open) => !open && setEditingEstate(null)}
                    onSuccess={() => {
                        setEditingEstate(null);
                        router.refresh();
                    }}
                />
            )}

            {managingSnapshotsEstate && (
                <ManageSnapshotsDialog
                    estate={managingSnapshotsEstate}
                    open={!!managingSnapshotsEstate}
                    onOpenChange={(open) => !open && setManagingSnapshotsEstate(null)}
                    onSuccess={() => {
                        router.refresh();
                    }}
                />
            )}

            {editingSnapshot && (
                <EditSnapshotDialog
                    estateId={editingSnapshot.estateId}
                    snapshotIndex={editingSnapshot.index}
                    snapshot={editingSnapshot.snapshot}
                    open={!!editingSnapshot}
                    onOpenChange={(open) => !open && setEditingSnapshot(null)}
                    onSuccess={() => {
                        setEditingSnapshot(null);
                        router.refresh();
                    }}
                />
            )}
        </div>
    );
}

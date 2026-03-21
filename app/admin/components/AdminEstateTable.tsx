"use client";

import { Estate } from "@/app/estate-map/types";
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
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
import { Edit, Trash2, List, Check, X } from "lucide-react";
import { EstateTypes, PropertyTypes } from "@/app/estate-map/utils/enums";
import { deleteEstate, updateEstate, updateEstateSnapshot, deleteEstateSnapshot } from "@/lib/data-utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState, useMemo } from "react";
import { EditEstateDialog } from "./EditEstateDialog";
import { ManageSnapshotsDialog } from "./ManageSnapshotsDialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EditSnapshotDialog } from "./EditSnapshotDialog";

interface AdminEstateTableProps {
    estates: Estate[];
    onlyPending?: boolean;
}

export function AdminEstateTable({ estates, onlyPending = false }: AdminEstateTableProps) {
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
        if (confirm(`Ви впевнені, що хочете видалити цей склад маєтності?`)) {
            try {
                await deleteEstateSnapshot(estateId, index);
                toast.success(`Склад відхилено та видалено`, { position: "bottom-center" });
                router.refresh();
            } catch (error) {
                toast.error(`Помилка: ${error}`, { position: "bottom-center" });
            }
        }
    };

    const handleApproveEstate = async (estate: Estate) => {
        try {
            await updateEstate(estate.id, { ...estate, status: 'approved' });
            toast.success(`"${estate.name}" схвалено`, { position: "bottom-center" });
            router.refresh();
        } catch (error) {
            toast.error(`Помилка: ${error}`, { position: "bottom-center" });
        }
    };

    const handleApproveSnapshot = async (estateId: number, snapshotIndex: number, snapshot: any) => {
        try {
            await updateEstateSnapshot(estateId, snapshotIndex, { ...snapshot, status: 'approved' });
            toast.success(`Склад маєтності схвалено`, { position: "bottom-center" });
            router.refresh();
        } catch (error) {
            toast.error(`Помилка: ${error}`, { position: "bottom-center" });
        }
    };

    const displayData = useMemo(() => {
        if (!onlyPending) return estates;

        const pendingItems: any[] = [];

        estates.forEach(estate => {
            if (estate.status === 'pending') {
                pendingItems.push({
                    ...estate,
                    type: 'estate',
                    displayName: estate.name,
                    displayType: 'Маєтність'
                });
            }

            estate.contents?.forEach((snapshot, index) => {
                if (snapshot.status === 'pending') {
                    pendingItems.push({
                        ...snapshot,
                        id: `${estate.id}-snap-${index}`,
                        estateId: estate.id,
                        snapshotIndex: index,
                        type: 'snapshot',
                        displayName: `${estate.name} (${snapshot.date})`,
                        displayType: 'Склад маєтності'
                    });
                }
            });
        });

        return pendingItems;
    }, [estates, onlyPending]);

    const columns = useMemo<ColumnDef<any>[]>(() => {
        const baseColumns: ColumnDef<any>[] = [
            {
                accessorKey: "id",
                header: "ID",
            },
            {
                accessorKey: "displayName",
                header: "Назва",
                cell: ({ row }) => (
                    <div className="flex flex-col">
                        <span className="font-medium">{row.original.displayName || row.original.name}</span>
                        {onlyPending && (
                            <span className="text-xs text-muted-foreground">{row.original.displayType}</span>
                        )}
                    </div>
                )
            },
            {
                accessorKey: "estateType",
                header: "Тип",
                cell: ({ row }) => {
                    const type = row.original.estateType;
                    return type ? (EstateTypes.get(type)?.label || type) : "-";
                },
            },
            {
                accessorKey: "propertyType",
                header: "Власність",
                cell: ({ row }) => {
                    const type = row.original.propertyType;
                    return type ? (PropertyTypes.get(type)?.label || type) : "-";
                },
            },
            {
                accessorKey: "voivodeship",
                header: "Воєводство",
                cell: ({ row }) => row.original.voivodeship || "-",
            },
            {
                id: "status",
                header: "Статус",
                cell: ({ row }) => (
                    <Badge variant={row.original.status === 'approved' ? 'default' : 'secondary'}>
                        {row.original.status === 'approved' ? 'Схвалено' : 'Очікує'}
                    </Badge>
                )
            },
            {
                id: "actions",
                header: () => <div className="text-right">Дії</div>,
                cell: ({ row }) => {
                    const item = row.original;
                    const isSnapshot = item.type === 'snapshot';
                    const isPending = item.status === 'pending';

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
    }, [onlyPending]);

    const table = useReactTable({
        data: displayData,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
    });

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2">
                <Input
                    placeholder="Пошук..."
                    value={globalFilter ?? ""}
                    onChange={(event) => setGlobalFilter(event.target.value)}
                    className="max-w-sm"
                />
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => (
                                    <TableHead key={header.id}>
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
                                        <TableCell key={cell.id}>
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
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Попередня
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Наступна
                </Button>
            </div>

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

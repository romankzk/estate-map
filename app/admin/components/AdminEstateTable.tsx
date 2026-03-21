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
import { Edit, Trash2, List } from "lucide-react";
import { EstateTypes, PropertyTypes } from "@/app/estate-map/utils/enums";
import { deleteEstate } from "@/lib/data-utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import { EditEstateDialog } from "./EditEstateDialog";
import { ManageSnapshotsDialog } from "./ManageSnapshotsDialog";
import { Input } from "@/components/ui/input";

interface AdminEstateTableProps {
    estates: Estate[];
}

export function AdminEstateTable({ estates }: AdminEstateTableProps) {
    const router = useRouter();
    const [editingEstate, setEditingEstate] = useState<Estate | null>(null);
    const [managingSnapshotsEstate, setManagingSnapshotsEstate] = useState<Estate | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');

    const handleDelete = async (id: number, name: string) => {
        if (confirm(`Ви впевнені, що хочете видалити маєток "${name}"?`)) {
            try {
                await deleteEstate(id);
                toast.success(`Маєток "${name}" видалено`);
                router.refresh();
            } catch (error) {
                toast.error(`Помилка: ${error}`);
            }
        }
    };

    const columns: ColumnDef<Estate>[] = [
        {
            accessorKey: "id",
            header: "ID",
            className: "w-[80px]",
        } as any,
        {
            accessorKey: "name",
            header: "Назва",
        },
        {
            accessorKey: "estateType",
            header: "Тип",
            cell: ({ row }) => EstateTypes.get(row.getValue("estateType"))?.label || row.getValue("estateType"),
        },
        {
            accessorKey: "propertyType",
            header: "Власність",
            cell: ({ row }) => PropertyTypes.get(row.getValue("propertyType"))?.label || row.getValue("propertyType"),
        },
        {
            accessorKey: "voivodeship",
            header: "Воєводство",
        },
        {
            accessorKey: "contents",
            header: "Склад",
            cell: ({ row }) => {
                const contents = row.getValue("contents") as any[];
                return `${contents?.length || 0} зап.`;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-right">Дії</div>,
            cell: ({ row }) => {
                const estate = row.original;
                return (
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setManagingSnapshotsEstate(estate)}
                            title="Керувати складом"
                        >
                            <List className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingEstate(estate)}
                            title="Редагувати"
                        >
                            <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(estate.id, estate.name)}
                            title="Видалити"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const table = useReactTable({
        data: estates,
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
                                    className="h-24 text-center"
                                >
                                    Результатів не знайдено.
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
        </div>
    );
}

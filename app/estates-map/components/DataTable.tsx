"use client"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
} from "@tanstack/react-table"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { EstateTypes, PropertyTypes } from "../utils/enums"

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[],
    onOpenDrawer: (item: any) => void
}

export function DataTable<TData, TValue>({
    columns,
    data,
    onOpenDrawer
}: DataTableProps<TData, TValue>) {
    const [globalFilter, setGlobalFilter] = useState('')
    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            globalFilter,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const value = filterValue.toLowerCase()
            const estate = row.original as any

            // Get labels for keys
            const propertyTypeLabel = PropertyTypes.get(estate.propertyType)?.label ?? ''
            const estateTypeLabel = EstateTypes.get(estate.estateType)?.label ?? ''

            // Search in top-level fields and labels
            const searchableFields = [
                estate.name,
                estate.estateType,
                estateTypeLabel,
                estate.propertyType,
                propertyTypeLabel,
                estate.voivodeship,
                estate.district,
                estate.center
            ]

            if (searchableFields.some(field => field?.toString().toLowerCase().includes(value))) {
                return true
            }

            // Search in nested contents
            if (estate.contents && Array.isArray(estate.contents)) {
                return estate.contents.some((snapshot: any) => {
                    const inSnapshot = [
                        snapshot.date,
                        snapshot.owner,
                        snapshot.sourceSignature,
                        snapshot.notes
                    ].some(field => field?.toString().toLowerCase().includes(value))

                    if (inSnapshot) return true

                    // Search in items array
                    if (snapshot.items && Array.isArray(snapshot.items)) {
                        return snapshot.items.some((item: string) => 
                            item.toLowerCase().includes(value)
                        )
                    }

                    return false
                })
            }

            return false
        }
    })

    return (
        <div>
            <div className="flex items-center py-4 gap-2">
                <Input
                    placeholder="Шукати по всіх полях..."
                    value={globalFilter ?? ""}
                    onChange={(event) =>
                        setGlobalFilter(event.target.value)
                    }
                    className="max-w-sm"
                />
            </div>
            <div className="overflow-hidden rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    key={row.id}
                                    data-state={row.getIsSelected() && "selected"}
                                    onClick={() => onOpenDrawer(row)}
                                    className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#1F2937]/50"
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell key={cell.id}>
                                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columns.length} className="h-24 text-center">
                                    No results.
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
        </div>
    )
}
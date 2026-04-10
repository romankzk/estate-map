import {
    ColumnDef,
    SortingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
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
import { useMemo, useState, Fragment } from "react"
import { EstateTypes, PropertyTypes, Statuses } from "../../utils/enums"
import { Search, ChevronDown, ChevronRight, MapPin, Calendar, User, FileText, List } from "lucide-react"
import { TablePagination } from "../../components/ui/TablePagination"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Estate, EstateSnapshot } from "../../types"
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface PendingDataTableProps {
    columns: (
        onApprove: (data: any) => void,
        onReject: (...args: any[]) => void,
        onEdit: (data: any) => void
    ) => ColumnDef<any, any>[]
    data: any[],
    onApprove: (data: any) => void,
    onReject: (...args: any[]) => void,
    onEdit: (data: any) => void
}

export function PendingDataTable({
    columns,
    data,
    onApprove,
    onReject,
    onEdit
}: PendingDataTableProps) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'id',
            desc: false,
        },
    ]);

    const columnDefs = useMemo(() => columns(onApprove, onReject, onEdit), [columns, onApprove, onReject, onEdit]);

    const table = useReactTable({
        data,
        columns: columnDefs,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        state: {
            sorting,
            globalFilter,
        },
        autoResetPageIndex: false,
        globalFilterFn: (row, columnId, filterValue) => {
            const value = filterValue.toLowerCase()
            const item = row.original as any

            // Search in labels
            const propertyTypeLabel = item.propertyType ? (PropertyTypes.get(item.propertyType)?.label ?? '') : ''
            const estateTypeLabel = item.estateType ? (EstateTypes.get(item.estateType)?.label ?? '') : ''

            const searchableFields = [
                item.name,
                item.estateType,
                estateTypeLabel,
                item.propertyType,
                propertyTypeLabel,
                item.province,
                item.district,
                item.center,
                item.date,
                item.owner,
                item.sourceSignature
            ]

            if (searchableFields.some(field => field?.toString().toLowerCase().includes(value))) {
                return true
            }

            // Search in items array
            if (item.items && Array.isArray(item.items)) {
                return item.items.some((i: string) =>
                    i.toLowerCase().includes(value)
                )
            }

            return false
        }
    })

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
            <div className="overflow-hidden rounded-md border">
                <Table className="table-fixed">
                    <TableHeader className="bg-muted dark:bg-[#1F2937]">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
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
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => (
                                <Fragment key={row.id}>
                                    <TableRow
                                        className="hover:bg-zinc-50 dark:hover:bg-[#1F2937]/50 select-none"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className="truncate"
                                                style={{ width: `${cell.column.getSize()}px` }}
                                            >
                                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </Fragment>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={columnDefs.length} className="h-24 text-center">
                                    Нічого не знайдено
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            {/* Pagination */}
            <TablePagination table={table} />
        </div>
    )
}
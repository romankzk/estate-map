"use client"

import {
    ColumnDef,
    SortingState,
    ExpandedState,
    getExpandedRowModel,
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
import { useState, Fragment, useMemo } from "react"
import { EstateTypes, PropertyTypes, Statuses } from "../../utils/enums"
import { Search, ChevronRight, ChevronDown, MapPin, Calendar, User, FileText, List, Edit, Trash2 } from "lucide-react"
import { TablePagination } from "../../components/ui/TablePagination"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"
import { Estate } from "../../types"
import { EditEstateDialog } from "./EditEstateDialog"
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { ExpandedSnapshotList } from "./ExpandedSnapshotList"
import { deleteEstate } from "../actions"

interface AdminDataTableProps {
    columns: (
        onEdit: (data: Estate) => void, 
        onDelete: (id: number) => void
    ) => ColumnDef<Estate, any>[]
    data: Estate[],
}

export function AdminDataTable({
    columns,
    data,
}: AdminDataTableProps) {
    const router = useRouter();
    const [globalFilter, setGlobalFilter] = useState('');
    const [sorting, setSorting] = useState<SortingState>([
        {
            id: 'id',
            desc: false,
        },
    ]);

    const [editingEstate, setEditingEstate] = useState<Estate | null>(null);
    const [expanded, setExpanded] = useState<ExpandedState>({});

    /* Edit estate handler */
    const handleEdit = (estate: Estate) => setEditingEstate(estate);

    /* Delete estate handler */
    const handleDelete = async (id: number) => {
        if (confirm(`Ви впевнені, що хочете видалити цей маєток?`)) {
            try {
                await deleteEstate(id);
                toast.success(`Маєток видалено успішно`, { position: "bottom-center" });
                router.refresh();
            } catch (error) {
                toast.error(`Помилка: ${error}`, { position: "bottom-center" });
            }
        }
    };

    const columnDefs = useMemo(() => columns(handleEdit, handleDelete), [columns]);

    const table = useReactTable({
        data,
        columns: columnDefs,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onGlobalFilterChange: setGlobalFilter,
        getFilteredRowModel: getFilteredRowModel(),
        onExpandedChange: setExpanded,
        getExpandedRowModel: getExpandedRowModel(),
        getRowCanExpand: () => true,
        state: {
            sorting,
            globalFilter,
            expanded,
        },
        globalFilterFn: (row, columnId, filterValue) => {
            const value = filterValue.toLowerCase()
            const estate = row.original as any

            // Get labels for keys
            const propertyTypeLabel = (estate.propertyType && PropertyTypes.get(estate.propertyType)?.label) ?? ''
            const estateTypeLabel = (estate.estateType && EstateTypes.get(estate.estateType)?.label) ?? ''

            // Search in top-level fields and labels
            const searchableFields = [
                estate.name,
                estate.estateType,
                estateTypeLabel,
                estate.propertyType,
                propertyTypeLabel,
                estate.province,
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
                        snapshot.name,
                        snapshot.province,
                        snapshot.district,
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
        <div className="space-y-4">
            {/* Table search input */}
            <div className="flex items-center gap-2">
                <InputGroup className="max-w-sm">
                    <InputGroupInput
                        placeholder="Шукати"
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
                                        data-state={row.getIsExpanded() && "selected"}
                                        className="cursor-pointer hover:bg-zinc-50 dark:hover:bg-[#1F2937]/50 select-none"
                                        onClick={() => row.toggleExpanded()}
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
                                    {row.getIsExpanded() && (
                                        <TableRow className="bg-muted/30 hover:bg-muted/30 border-b-0">
                                            <TableCell colSpan={columnDefs.length} className="p-0">
                                                <Collapsible open={row.getIsExpanded()}>
                                                    <CollapsibleContent>
                                                        <div className="p-4 bg-muted/20 border-b">
                                                            <ExpandedSnapshotList data={row.original as any} />
                                                        </div>
                                                    </CollapsibleContent>
                                                </Collapsible>
                                            </TableCell>
                                        </TableRow>
                                    )}
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
        </div >
    )
}


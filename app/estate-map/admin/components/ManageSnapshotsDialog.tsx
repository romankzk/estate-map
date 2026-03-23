"use client";

import { Estate } from "@/app/estate-map/types";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Edit, Trash2 } from "lucide-react";
import { useState } from "react";
import { deleteEstateSnapshot } from "@/lib/data-utils";
import { toast } from "sonner";
import { EditSnapshotDialog } from "./EditSnapshotDialog";

interface ManageSnapshotsDialogProps {
    estate: Estate;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function ManageSnapshotsDialog({ estate, open, onOpenChange, onSuccess }: ManageSnapshotsDialogProps) {
    const [editingSnapshotIndex, setEditingSnapshotIndex] = useState<number | null>(null);

    const handleDelete = async (index: number) => {
        if (confirm(`Ви впевнені, що хочете видалити цей запис?`)) {
            try {
                await deleteEstateSnapshot(estate.id, index);
                toast.success("Запис видалено");
                onSuccess();
            } catch (error) {
                toast.error(`Помилка: ${error}`);
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto dark:border-[#374151] dark:bg-[#111827]">
                <DialogHeader>
                    <DialogTitle>Склад маєтку: {estate.name}</DialogTitle>
                </DialogHeader>
                
                <div className="py-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Рік</TableHead>
                                <TableHead>Сигнатура</TableHead>
                                <TableHead>Власник</TableHead>
                                <TableHead className="text-right">Дії</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {estate.contents?.map((snapshot, index) => (
                                <TableRow key={index}>
                                    <TableCell>{snapshot.date}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={snapshot.sourceSignature}>
                                        {snapshot.sourceSignature}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={snapshot.owner}>
                                        {snapshot.owner}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setEditingSnapshotIndex(index)}
                                            >
                                                <Edit className="w-4 h-4" />
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(index)}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!estate.contents || estate.contents.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                        Записи відсутні
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {editingSnapshotIndex !== null && (
                    <EditSnapshotDialog
                        estateId={estate.id}
                        snapshot={estate.contents![editingSnapshotIndex]}
                        snapshotIndex={editingSnapshotIndex}
                        open={editingSnapshotIndex !== null}
                        onOpenChange={(open) => !open && setEditingSnapshotIndex(null)}
                        onSuccess={() => {
                            setEditingSnapshotIndex(null);
                            onSuccess();
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

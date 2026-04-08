import { useRouter } from "next/navigation";
import { useState } from "react"
import { toast } from "sonner";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button";
import { CircleCheck, Clock, Edit, Trash2 } from "lucide-react";
import { EditSnapshotDialog } from "./EditSnapshotDialog";
import { Badge } from "@/components/ui/badge";
import { Statuses } from "../../utils/enums";
import { cn } from "@/lib/utils";
import { deleteSnapshot } from "../actions";

export function ExpandedSnapshotList({ data }: { data: any }) {
    const router = useRouter();
    const [editingSnapshot, setEditingSnapshot] = useState<{ id: number, snapshot: any } | null>(null);

    const handleDeleteSnapshot = async (id: number) => {
        if (confirm(`Ви впевнені, що хочете видалити цей запис про склад маєтку?`)) {
            try {
                await deleteSnapshot(id);
                toast.success(`Запис видалено`, { position: "bottom-center" });
                router.refresh();
            } catch (error) {
                toast.error(`Сталася помилка: ${error}`, { position: "bottom-center" });
            }
        }
    };
    // Determine if we have snapshots to show
    const snapshots = (data.snapshots || []);
    
    return (
        <div className="grid gap-6 animate-in fade-in slide-in-from-top-1 duration-200">
            {/* Snapshots list */}
            <div className="space-y-2 w-full">
                <div className="bg-background/40 p-3 rounded-xl border border-border/30">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Рік</TableHead>
                                <TableHead>Назва</TableHead>
                                <TableHead>Пунктів</TableHead>
                                <TableHead>Джерело</TableHead>
                                <TableHead>Воєводство</TableHead>
                                <TableHead>Повіт</TableHead>
                                <TableHead>Статус</TableHead>
                                <TableHead className="text-right">Дії</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {snapshots.map((snapshot: any, index: number) => (
                                <TableRow key={index}>
                                    <TableCell>{snapshot.year}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={snapshot.name}>
                                        {snapshot.name}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {snapshot.items?.length}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={snapshot.sourceSignature}>
                                        {snapshot.sourceSignature}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {snapshot.province}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        {snapshot.district}
                                    </TableCell>
                                    <TableCell className="max-w-[200px] truncate">
                                        <Badge
                                            className={cn(snapshot.status === Statuses.Approved ?
                                                "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800" :
                                                "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800")}
                                        >
                                            {snapshot.status === Statuses.Approved ? (
                                                <><CircleCheck /> Схвалено</>
                                            ) : (
                                                <><Clock /> Очікує перевірки</>
                                            )}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingSnapshot({
                                                        id: data.id,
                                                        snapshot: snapshot
                                                    });
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
                                                    handleDeleteSnapshot(data.id);
                                                }}
                                                title="Видалити"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {(!snapshots || snapshots.length === 0) && (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                                        Записи відсутні
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {editingSnapshot && (
                <EditSnapshotDialog
                    id={editingSnapshot.id}
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
"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge";
import { AdminDataTable } from "./components/AdminDataTable";
import { getEstateColumns } from './components/Columns';
import { PendingDataTable } from "./components/PendingDataTable";
import { getPendingEstateColumns, getPendingSnapshotColumns } from "./components/PendingColumns";
import { Statuses } from "../utils/enums";
import { useEffect, useState } from "react";
import { Estate } from "../types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { EditSnapshotDialog } from "./components/EditSnapshotDialog";
import { EditEstateDialog } from "./components/EditEstateDialog";
import { approveEstate, approveSnapshot, deleteEstate, deleteSnapshot, getAllEstates, getPendingSnapshots } from "./actions";

export default function AdminPage() {
    const router = useRouter();
    const [estates, setEstates] = useState<Estate[]>([]);
    const [pendingSnapshots, setPendingSnapshots] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    // Edit states
    const [editingEstate, setEditingEstate] = useState<Estate | null>(null);
    const [editingSnapshot, setEditingSnapshot] = useState<{ id: number, snapshot: any } | null>(null);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [estatesData, snapshotsData] = await Promise.all([
                getAllEstates(),
                getPendingSnapshots()
            ]);
            setEstates(estatesData);
            setPendingSnapshots(snapshotsData);
        } catch (error) {
            console.error("Failed to fetch admin data", error);
            toast.error("Помилка завантаження даних");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const pendingEstates = estates.filter(e => e.status === Statuses.Pending);

    const handleApproveEstate = async (estate: Estate) => {
        try {
            await approveEstate(estate.id);
            toast.success(`"${estate.name}" схвалено`);
            fetchData();
        } catch (error) {
            toast.error("Помилка при схваленні маєтку");
        }
    };

    const handleRejectEstate = async (id: number) => {
        if (confirm("Ви впевнені, що хочете відхилити та видалити цей маєток?")) {
            try {
                await deleteEstate(id);
                toast.success("Маєток відхилено та видалено");
                fetchData();
            } catch (error) {
                toast.error("Помилка при видаленні маєтку");
            }
        }
    };

    const handleApproveSnapshot = async (id: any) => {
        try {
            await approveSnapshot(id);
            toast.success(`Запис схвалено`);
            fetchData();
        } catch (error) {
            toast.error("Помилка при схваленні запису");
        }
    };

    const handleRejectSnapshot = async (id: number) => {
        if (confirm("Ви впевнені, що хочете відхилити та видалити цей запис?")) {
            try {
                await deleteSnapshot(id);
                toast.success("Запис відхилено та видалено");
                fetchData();
            } catch (error) {
                toast.error("Помилка при видаленні запису");
            }
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center min-h-screen">Завантаження...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111827]">
            <main className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[50px] py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F3F4F6]">Панель адміністратора</h1>
                        <p className="text-gray-600 dark:text-gray-400">Керування маєтками та їх складом</p>
                    </div>
                </div>

                <Tabs defaultValue="pending-estates">
                    <div className="mb-6">
                        <TabsList variant="line">
                            <TabsTrigger value="pending-estates">
                                Нові маєтки <Badge variant="outline" className="ml-1.5">{pendingEstates.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="pending-snapshots">
                                Нові записи <Badge variant="outline" className="ml-1.5">{pendingSnapshots.length}</Badge>
                            </TabsTrigger>
                            <TabsTrigger value="all-items">
                                Всі дані <Badge variant="outline" className="ml-1.5">{estates.length}</Badge>
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <TabsContent value="pending-estates" className="mt-0 outline-none">
                        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-6 border dark:border-[#374151]">
                            <PendingDataTable 
                                data={pendingEstates} 
                                columns={getPendingEstateColumns} 
                                onApprove={handleApproveEstate}
                                onReject={handleRejectEstate}
                                onEdit={(estate) => setEditingEstate(estate)}
                            />
                        </div>
                    </TabsContent>
                    
                    <TabsContent value="pending-snapshots" className="mt-0 outline-none">
                        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-6 border dark:border-[#374151]">
                            <PendingDataTable 
                                data={pendingSnapshots} 
                                columns={getPendingSnapshotColumns} 
                                onApprove={handleApproveSnapshot}
                                onReject={handleRejectSnapshot}
                                onEdit={(snapshot) => setEditingSnapshot({ 
                                    id: snapshot.id, 
                                    snapshot 
                                })}
                            />
                        </div>
                    </TabsContent>

                    <TabsContent value="all-items" className="mt-0 outline-none">
                        <div className="bg-white dark:bg-[#1F2937] rounded-xl shadow-sm p-6 border dark:border-[#374151]">
                            <AdminDataTable data={estates} columns={getEstateColumns} />
                        </div>
                    </TabsContent>
                </Tabs>
            </main>

            {editingEstate && (
                <EditEstateDialog
                    estate={editingEstate}
                    open={!!editingEstate}
                    onOpenChange={(open) => !open && setEditingEstate(null)}
                    onSuccess={() => {
                        setEditingEstate(null);
                        fetchData();
                    }}
                />
            )}

            {editingSnapshot && (
                <EditSnapshotDialog
                    id={editingSnapshot.id}
                    snapshot={editingSnapshot.snapshot}
                    open={!!editingSnapshot}
                    onOpenChange={(open) => !open && setEditingSnapshot(null)}
                    onSuccess={() => {
                        setEditingSnapshot(null);
                        fetchData();
                    }}
                />
            )}
        </div>
    );
}

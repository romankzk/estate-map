import { getAllEstates } from "@/lib/data-utils";
import { AdminEstateTable } from "./components/AdminEstateTable";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, List } from "lucide-react";

export default async function AdminPage() {
    const estates = await getAllEstates();

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#111827]">
            <main className="max-w-[1440px] mx-auto px-4 md:px-8 lg:px-[50px] py-8">
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-[#F3F4F6]">Панель адміністратора</h1>
                        <p className="text-gray-600 dark:text-gray-400">Керування маєтностями та їх складом</p>
                    </div>
                </div>

                <Tabs defaultValue="list">

                <div className="mb-6">
                    <TabsList variant="line">
                        <TabsTrigger value="list"><List className="size-4 mr-1" /> Список</TabsTrigger>
                        <TabsTrigger value="pending"><Clock className="size-4 mr-1" /> Запити на додавання</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="list" className="mt-0 outline-none">
                <div className="bg-white dark:bg-[#1F2937] rounded-lg shadow-sm p-6 border dark:border-[#374151]">
                    <div className="overflow-x-auto">
                        <AdminEstateTable estates={estates} />
                    </div>
                </div>
                </TabsContent>
                <TabsContent value="pending" className="mt-0 outline-none">
                    Запити на додавання
                </TabsContent>
                </Tabs>
            </main>
        </div>
    );
}

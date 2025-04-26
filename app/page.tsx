"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import RoomRentalForm from "./components/RoomRentalForm";
import RoomRentalTable from "./components/RoomRentalTable";

interface RoomRental {
  id: number;
  room_code: string;
  tenant_name: string;
  phone_number: string;
  start_date: string;
  payment_type_id: number;
  payment_type_name: string;
  notes: string;
}

export default function Home() {
  const [rentals, setRentals] = useState<RoomRental[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("manage");

  const fetchRentals = async () => {
    try {
      const response = await fetch(
        `/api/room-rentals${searchTerm ? `?search=${searchTerm}` : ""}`
      );
      const data = await response.json();
      setRentals(data);
    } catch (error) {
      console.error("Error fetching rentals:", error);
    }
  };

  useEffect(() => {
    fetchRentals();
  }, [searchTerm]);

  const handleDelete = async () => {
    try {
      await fetch(`/api/room-rentals?ids=${selectedIds.join(",")}`, {
        method: "DELETE",
      });

      setSelectedIds([]);
      setIsDeleteDialogOpen(false);

      await fetchRentals();
    } catch (error) {
      console.error("Error deleting rentals:", error);
    }
  };

  const handleAddSuccess = () => {
    fetchRentals();
    setActiveTab("manage");
  };

  return (
    <main className="container mx-auto py-6 px-4 max-w-7xl">
      <Card className="border-none shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-2xl font-bold text-slate-800">
            Quản lý phòng trọ
          </CardTitle>
          <CardDescription>
            Quản lý danh sách phòng trọ, người thuê và thông tin thanh toán
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <div className="flex items-center justify-between mb-4">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="manage">Danh sách phòng trọ</TabsTrigger>
                <TabsTrigger value="add">Thêm phòng trọ mới</TabsTrigger>
              </TabsList>

              {activeTab === "manage" && selectedIds.length > 0 && (
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setIsDeleteDialogOpen(true)}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa ({selectedIds.length})
                </Button>
              )}
            </div>

            <TabsContent value="add" className="mt-0">
              <RoomRentalForm onSuccess={handleAddSuccess} />
            </TabsContent>

            <TabsContent value="manage" className="mt-0">
              <RoomRentalTable
                rentals={rentals}
                selectedIds={selectedIds}
                onSelect={setSelectedIds}
              />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedIds.length} phòng trọ đã chọn
              không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}

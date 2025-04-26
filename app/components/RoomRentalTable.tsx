"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface RoomRental {
  id: number;
  room_code: string;
  tenant_name: string;
  phone_number: string;
  start_date: string;
  payment_type_name: string;
  notes: string;
}

interface RoomRentalTableProps {
  rentals: RoomRental[];
  selectedIds: number[];
  onSelect: (ids: number[]) => void;
}

export default function RoomRentalTable({
  rentals,
  selectedIds,
  onSelect,
}: RoomRentalTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredRentals, setFilteredRentals] = useState<RoomRental[]>(rentals);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredRentals(rentals);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase();
    const filtered = rentals.filter(
      (rental) =>
        rental.room_code.toLowerCase().includes(lowercasedSearch) ||
        rental.tenant_name.toLowerCase().includes(lowercasedSearch) ||
        rental.phone_number.toLowerCase().includes(lowercasedSearch) ||
        rental.payment_type_name.toLowerCase().includes(lowercasedSearch) ||
        (rental.notes && rental.notes.toLowerCase().includes(lowercasedSearch))
    );
    setFilteredRentals(filtered);
  }, [searchTerm, rentals]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      onSelect(filteredRentals.map((rental) => rental.id));
    } else {
      onSelect([]);
    }
  };

  const handleSelect = (id: number, checked: boolean) => {
    if (checked) {
      onSelect([...selectedIds, id]);
    } else {
      onSelect(selectedIds.filter((selectedId) => selectedId !== id));
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: vi });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Tìm kiếm phòng trọ..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {filteredRentals.length === 0 ? (
        <Card className="flex items-center justify-center p-8 text-center text-muted-foreground">
          {searchTerm
            ? "Không tìm thấy kết quả phù hợp. Vui lòng thử lại với từ khóa khác."
            : "Không có dữ liệu phòng trọ. Hãy thêm phòng trọ mới hoặc thay đổi điều kiện tìm kiếm."}
        </Card>
      ) : (
        <Card className="border shadow-sm overflow-hidden">
          <ScrollArea className="h-[calc(100vh-300px)] w-full">
            <Table>
              <TableHeader className="bg-muted/50 sticky top-0">
                <TableRow>
                  <TableHead className="w-[50px]">
                    <Checkbox
                      checked={
                        filteredRentals.length > 0 &&
                        selectedIds.length >= filteredRentals.length &&
                        filteredRentals.every((rental) =>
                          selectedIds.includes(rental.id)
                        )
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Select all"
                    />
                  </TableHead>
                  <TableHead className="w-[120px]">Mã phòng</TableHead>
                  <TableHead>Người thuê</TableHead>
                  <TableHead>Số điện thoại</TableHead>
                  <TableHead>Ngày bắt đầu</TableHead>
                  <TableHead>Thanh toán</TableHead>
                  <TableHead>Ghi chú</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRentals.map((rental) => (
                  <TableRow key={rental.id} className="hover:bg-muted/50">
                    <TableCell>
                      <Checkbox
                        checked={selectedIds.includes(rental.id)}
                        onCheckedChange={(checked) =>
                          handleSelect(rental.id, checked as boolean)
                        }
                        aria-label={`Select ${rental.room_code}`}
                      />
                    </TableCell>
                    <TableCell className="font-medium">
                      {rental.room_code}
                    </TableCell>
                    <TableCell>{rental.tenant_name}</TableCell>
                    <TableCell>{rental.phone_number}</TableCell>
                    <TableCell>{formatDate(rental.start_date)}</TableCell>
                    <TableCell>{rental.payment_type_name}</TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {rental.notes || "-"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </ScrollArea>
        </Card>
      )}
    </div>
  );
}

"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format, isBefore } from "date-fns";
import { vi } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface PaymentType {
  id: number;
  name: string;
}

interface RoomRentalFormProps {
  onSuccess: () => void;
}

const PAYMENT_TYPES = [
  { id: 1, name: "Theo tháng" },
  { id: 2, name: "Theo quý" },
  { id: 3, name: "Theo năm" },
];

const formSchema = z.object({
  room_code: z.string().min(1, "Mã phòng trọ không được để trống"),
  tenant_name: z
    .string()
    .min(5, "Tên người thuê phải có ít nhất 5 ký tự")
    .max(50, "Tên người thuê không được vượt quá 50 ký tự")
    .regex(
      /^[a-zA-ZÀ-ỹ\s]+$/,
      "Tên người thuê không được chứa số hoặc ký tự đặc biệt"
    ),
  phone_number: z
    .string()
    .length(10, "Số điện thoại phải có đúng 10 ký tự")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  start_date: z
    .date({
      required_error: "Vui lòng chọn ngày bắt đầu thuê",
    })
    .refine(
      (date) => !isBefore(date, new Date(new Date().setHours(0, 0, 0, 0))),
      "Ngày bắt đầu thuê không được là ngày trong quá khứ"
    ),
  payment_type_id: z.string({
    required_error: "Vui lòng chọn hình thức thanh toán",
  }),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function RoomRentalForm({ onSuccess }: RoomRentalFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_code: "",
      tenant_name: "",
      phone_number: "",
      notes: "",
    },
  });

  const handleSubmit = async (values: FormValues) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/room-rentals", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          start_date: format(values.start_date, "yyyy-MM-dd"),
          payment_type_id: Number.parseInt(values.payment_type_id),
        }),
      });

      if (response.ok) {
        form.reset();
        onSuccess();
      } else {
        const error = await response.json();
        console.error("Server error:", error);
      }
    } catch (error) {
      console.error("Error creating room rental:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border shadow-sm">
      <CardContent className="pt-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="room_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mã phòng trọ</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập mã phòng trọ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tenant_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tên người thuê</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập tên người thuê" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone_number"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input placeholder="Nhập số điện thoại" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Ngày bắt đầu thuê</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(field.value, "dd/MM/yyyy", { locale: vi })
                            ) : (
                              <span>Chọn ngày</span>
                            )}
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            isBefore(
                              date,
                              new Date(new Date().setHours(0, 0, 0, 0))
                            )
                          }
                          initialFocus
                          locale={vi}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="payment_type_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hình thức thanh toán</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn hình thức thanh toán" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {PAYMENT_TYPES.map((type) => (
                          <SelectItem key={type.id} value={type.id.toString()}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Ghi chú</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Nhập ghi chú (nếu có)"
                        className="min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Đang xử lý
                  </>
                ) : (
                  "Thêm mới"
                )}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";

import { Calendar } from "@/components/ui/calendar";

// Navigation only: selecting a date updates the `date` search param.
// Data is fetched by the server component page, not here.
export function DatePicker({ date }: { date: Date }) {
  const router = useRouter();

  return (
    <Calendar
      mode="single"
      selected={date}
      defaultMonth={date}
      onSelect={(selected) => {
        if (selected) {
          router.push(`/dashboard?date=${format(selected, "yyyy-MM-dd")}`);
        }
      }}
    />
  );
}

"use client";

import { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Placeholder data for UI only; to be replaced by real data fetching.
const workouts = [
  { id: 1, name: "Upper Body Push", exercises: 5, sets: 18, duration: "62 min" },
  { id: 2, name: "Evening Mobility", exercises: 4, sets: 8, duration: "25 min" },
];

export default function DashboardPage() {
  const [date, setDate] = useState<Date>(new Date());
  const [open, setOpen] = useState(false);

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger
            render={
              <Button variant="outline" className="w-56 justify-start gap-2" />
            }
          >
            <CalendarIcon />
            {format(date, "do MMM yyyy")}
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="end">
            <Calendar
              mode="single"
              selected={date}
              defaultMonth={date}
              onSelect={(selected) => {
                if (selected) {
                  setDate(selected);
                  setOpen(false);
                }
              }}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workouts</CardTitle>
          <CardDescription>
            Logged on {format(date, "do MMM yyyy")}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {workouts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No workouts logged for this date.
            </p>
          ) : (
            workouts.map((workout) => (
              <Card key={workout.id} size="sm">
                <CardHeader>
                  <CardTitle>{workout.name}</CardTitle>
                  <CardDescription>{workout.duration}</CardDescription>
                </CardHeader>
                <CardContent className="flex gap-2">
                  <Badge variant="secondary">
                    {workout.exercises} exercises
                  </Badge>
                  <Badge variant="secondary">{workout.sets} sets</Badge>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  );
}

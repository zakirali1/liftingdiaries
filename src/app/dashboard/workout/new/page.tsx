"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { format, isValid, parse } from "date-fns";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { createWorkoutAction } from "./actions";

export default function NewWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dateParam = searchParams.get("date");
  const parsed = dateParam
    ? parse(dateParam, "yyyy-MM-dd", new Date())
    : new Date();

  const [name, setName] = useState("");
  const [date, setDate] = useState<Date>(isValid(parsed) ? parsed : new Date());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        await createWorkoutAction({ name, startedAt: date });
      } catch {
        setError("Could not create the workout. Please try again.");
        return;
      }
      router.push(`/dashboard?date=${format(date, "yyyy-MM-dd")}`);
    });
  }

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle>New workout</CardTitle>
          <CardDescription>Log a new workout session.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="e.g. Push day"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label>Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button variant="outline" className="w-fit justify-start" />
                  }
                >
                  {format(date, "do MMM yyyy")}
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    defaultMonth={date}
                    onSelect={(selected) => selected && setDate(selected)}
                  />
                </PopoverContent>
              </Popover>
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="flex gap-2">
              <Button type="submit" disabled={isPending}>
                {isPending ? "Creating..." : "Create workout"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}

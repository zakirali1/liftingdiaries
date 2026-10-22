import Link from "next/link";
import {
  format,
  formatDuration,
  intervalToDuration,
  isValid,
  parse,
} from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getWorkoutsForDate } from "@/data/workouts";
import { DatePicker } from "./date-picker";

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date: dateParam } = await searchParams;
  const parsed = dateParam
    ? parse(dateParam, "yyyy-MM-dd", new Date())
    : new Date();
  const date = isValid(parsed) ? parsed : new Date();

  const workouts = await getWorkoutsForDate(date);

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-col gap-6 p-6">
      <h1 className="text-2xl font-semibold">Dashboard</h1>

      <div className="flex flex-col items-start gap-6 md:flex-row">
        <Card className="w-fit shrink-0">
          <CardContent>
            <DatePicker date={date} />
          </CardContent>
        </Card>

        <Card className="w-full min-w-0 flex-1">
          <CardHeader>
            <CardTitle>Workouts</CardTitle>
            <CardDescription>
              Logged on {format(date, "do MMM yyyy")}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {workouts.length === 0 ? (
              <div className="flex flex-col items-start gap-3">
                <p className="text-sm text-muted-foreground">
                  No workouts logged for this date.
                </p>
                <Button
                  nativeButton={false}
                  render={
                    <Link
                      href={`/workouts/new?date=${format(date, "yyyy-MM-dd")}`}
                    />
                  }
                >
                  Add a new log
                </Button>
              </div>
            ) : (
              workouts.map((workout) => (
                <Card key={workout.id} size="sm">
                  <CardHeader>
                    <CardTitle>{workout.name ?? "Untitled workout"}</CardTitle>
                    <CardDescription>
                      {workout.completedAt
                        ? formatDuration(
                            intervalToDuration({
                              start: workout.startedAt,
                              end: workout.completedAt,
                            }),
                            { format: ["hours", "minutes"] },
                          ) || "Under a minute"
                        : "In progress"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Badge variant="secondary">
                      {workout.exerciseCount} exercises
                    </Badge>
                    <Badge variant="secondary">{workout.setCount} sets</Badge>
                  </CardContent>
                </Card>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  );
}

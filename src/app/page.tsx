import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { CalendarIcon, DumbbellIcon, TrendingUpIcon } from "lucide-react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: DumbbellIcon,
    title: "Log workouts",
    description:
      "Record every exercise, set, rep and weight in seconds.",
  },
  {
    icon: CalendarIcon,
    title: "Browse by date",
    description:
      "Pick any day on the calendar to look back at what you lifted.",
  },
  {
    icon: TrendingUpIcon,
    title: "Track progress",
    description:
      "See how your lifts improve over time and keep pushing forward.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 p-6">
      <section className="flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Your lifting journey, logged.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Lifting Diaries is a simple way to log your workouts and track your
          progress over time.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-3">
        {features.map(({ icon: Icon, title, description }) => (
          <Card key={title}>
            <CardHeader>
              <Icon className="size-6" />
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </section>
    </main>
  );
}

import { redirect } from "next/navigation";
import { SignInButton, SignUpButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CalendarDaysIcon, DumbbellIcon, TrendingUpIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const features = [
  {
    icon: DumbbellIcon,
    title: "Log every workout",
    description:
      "Record exercises, sets, reps and weight in seconds, right when you finish a set.",
  },
  {
    icon: CalendarDaysIcon,
    title: "Browse by date",
    description:
      "Pick any day on the calendar to look back at what you lifted and how long it took.",
  },
  {
    icon: TrendingUpIcon,
    title: "Track your progress",
    description:
      "Keep a diary of your training so you can see yourself getting stronger over time.",
  },
];

export default async function Home() {
  const { userId } = await auth();
  if (userId) redirect("/dashboard");

  return (
    <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-12 p-6 py-12">
      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
          Your lifting journey, logged.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Lifting Diaries is a simple way to log your workouts and track your
          progress, one session at a time.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <SignUpButton mode="modal">
            <Button size="lg">Get started</Button>
          </SignUpButton>
          <SignInButton mode="modal">
            <Button size="lg" variant="outline">
              Sign in
            </Button>
          </SignInButton>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
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

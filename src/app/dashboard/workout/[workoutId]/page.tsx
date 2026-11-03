import { notFound } from "next/navigation";

import { getWorkout } from "@/data/workouts";
import { EditWorkoutForm } from "./edit-workout-form";

export default async function EditWorkoutPage({
  params,
}: {
  params: Promise<{ workoutId: string }>;
}) {
  const { workoutId } = await params;
  const id = Number(workoutId);
  if (!Number.isInteger(id) || id <= 0) notFound();

  const workout = await getWorkout(id);
  if (!workout) notFound();

  return (
    <main className="mx-auto flex w-full max-w-xl flex-col gap-6 p-6">
      <EditWorkoutForm
        workout={{
          id: workout.id,
          name: workout.name,
          startedAt: workout.startedAt,
        }}
      />
    </main>
  );
}

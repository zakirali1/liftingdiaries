import { NewWorkoutForm } from "./new-workout-form";

export default async function NewWorkoutPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>;
}) {
  const { date } = await searchParams;

  return <NewWorkoutForm initialDate={date} />;
}

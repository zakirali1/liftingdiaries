import { auth } from '@clerk/nextjs/server';
import { addDays, startOfDay } from 'date-fns';
import { and, eq } from 'drizzle-orm';
import { db } from '@/db';
import { workouts } from '@/db/schema';

export async function getWorkoutsForDate(date: Date) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const start = startOfDay(date);
  const end = addDays(start, 1);

  const rows = await db.query.workouts.findMany({
    where: { userId, startedAt: { gte: start, lt: end } },
    orderBy: { startedAt: 'asc' },
    with: {
      workoutExercises: {
        columns: { id: true },
        with: { sets: { columns: { id: true } } },
      },
    },
  });

  return rows.map((workout) => ({
    id: workout.id,
    name: workout.name,
    startedAt: workout.startedAt,
    completedAt: workout.completedAt,
    exerciseCount: workout.workoutExercises.length,
    setCount: workout.workoutExercises.reduce((total, we) => total + we.sets.length, 0),
  }));
}

export async function createWorkout(data: { name: string | null; startedAt: Date }) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const [workout] = await db
    .insert(workouts)
    .values({ ...data, userId })
    .returning();

  return workout;
}

export async function getWorkout(workoutId: number) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  return db.query.workouts.findFirst({
    where: { id: workoutId, userId },
  });
}

export async function updateWorkout(
  workoutId: number,
  data: { name: string | null; startedAt: Date },
) {
  const { userId } = await auth();
  if (!userId) throw new Error('Unauthorized');

  const [workout] = await db
    .update(workouts)
    .set(data)
    .where(and(eq(workouts.id, workoutId), eq(workouts.userId, userId)))
    .returning();

  return workout;
}

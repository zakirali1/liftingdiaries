import { auth } from '@clerk/nextjs/server';
import { addDays, startOfDay } from 'date-fns';
import { db } from '@/db';

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

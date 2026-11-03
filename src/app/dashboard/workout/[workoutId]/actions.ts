'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { updateWorkout } from '@/data/workouts';

const updateWorkoutSchema = z.object({
  workoutId: z.number().int().positive(),
  name: z.string().trim().max(100).nullable(),
  startedAt: z.coerce.date(),
});

type UpdateWorkoutParams = z.infer<typeof updateWorkoutSchema>;

export async function updateWorkoutAction(params: UpdateWorkoutParams) {
  const { workoutId, ...data } = updateWorkoutSchema.parse(params);

  const workout = await updateWorkout(workoutId, { ...data, name: data.name || null });
  if (!workout) throw new Error('Workout not found');

  revalidatePath('/dashboard');
  return workout;
}

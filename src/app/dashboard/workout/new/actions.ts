'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { createWorkout } from '@/data/workouts';

const createWorkoutSchema = z.object({
  name: z.string().trim().max(100).nullable(),
  startedAt: z.coerce.date(),
});

type CreateWorkoutParams = z.infer<typeof createWorkoutSchema>;

export async function createWorkoutAction(params: CreateWorkoutParams) {
  const data = createWorkoutSchema.parse(params);

  const workout = await createWorkout({ ...data, name: data.name || null });

  revalidatePath('/dashboard');
  return workout;
}

import { sql } from 'drizzle-orm';
import {
  boolean,
  check,
  index,
  integer,
  numeric,
  pgTable,
  text,
  timestamp,
  unique,
} from 'drizzle-orm/pg-core';

const createdAt = () => timestamp('created_at', { withTimezone: true }).notNull().defaultNow();
const updatedAt = () =>
  timestamp('updated_at', { withTimezone: true })
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date());

// Exercise catalog. user_id null = shared/seed exercise, otherwise user-created (Clerk user id).
export const exercises = pgTable(
  'exercises',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id'),
    name: text().notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [unique('exercises_user_id_name_unique').on(t.userId, t.name).nullsNotDistinct()],
);

export const workouts = pgTable(
  'workouts',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: text('user_id').notNull(),
    name: text(),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    completedAt: timestamp('completed_at', { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [index('workouts_user_id_started_at_idx').on(t.userId, t.startedAt.desc())],
);

// An exercise performed within a workout.
export const workoutExercises = pgTable(
  'workout_exercises',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    workoutId: integer('workout_id')
      .notNull()
      .references(() => workouts.id, { onDelete: 'cascade' }),
    exerciseId: integer('exercise_id')
      .notNull()
      .references(() => exercises.id, { onDelete: 'restrict' }),
    order: integer('order').notNull(),
    createdAt: createdAt(),
  },
  (t) => [
    unique('workout_exercises_workout_id_order_unique').on(t.workoutId, t.order),
    index('workout_exercises_exercise_id_idx').on(t.exerciseId),
  ],
);

export const sets = pgTable(
  'sets',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    workoutExerciseId: integer('workout_exercise_id')
      .notNull()
      .references(() => workoutExercises.id, { onDelete: 'cascade' }),
    setNumber: integer('set_number').notNull(),
    reps: integer().notNull(),
    // Always stored in kg; null = bodyweight. Unit conversion is a UI concern.
    weightKg: numeric('weight_kg', { precision: 7, scale: 2 }),
    isWarmup: boolean('is_warmup').notNull().default(false),
    createdAt: createdAt(),
  },
  (t) => [
    unique('sets_workout_exercise_id_set_number_unique').on(t.workoutExerciseId, t.setNumber),
    check('sets_reps_nonnegative', sql`${t.reps} >= 0`),
  ],
);

export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type WorkoutExercise = typeof workoutExercises.$inferSelect;
export type NewWorkoutExercise = typeof workoutExercises.$inferInsert;
export type WorkoutSet = typeof sets.$inferSelect;
export type NewWorkoutSet = typeof sets.$inferInsert;

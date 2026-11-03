import { sql } from 'drizzle-orm'
import { db } from './index'

// Workouts (with exercises and sets) whose performed_at falls on `date` (YYYY-MM-DD) in `timeZone`.
export function getWorkoutsForDate(userId: string, date: string, timeZone: string) {
  return db.query.workouts.findMany({
    where: {
      userId,
      RAW: (t) => sql`(${t.performedAt} at time zone ${timeZone})::date = ${date}::date`,
    },
    orderBy: { performedAt: 'asc' },
    with: {
      workoutExercises: {
        orderBy: { order: 'asc' },
        with: {
          exercise: true,
          sets: { orderBy: { setNumber: 'asc' } },
        },
      },
    },
  })
}

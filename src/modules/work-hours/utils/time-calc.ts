import {
  LUNCH_BREAK_HOURS,
  MIN_HOURS_FOR_LUNCH,
  WEEKLY_NORMAL_HOURS,
  WORK_HOURS_PER_DAY,
} from '../work-hours.constants';

export interface DailyHours {
  totalWorked: number;
  normalHours: number;
  overtimeHours: number;
}

export interface WeeklyHours {
  totalWorked: number;
  weeklyNormal: number;
  weeklyOvertime: number;
}

export function calcDailyHours(clockIn: Date, clockOut: Date): DailyHours {
  const totalMs = new Date(clockOut).getTime() - new Date(clockIn).getTime();
  const totalHours = totalMs / (1000 * 60 * 60);

  const lunchBreak = totalHours >= MIN_HOURS_FOR_LUNCH ? LUNCH_BREAK_HOURS : 0;
  const workedHours = Math.max(totalHours - lunchBreak, 0);

  return {
    totalWorked: parseFloat(workedHours.toFixed(2)),
    normalHours: parseFloat(Math.min(workedHours, WORK_HOURS_PER_DAY).toFixed(2)),
    overtimeHours: parseFloat(Math.max(workedHours - WORK_HOURS_PER_DAY, 0).toFixed(2)),
  };
}

export function calcWeeklyHours(
  logs: { normalHours: number; overtimeHours: number }[],
): WeeklyHours {
  const totalWorked = logs.reduce(
    (sum, log) => sum + (log.normalHours || 0) + (log.overtimeHours || 0),
    0,
  );

  return {
    totalWorked: parseFloat(totalWorked.toFixed(2)),
    weeklyNormal: parseFloat(Math.min(totalWorked, WEEKLY_NORMAL_HOURS).toFixed(2)),
    weeklyOvertime: parseFloat(Math.max(totalWorked - WEEKLY_NORMAL_HOURS, 0).toFixed(2)),
  };
}

export function startOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function endOfDay(date: Date = new Date()): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export function daysAgo(n: number): Date {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
}

import { DAYS_OF_WEEK_IN_ORDER } from '@/constants';

export type DayOfWeek = typeof DAYS_OF_WEEK_IN_ORDER[number];

export interface ScheduleAvailability {
  dayOfWeek: DayOfWeek;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
}

export interface Schedule {
  id?: string;
  timezone: string;
  availabilities: ScheduleAvailability[];
  clerkUserId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ScheduleFormData {
  timezone: string;
  availabilities: ScheduleAvailability[];
}

export interface ScheduleStats {
  totalSlots: number;
  availableSlots: number;
  bookedSlots: number;
  blockedSlots: number;
}

// For UI purposes - represents the visual schedule grid
export interface WeeklyScheduleView {
  [dayOfWeek: string]: {
    [timeSlot: string]: 'available' | 'booked' | 'blocked' | 'empty';
  };
}
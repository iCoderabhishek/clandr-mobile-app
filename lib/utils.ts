/**
 * Convert time string (HH:MM) to float representation
 * Example: "09:30" -> 9.5, "14:00" -> 14.0
 */
export function timeToFloat(timeString: string): number {
  const [hours, minutes] = timeString.split(':').map(Number);
  return hours + minutes / 60;
}

/**
 * Convert float time back to HH:MM string
 * Example: 9.5 -> "09:30", 14.0 -> "14:00"
 */
export function floatToTime(timeFloat: number): string {
  const hours = Math.floor(timeFloat);
  const minutes = Math.round((timeFloat - hours) * 60);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

/**
 * Generate time slots array for UI
 */
export function generateTimeSlots(startHour = 6, endHour = 22, intervalMinutes = 30): string[] {
  const slots = [];
  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += intervalMinutes) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(timeString);
    }
  }
  return slots;
}

/**
 * Check if a time slot falls within any availability window
 */

import { ScheduleAvailability, ScheduleFormData } from '@/types/schedule';

export function isTimeAvailable(time: string, availabilities: ScheduleAvailability[], dayOfWeek: string): boolean {
  const timeFloat = timeToFloat(time);
  
  return availabilities.some(availability => 
    availability.dayOfWeek === dayOfWeek &&
    timeFloat >= timeToFloat(availability.startTime) &&
    timeFloat < timeToFloat(availability.endTime)
  );
}

/**
 * Convert backend schedule data to UI format for display
 */
export function convertBackendToUISchedule(backendSchedule: any): any {
  if (!backendSchedule?.availabilities) {
    return {};
  }

  const uiSchedule: any = {};
  const timeSlots = generateTimeSlots(6, 22, 30);
  
  // Initialize all days with empty slots
  const days = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
  days.forEach(day => {
    uiSchedule[day.toLowerCase()] = {};
    timeSlots.forEach(time => {
      uiSchedule[day.toLowerCase()][time] = 'empty';
    });
  });

  // Fill in available slots based on availabilities
  backendSchedule.availabilities.forEach((availability: ScheduleAvailability) => {
    const dayKey = availability.dayOfWeek.toLowerCase();
    timeSlots.forEach(time => {
      if (isTimeAvailable(time, [availability], availability.dayOfWeek)) {
        uiSchedule[dayKey][time] = 'available';
      }
    });
  });

  return uiSchedule;
}

/**
 * Convert UI schedule format to backend format
 */
export function convertUIToBackendSchedule(uiSchedule: any, timezone: string): ScheduleFormData {
  const availabilities: ScheduleAvailability[] = [];
  
  Object.entries(uiSchedule).forEach(([day, slots]: [string, any]) => {
    const dayOfWeek = day.toUpperCase() as any;
    let currentWindow: { start: string | null; end: string | null } = { start: null, end: null };
    
    const timeSlots = Object.keys(slots).sort();
    
    timeSlots.forEach((time, index) => {
      const status = slots[time];
      const nextTime = timeSlots[index + 1];
      const nextStatus = nextTime ? slots[nextTime] : 'empty';
      
      if (status === 'available' && !currentWindow.start) {
        currentWindow.start = time;
      }
      
      if (status === 'available' && (nextStatus !== 'available' || !nextTime)) {
        if (currentWindow.start) {
          // Calculate end time (30 minutes after current slot)
          const endTimeFloat = timeToFloat(time) + 0.5;
          currentWindow.end = floatToTime(endTimeFloat);
          
          availabilities.push({
            dayOfWeek: dayOfWeek,
            startTime: currentWindow.start,
            endTime: currentWindow.end
          });
          
          currentWindow = { start: null, end: null };
        }
      }
    });
  });
  
  return {
    timezone,
    availabilities
  };
}

/**
 * Calculate schedule statistics from backend data
 */
export function calculateScheduleStats(backendSchedule: any) {
  if (!backendSchedule?.availabilities) {
    return {
      totalSlots: 0,
      availableSlots: 0,
      bookedSlots: 0,
      blockedSlots: 0
    };
  }

  const timeSlots = generateTimeSlots(6, 22, 30);
  let availableSlots = 0;
  
  backendSchedule.availabilities.forEach((availability: ScheduleAvailability) => {
    timeSlots.forEach(time => {
      if (isTimeAvailable(time, [availability], availability.dayOfWeek)) {
        availableSlots++;
      }
    });
  });

  return {
    totalSlots: timeSlots.length * 7, // 7 days
    availableSlots,
    bookedSlots: 0, // TODO: Calculate from bookings
    blockedSlots: 0
  };
}
/**
 * Get user's timezone
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
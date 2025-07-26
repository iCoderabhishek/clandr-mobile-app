import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiClient, Event, Meeting, Schedule } from './api';

// Query Keys
export const queryKeys = {
  events: ['events'] as const,
  event: (id: number) => ['events', id] as const,
  schedule: ['schedule'] as const,
  meetings: ['meetings'] as const,
  publicEvents: (userId: string) => ['publicEvents', userId] as const,
  bookingAvailability: (userId: string, eventId: string) => 
    ['bookingAvailability', userId, eventId] as const,
};

// Events Queries
export const useEvents = () => {
  return useQuery({
    queryKey: queryKeys.events,
    queryFn: () => apiClient.getEvents(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useEvent = (id: number) => {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: () => apiClient.getEvent(id),
    enabled: !!id,
  });
};

export const useCreateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (event: Omit<Event, 'id' | 'created' | 'userId' | 'bookings'>) =>
      apiClient.createEvent(event),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
    },
  });
};

export const useUpdateEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, event }: { id: number; event: Partial<Event> }) =>
      apiClient.updateEvent(id, event),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
      queryClient.invalidateQueries({ queryKey: queryKeys.event(variables.id) });
    },
  });
};

export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: number) => apiClient.deleteEvent(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.events });
    },
  });
};

// Schedule Queries
export const useSchedule = () => {
  return useQuery({
    queryKey: queryKeys.schedule,
    queryFn: () => apiClient.getSchedule(),
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

export const useSaveSchedule = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (schedule: Omit<Schedule, 'id' | 'userId'>) =>
      apiClient.saveSchedule(schedule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.schedule });
    },
  });
};

// Meeting Queries
export const useCreateMeeting = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (meeting: Omit<Meeting, 'id' | 'userId'>) =>
      apiClient.createMeeting(meeting),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.meetings });
    },
  });
};

// Public Booking Queries
export const usePublicEvents = (userId: string) => {
  return useQuery({
    queryKey: queryKeys.publicEvents(userId),
    queryFn: () => apiClient.getPublicEvents(userId),
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useBookingAvailability = (userId: string, eventId: string) => {
  return useQuery({
    queryKey: queryKeys.bookingAvailability(userId, eventId),
    queryFn: () => apiClient.getBookingAvailability(userId, eventId),
    enabled: !!userId && !!eventId,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
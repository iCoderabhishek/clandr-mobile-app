import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { useAuth } from '@clerk/clerk-expo';
import { Platform } from 'react-native';
import React from 'react';

// API Configuration
const getApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  
  // Debug logging
  console.log('Environment API URL:', envUrl);
  console.log('Platform:', Platform.OS);
  
  // Platform-specific URL handling
  if (Platform.OS === 'android') {
    // For Android emulator, try localhost alternatives
    return envUrl || 'http://10.0.2.2:3000'; // Android emulator localhost
  } else if (Platform.OS === 'ios') {
    // For iOS simulator
    return envUrl || 'http://localhost:3000';
  } else {
    // For web or other platforms
    return envUrl || 'http://172.23.11.102:3000';
  }
};

const API_URL = getApiUrl();

console.log('Final API URL:', API_URL);

// Types
export interface Event {
  id: number;
  title: string;
  description: string;
  duration: number;
  active: boolean;
  bookings: number;
  created: string;
  userId: string;
}

export interface Schedule {
  id: string;
  userId: string;
  weeklySchedule: Record<string, Record<string, string>>;
  stats: {
    totalSlots: number;
    availableSlots: number;
    bookedSlots: number;
    blockedSlots: number;
  };
}

export interface Meeting {
  id: string;
  eventId: string;
  userId: string;
  guestName: string;
  guestEmail: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface PublicEvent {
  id: number;
  title: string;
  description: string;
  duration: number;
  active: boolean;
  bookings: number;
}

// API Client Class
class ApiClient {
  private client: AxiosInstance;
  private getToken: (() => Promise<string | null>) | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000, // Increased timeout
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      async (config) => {
        if (this.getToken) {
          const token = await this.getToken();
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error Details:', {
          message: error.message,
          code: error.code,
          config: {
            url: error.config?.url,
            method: error.config?.method,
            baseURL: error.config?.baseURL,
          },
          response: error.response?.data,
          status: error.response?.status,
        });
        return Promise.reject(error);
      }
    );
  }

  setAuthProvider(getToken: () => Promise<string | null>) {
    this.getToken = getToken;
  }

  // Events API
  async getEvents(): Promise<Event[]> {
    const response = await this.client.get('/api/events');
    return response.data;
  }

  async createEvent(event: Omit<Event, 'id' | 'created' | 'userId' | 'bookings'>): Promise<Event> {
    const response = await this.client.post('/api/events', event);
    return response.data;
  }

  async getEvent(id: number): Promise<Event> {
    const response = await this.client.get(`/api/events/${id}`);
    return response.data;
  }

  async updateEvent(id: number, event: Partial<Event>): Promise<Event> {
    const response = await this.client.put(`/api/events/${id}`, event);
    return response.data;
  }

  async deleteEvent(id: number): Promise<void> {
    await this.client.delete(`/api/events/${id}`);
  }

  // Schedule API
  async getSchedule(): Promise<Schedule> {
    const response = await this.client.get('/api/schedule');
    return response.data;
  }

  async saveSchedule(schedule: Omit<Schedule, 'id' | 'userId'>): Promise<Schedule> {
    const response = await this.client.post('/api/schedule', schedule);
    return response.data;
  }

  // Meetings API
  async createMeeting(meeting: Omit<Meeting, 'id' | 'userId'>): Promise<Meeting> {
    const response = await this.client.post('/api/meetings', meeting);
    return response.data;
  }

  // Public Booking API
  async getPublicEvents(userId: string): Promise<PublicEvent[]> {
    const response = await this.client.get(`/api/book/${userId}`);
    return response.data;
  }

  async getBookingAvailability(userId: string, eventId: string): Promise<any> {
    const response = await this.client.get(`/api/book/${userId}/${eventId}`);
    return response.data;
  }

  // Health Check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    try {
      console.log('Testing connection to:', `${API_URL}/api/health`);
      const response = await this.client.get('/api/health');
      console.log('Health check successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }
}

// Create singleton instance
export const apiClient = new ApiClient();

// Hook to initialize API client with auth
export const useApiClient = () => {
  const { getToken } = useAuth();
  
  React.useEffect(() => {
    apiClient.setAuthProvider(getToken);
  }, [getToken]);

  return apiClient;
};
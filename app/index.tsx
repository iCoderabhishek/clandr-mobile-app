import DatePicker from "@/components/DatePicker";
import EventCard from "@/components/EventCard";
import RouteScreen from "@/components/RouteScreen";
import TimePicker from "@/components/TimePicker";
import eventsData from "@/data/event.json";
import React, { useState } from "react";
import { SafeAreaView, ScrollView, Text, View } from "react-native";

interface Event {
  id: number;
  title: string;
  from: string;
  to: string;
  time: string;
  participants: string[];
  icons: string[];
  date: string;
  duration: string;
}

export default function ScheduleScreen() {
  const [selectedDate, setSelectedDate] = useState("2024-11-15");
  const [selectedTime, setSelectedTime] = useState("09:30");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const events = eventsData as Event[];

  // Filter events by selected date
  const filteredEvents = events.filter((event) => event.date === selectedDate);

  if (selectedEvent) {
    return (
      <RouteScreen
        event={selectedEvent}
        onBack={() => setSelectedEvent(null)}
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-4 pb-2 px-4">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            Schedule
          </Text>
          <Text className="text-gray-600">
            Manage your appointments and meetings
          </Text>
        </View>

        {/* Date Picker */}
        <DatePicker
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
        />

        {/* Time Picker */}
        <TimePicker
          selectedTime={selectedTime}
          onTimeSelect={setSelectedTime}
        />

        {/* Events Section */}
        <View className="px-4 mb-4">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Upcoming Events ({filteredEvents.length})
          </Text>
        </View>

        {/* Event Cards */}
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              onPress={() => setSelectedEvent(event)}
            />
          ))
        ) : (
          <View className="bg-white rounded-3xl shadow-lg p-8 mx-4 mb-4">
            <Text className="text-center text-gray-500 text-lg">
              No events scheduled for this date
            </Text>
            <Text className="text-center text-gray-400 mt-2">
              Select a different date to view events
            </Text>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

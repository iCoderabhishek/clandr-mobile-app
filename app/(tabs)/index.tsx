import EditEventModal from "@/components/EditEventModal";
import { useApiClient } from "@/lib/api";
import { useDeleteEvent, useEvents, useUpdateEvent } from "@/lib/queries";
import { useAuth } from "@clerk/clerk-expo";
import {
  ChevronDown,
  Menu,
  MoveHorizontal as MoreHorizontal,
  Plus,
  Search,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Event {
  id: number;
  title: string;
  description: string;
  duration: number;
  active: boolean;
  bookings: number;
  created: string;
  userId: string;
}

export default function MyEventsScreen() {
  const { isSignedIn } = useAuth();
  useApiClient(); // Initialize API client with auth

  const { data: events = [], isLoading, error } = useEvents();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDay, setSelectedDay] = useState("Today");

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading events...</Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-4">
        <Text className="text-red-500 text-lg font-semibold mb-2">
          Error loading events
        </Text>
        <Text className="text-gray-600 text-center">
          Please check your connection and try again
        </Text>
      </SafeAreaView>
    );
  }

  // Show auth required state
  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-4">
        <Text className="text-gray-800 text-xl font-bold mb-2">
          Sign in required
        </Text>
        <Text className="text-gray-600 text-center">
          Please sign in to view your events
        </Text>
      </SafeAreaView>
    );
  }

  const activeEvents = events.filter((event) => event.active);
  const todayEvents = activeEvents.slice(0, 2); // Mock today's events
  const tomorrowEvents = activeEvents.slice(2, 3); // Mock tomorrow's events

  const getCurrentDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      day: "numeric",
      month: "short",
    };
    return today.toLocaleDateString("en-US", options);
  };

  const getCurrentMonth = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", { month: "long" });
  };

  const handleEditEvent = (event: Event) => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const getEventColor = (index: number) => {
    const colors = [
      "bg-blue-500",
      "bg-cyan-500",
      "bg-purple-500",
      "bg-green-500",
    ];
    return colors[index % colors.length];
  };

  const getParticipantInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const EventCard = ({ event, index }: { event: Event; index: number }) => (
    <TouchableOpacity
      onPress={() => handleEditEvent(event)}
      className={`${getEventColor(index)} rounded-3xl p-6 mb-4 shadow-lg`}
    >
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <Text className="text-white text-xl font-bold mb-2">
            {event.title}
          </Text>
          <Text className="text-white/80 text-sm">
            {new Date().toLocaleTimeString("en-US", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}{" "}
            -{" "}
            {new Date(Date.now() + event.duration * 60000).toLocaleTimeString(
              "en-US",
              {
                hour: "2-digit",
                minute: "2-digit",
                hour12: true,
              }
            )}
          </Text>
        </View>
        <View className="flex-row items-center">
          <TouchableOpacity className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2">
            <MoreHorizontal size={16} color="white" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Participant Avatars */}
      <View className="flex-row items-center">
        {["John", "Sarah", "Mike"].slice(0, 3).map((participant, idx) => (
          <View
            key={idx}
            className="w-8 h-8 rounded-full bg-white items-center justify-center mr-2 shadow-sm"
            style={{ marginLeft: idx > 0 ? -8 : 0 }}
          >
            <Text className="text-gray-700 text-xs font-bold">
              {getParticipantInitials(participant)}
            </Text>
          </View>
        ))}
        {event.bookings > 3 && (
          <View className="w-8 h-8 rounded-full bg-white/20 items-center justify-center ml-2">
            <Text className="text-white text-xs font-bold">
              +{event.bookings - 3}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <TouchableOpacity className="w-10 h-10 rounded-full bg-white shadow-md items-center justify-center mr-4">
                <Menu size={20} color="#374151" />
              </TouchableOpacity>
              <View className="flex-row items-center">
                <Text className="text-xl font-bold text-gray-800 mr-2">
                  {getCurrentMonth()}
                </Text>
                <ChevronDown size={20} color="#6B7280" />
              </View>
            </View>
            <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center shadow-lg">
              <User size={24} color="white" />
            </View>
          </View>

          {/* Date and Title */}
          <Text className="text-gray-600 text-base mb-2">
            {getCurrentDate()}
          </Text>
          <Text className="text-3xl font-bold text-gray-800 mb-6">
            You Have {todayEvents.length} {"\n"}Meetings Today
          </Text>

          {/* Search Bar */}
          <View className="bg-white rounded-2xl shadow-md p-4 mb-6 flex-row items-center">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search event, meeting, etc..."
              className="flex-1 ml-3 text-gray-700 text-base"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Day Tabs */}
          <View className="flex-row mb-4">
            {[
              { label: "Today", count: todayEvents.length },
              { label: "Tomorrow", count: tomorrowEvents.length },
              { label: "26 Aug", count: 6 },
            ].map((day, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedDay(day.label)}
                className={`mr-4 px-4 py-2 rounded-full ${
                  selectedDay === day.label
                    ? "bg-gray-800"
                    : "bg-white shadow-sm"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedDay === day.label ? "text-white" : "text-gray-600"
                  }`}
                >
                  {day.label} ({day.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Motivational Text */}
          <Text className="text-gray-500 text-sm mb-6 leading-5">
            It's a good day to start any event, you can make important decisions
            or plan them.
          </Text>
        </View>

        {/* Events List */}
        <View className="px-4">
          {selectedDay === "Today" &&
            todayEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index} />
            ))}

          {selectedDay === "Tomorrow" &&
            tomorrowEvents.map((event, index) => (
              <EventCard key={event.id} event={event} index={index + 2} />
            ))}

          {selectedDay === "26 Aug" && (
            <View className="bg-white rounded-3xl p-8 items-center shadow-lg">
              <Text className="text-gray-500 text-lg mb-2">
                No events scheduled
              </Text>
              <Text className="text-gray-400 text-center">
                Create your first event for this date
              </Text>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center shadow-lg">
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Edit Modal */}
      <EditEventModal
        visible={modalVisible}
        event={selectedEvent}
        onClose={() => {
          setModalVisible(false);
          setSelectedEvent(null);
        }}
      />
    </SafeAreaView>
  );
}

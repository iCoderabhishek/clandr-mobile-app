import { CopyEventButton } from "@/components/CopyEventButton";
import CreateEventModal from "@/components/CreateEventModal";
import { CustomUserButton } from "@/components/CustomUserButton";
import EditEventModal, { EditEvent } from "@/components/EditEventModal";
import { useApiClient } from "@/lib/api";
import { useDeleteEvent, useEvents, useUpdateEvent } from "@/lib/queries";
import { useAuth } from "@clerk/clerk-expo";

import { CalendarDays, Clock, Pencil, Plus, Search } from "lucide-react-native";
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

export default function MyEventsScreen() {
  const { isSignedIn, userId } = useAuth();

  useApiClient(); // Initialize API client with auth

  const { data: events = [], isLoading, error } = useEvents();
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [selectedEvent, setSelectedEvent] = useState<EditEvent | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("all");

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

  // Filter events based on search and filter
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedFilter === "active") return event.isActive && matchesSearch;
    if (selectedFilter === "inactive") return !event.isActive && matchesSearch;
    return matchesSearch;
  });

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

  const handleEditEvent = (event: EditEvent) => {
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

  const EventCard = ({ event, index }: { event: EditEvent; index: number }) => {
    const isActive = event?.isActive;
    const createdAt = new Date(event.createdAt);

    return (
      <TouchableOpacity
        onPress={() => handleEditEvent(event)}
        className={`${getEventColor(index)} rounded-3xl p-6 mb-4 shadow-lg`}
      >
        <View className="flex-row items-start justify-between mb-4">
          {/* Left Section */}
          <View className="flex-1">
            <Text className="text-white text-2xl font-bold mb-2">
              {event.name}
            </Text>
            <Text className="text-white/80 text-md mb-1">
              From {event.durationInMinutes} minutes
            </Text>
            <View className="flex-row items-center gap-2 mt-2">
              <CalendarDays size={16} color="white" />
              <Text className="text-white/80 text-sm">
                {createdAt.toLocaleDateString()}
              </Text>

              <Clock size={16} color="white" className="ml-4" />
              <Text className="text-white/80 text-sm">
                {createdAt.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Text>
            </View>
          </View>

          {/* Right section */}
          <View className="flex-row items-center">
            <View
              className={`px-2 py-1 rounded-full mr-2 ${
                isActive ? "bg-green-500/20" : "bg-red-500/20"
              }`}
            >
              <Text className="text-white text-md font-medium">
                {isActive ? "Active" : "Inactive"}
              </Text>
            </View>
            <TouchableOpacity className="w-8 h-8 rounded-full bg-white/20 items-center justify-center mr-2">
              <Pencil size={16} color="white" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Description */}
        <Text className="text-white/90 text-xl mb-4 leading-5">
          {event.description}
        </Text>

        <View className="flex-row items-center max-w-sm">
          <CopyEventButton
            eventId={event.id.toString()}
            clerkUserId={userId ?? ""}
            style="mr-2"
          />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-4 pt-4 pb-6">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="flex-row items-center">
                <Text className="text-2xl font-bold text-gray-800 mr-2">
                  {getCurrentMonth()}
                </Text>
              </View>
            </View>
            <View className="w-12 h-12 rounded-full bg-blue-500 items-center justify-center shadow-lg">
              <CustomUserButton />
            </View>
          </View>

          {/* Date and Title */}
          <Text className="text-gray-600 text-base mb-2">
            {getCurrentDate()}
          </Text>
          <Text className="text-3xl font-bold text-gray-800 mb-4">
            My Events
          </Text>
          <Text className="text-gray-600 mb-6 text-lg">
            Manage your bookable events and availability
          </Text>

          {/* Search Bar */}
          <View className="bg-white rounded-2xl shadow-lg p-2 mb-6 flex-row items-center">
            <Search size={20} color="#9CA3AF" />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search event, meeting, etc..."
              className="flex-1 ml-3 text-gray-700 text-lg"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Filter Tabs */}
          <View className="flex-row mb-4">
            {[
              { label: "All", value: "all", count: events.length },
              {
                label: "Active",
                value: "active",
                count: events.filter((e) => e.isActive).length,
              },
              {
                label: "Inactive",
                value: "inactive",
                count: events.filter((e) => !e.isActive).length,
              },
            ].map((filter, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => {}}
                className={`mr-4 px-4 py-2 rounded-full ${
                  selectedFilter === filter.value
                    ? "bg-gray-800"
                    : "bg-white shadow-sm"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    selectedFilter === filter.value
                      ? "text-white"
                      : "text-gray-600"
                  }`}
                >
                  {filter.label} ({filter.count})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Events List */}
        <View className="px-4">
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={{
                  id: event.id,
                  name: event.name,
                  description: event.description,
                  durationInMinutes: event.durationInMinutes, // adjust field name
                  isActive: event.isActive, // adjust if needed
                  bookings: event.bookings,
                  createdAt: event.createdAt, // or `created` if already matches
                  userId: event.userId,
                }}
                index={index}
              />
            ))
          ) : (
            <View className="bg-white rounded-3xl p-8 items-center shadow-lg">
              <Text className="text-gray-500 text-lg mb-2">
                {searchQuery ? "No events found" : "No events yet"}
              </Text>
              <Text className="text-gray-400 text-center">
                {searchQuery
                  ? "Try adjusting your search or filters"
                  : "Create your first event to get started"}
              </Text>
              {!searchQuery && (
                <TouchableOpacity
                  onPress={() => setCreateModalVisible(true)}
                  className="bg-blue-500 rounded-2xl px-6 py-3 mt-4"
                >
                  <Text className="text-white font-semibold">Create Event</Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>

      {/* Floating Action Button */}
      <View className="absolute bottom-6 right-6">
        <TouchableOpacity
          onPress={() => setCreateModalVisible(true)}
          className="w-14 h-14 bg-gray-800 rounded-full items-center justify-center shadow-lg"
        >
          <Plus size={24} color="white" />
        </TouchableOpacity>
      </View>

      {/* Create Modal */}
      <CreateEventModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

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

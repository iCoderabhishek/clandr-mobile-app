import { useApiClient } from "@/lib/api";
import { useEvents } from "@/lib/queries";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Clipboard from "expo-clipboard";
import { Clock, Copy, User } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Text,
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

export default function PublicProfileScreen() {
  const { isSignedIn } = useAuth();
  const { user } = useUser();
  useApiClient(); // Initialize API client with auth

  const { data: events = [], isLoading, error } = useEvents();
  const activeEvents = events.filter((event) => event.active);

  const publicUrl = `https://cal.example.com/${user?.username || user?.id || "user"}`;
  const userName = user?.fullName || user?.firstName || "User";
  const userBio =
    "Software Developer & Football Enthusiast. Book a session with me to discuss projects, grab coffee, or play some football!";

  // Show loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  // Show error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-4">
        <Text className="text-red-500 text-lg font-semibold mb-2">
          Error loading profile
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
          Please sign in to view your public profile
        </Text>
      </SafeAreaView>
    );
  }

  const copyPublicUrl = async () => {
    await Clipboard.setStringAsync(publicUrl);
    Alert.alert("Copied!", "Public profile URL copied to clipboard");
  };

  const handleSelectEvent = (event: Event) => {
    Alert.alert(
      "Book Event",
      `You selected "${event.title}". This would normally open the booking flow for clients.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue Booking", style: "default" },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Preview Header */}
        <View className="bg-blue-500 pt-4 pb-6 px-4">
          <Text className="text-white text-center text-lg font-semibold">
            This is how your public profile looks like
          </Text>
        </View>

        {/* Profile Section */}
        <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mt-6 mb-6">
          {/* Avatar and Info */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 bg-blue-500 rounded-full items-center justify-center mb-4 shadow-lg">
              <User size={40} color="white" />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-2">
              {userName}
            </Text>
            <Text className="text-gray-600 text-center leading-6 mb-4">
              {userBio}
            </Text>

            {/* Public URL */}
            <View className="bg-gray-50 rounded-2xl p-4 w-full">
              <View className="flex-row items-center justify-between">
                <Text className="text-gray-600 flex-1 mr-3">{publicUrl}</Text>
                <TouchableOpacity
                  onPress={copyPublicUrl}
                  className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center"
                >
                  <Copy size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row justify-around pt-4 border-t border-gray-100">
            <View className="items-center">
              <Text className="text-xl font-bold text-blue-600">
                {activeEvents.length}
              </Text>
              <Text className="text-gray-500 text-sm">Events</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-green-600">
                {events.reduce((sum, event) => sum + event.bookings, 0)}
              </Text>
              <Text className="text-gray-500 text-sm">Bookings</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-purple-600">4.9</Text>
              <Text className="text-gray-500 text-sm">Rating</Text>
            </View>
          </View>
        </View>

        {/* Available Events */}
        <View className="px-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">
            Available Events
          </Text>

          {activeEvents.length > 0 ? (
            activeEvents.map((event) => (
              <View
                key={event.id}
                className="bg-white rounded-3xl shadow-lg p-6 mb-4"
              >
                {/* Event Header */}
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-xl font-bold text-gray-800 mb-2">
                      {event.title}
                    </Text>
                    <View className="flex-row items-center mb-3">
                      <Clock size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-2">
                        {event.duration} minutes
                      </Text>
                    </View>
                  </View>
                  <View className="bg-green-100 px-3 py-1 rounded-full">
                    <Text className="text-green-600 text-sm font-medium">
                      Available
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="text-gray-600 mb-4 leading-6">
                  {event.description}
                </Text>

                {/* Booking Stats */}
                <View className="flex-row items-center justify-between mb-4 pt-4 border-t border-gray-100">
                  <Text className="text-gray-500 text-sm">
                    {event.bookings} people booked this
                  </Text>
                  <View className="flex-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text key={star} className="text-yellow-400 text-lg">
                        ★
                      </Text>
                    ))}
                  </View>
                </View>

                {/* Select Button */}
                <TouchableOpacity
                  onPress={() => handleSelectEvent(event)}
                  className="bg-blue-500 rounded-2xl py-4 items-center shadow-md"
                >
                  <Text className="text-white font-semibold text-lg">
                    Select
                  </Text>
                </TouchableOpacity>
              </View>
            ))
          ) : (
            <View className="bg-white rounded-3xl shadow-lg p-8 items-center">
              <Text className="text-gray-500 text-lg mb-2">
                No events available
              </Text>
              <Text className="text-gray-400 text-center">
                This user hasn't created any bookable events yet
              </Text>
            </View>
          )}
        </View>

        {/* Testimonials */}
        <View className="px-4 mb-6">
          <View className="bg-white rounded-3xl shadow-lg p-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">
              What people say
            </Text>

            {[
              {
                name: "Sarah M.",
                text: "Great football session! John is very friendly and skilled.",
                rating: 5,
              },
              {
                name: "Mike R.",
                text: "Excellent coding mentorship. Learned a lot in our session.",
                rating: 5,
              },
              {
                name: "Emma K.",
                text: "Perfect coffee chat for networking. Highly recommend!",
                rating: 4,
              },
            ].map((review, index) => (
              <View
                key={index}
                className="py-4 border-b border-gray-100 last:border-b-0"
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-gray-800 font-semibold">
                    {review.name}
                  </Text>
                  <View className="flex-row">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Text
                        key={star}
                        className={`text-lg ${star <= review.rating ? "text-yellow-400" : "text-gray-300"}`}
                      >
                        ★
                      </Text>
                    ))}
                  </View>
                </View>
                <Text className="text-gray-600 text-sm leading-5">
                  "{review.text}"
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-20" />
      </ScrollView>
    </SafeAreaView>
  );
}

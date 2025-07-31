import { useApiClient } from "@/lib/api";
import { useEvents } from "@/lib/queries";
import { useAuth, useUser } from "@clerk/clerk-expo";
import * as Clipboard from "expo-clipboard";
import { Copy, Info } from "lucide-react-native";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function PublicProfileScreen() {
  const { isSignedIn, userId: clerkUserId } = useAuth();
  const { user } = useUser();
  useApiClient();

  const { data: events = [], isLoading, error } = useEvents();
  const activeEvents = events.filter((event) => event.isActive);
  const publicUrl = `https://clandr-web.vercel.app/book/${clerkUserId}`;
  const userName = user?.fullName || user?.firstName || "User";

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="text-gray-600 mt-4">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-4">
        <Text className="text-red-500 text-lg font-semibold mb-2">
          Error loading profile
        </Text>
        <Text className="text-center text-gray-600">
          Please check your connection and try again
        </Text>
      </SafeAreaView>
    );
  }

  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 items-center justify-center bg-gray-50 px-4">
        <Text className="text-xl font-bold text-gray-800 mb-2">
          Sign in required
        </Text>
        <Text className="text-center text-gray-600">
          Please sign in to view your public profile
        </Text>
      </SafeAreaView>
    );
  }

  const copyPublicUrl = async () => {
    await Clipboard.setStringAsync(publicUrl);
    Alert.alert("Copied!", "Public profile URL copied to clipboard");
  };

  const handleSelectEvent = (events: any) => {
    Alert.alert(
      "Book Event",
      `You selected "${events.name}". This would normally open the booking flow for clients.`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Continue Booking", style: "default" },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        {/* Header */}
        <View className="bg-blue-400 px-4 py-3 flex-row items-center justify-center space-x-2 gap-2">
          <Info size={20} color="white" />
          <Text className="text-white text-base font-semibold shadow-lg">
            People can see your profile like this
          </Text>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl shadow-md p-6 mx-4 mt-20">
          <View className="items-center mb-4">
            <Image
              source={{ uri: user?.imageUrl }}
              className="w-24 h-24 rounded-full mb-3"
            />
            <Text className="text-2xl font-bold text-gray-800">{userName}</Text>
          </View>

          <View className="bg-gray-100 rounded-xl px-4 py-3 flex-row items-center justify-between mb-4">
            <Text className="text-gray-600 flex-1 mr-2" numberOfLines={1}>
              {publicUrl}
            </Text>
            <TouchableOpacity
              onPress={copyPublicUrl}
              className="bg-blue-100 p-2 rounded-full"
            >
              <Copy size={16} color="#3B82F6" />
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-around pt-4 border-t border-gray-200">
            <View className="items-center">
              <Text className="text-xl font-bold text-blue-600">
                {events.length}
              </Text>
              <Text className="text-sm text-gray-500">Events</Text>
            </View>
            <View className="items-center">
              <Text className="text-xl font-bold text-blue-600">
                {activeEvents.length}
              </Text>
              <Text className="text-sm text-gray-500">Active</Text>
            </View>
          </View>
        </View>

        {/* Active Events */}
        {activeEvents.length > 0 && (
          <View className="mt-4 mx-4 mb-10">
            <View className="flex-row gap-2 justify-start mb-3">
              <Info size={20} color="black" />
              <Text className="text-xl font-semibold text-gray-800">
                Your Active Events
              </Text>
            </View>

            {activeEvents.map((event, index) => {
              const bgColors = [
                "bg-blue-50",
                "bg-purple-50",
                "bg-teal-50",
                "bg-yellow-50",
                "bg-pink-50",
              ];
              const bgColor = bgColors[index % bgColors.length];

              return (
                <TouchableOpacity
                  key={event.id}
                  onPress={() => handleSelectEvent(event)}
                  className={`rounded-xl p-4 mb-3 border border-gray-100 shadow-sm ${bgColor}`}
                >
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    {event.name}
                  </Text>
                  <Text className="text-sm text-gray-600" numberOfLines={2}>
                    {event.description}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

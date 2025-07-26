import { ArrowLeft, Car, Clock, MapPin, Users } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface Event {
  id: number;
  title: string;
  from: string;
  to: string;
  time: string;
  participants: string[];
  icons: string[];
  duration: string;
}

interface RouteScreenProps {
  event: Event;
  onBack: () => void;
}

export default function RouteScreen({ event, onBack }: RouteScreenProps) {
  const getParticipantInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const participantColors = [
    "bg-blue-500",
    "bg-green-500",
    "bg-purple-500",
    "bg-pink-500",
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white pt-12 pb-6 px-4 shadow-sm">
        <View className="flex-row items-center justify-between">
          <TouchableOpacity
            onPress={onBack}
            className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center shadow-sm"
          >
            <ArrowLeft size={20} color="#6B7280" />
          </TouchableOpacity>
          <Text className="text-lg font-bold text-gray-800">Route Details</Text>
          <View className="w-10" />
        </View>
      </View>

      {/* Main Content */}
      <View className="p-4">
        {/* Time Card */}
        <View className="bg-blue-500 rounded-3xl p-8 mb-6 shadow-lg">
          <View className="items-center">
            <Text className="text-white text-sm font-medium mb-2">
              November 2024
            </Text>
            <Text className="text-white text-5xl font-bold mb-4">
              {event.time}
            </Text>
            <View className="flex-row items-center">
              <View className="w-3 h-3 bg-white rounded-full mr-2" />
              <View className="w-16 h-1 bg-white/30 rounded-full mr-2" />
              <View className="w-3 h-3 bg-white rounded-full" />
            </View>
          </View>
        </View>

        {/* Meeting Details */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <View className="flex-row items-center mb-4">
            <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
              <Users size={16} color="#3B82F6" />
            </View>
            <Text className="text-lg font-bold text-gray-800">
              {event.title}
            </Text>
          </View>

          <Text className="text-gray-600 mb-4">Meeting</Text>

          <View className="space-y-4">
            {/* From Location */}
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-4">
                <MapPin size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {event.from}
                </Text>
                <Text className="text-gray-500">
                  It is a long established fact that
                </Text>
              </View>
              <View className="flex-row">
                {event.participants.slice(0, 2).map((participant, index) => (
                  <View
                    key={index}
                    className={`w-8 h-8 rounded-full ${participantColors[index]} items-center justify-center mr-1 shadow-sm`}
                  >
                    <Text className="text-white text-xs font-bold">
                      {getParticipantInitials(participant)}
                    </Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Route Line */}
            <View className="ml-4 w-0.5 h-8 bg-gray-200" />

            {/* To Location */}
            <View className="flex-row items-center">
              <View className="w-8 h-8 rounded-full bg-blue-500 items-center justify-center mr-4">
                <MapPin size={16} color="white" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800">
                  {event.to}
                </Text>
                <Text className="text-gray-500">There are many variations</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Map Placeholder */}
        <View className="bg-white rounded-3xl p-6 mb-6 shadow-lg">
          <View className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl items-center justify-center relative overflow-hidden">
            {/* Curved Path */}
            <View className="absolute inset-0">
              <View className="absolute top-8 left-8 w-4 h-4 bg-blue-500 rounded-full" />
              <View className="absolute bottom-8 right-8 w-4 h-4 bg-blue-500 rounded-full" />
              {/* Curved line simulation */}
              <View className="absolute top-12 left-12 w-32 h-0.5 bg-blue-400 rounded-full transform rotate-12" />
              <View className="absolute top-20 left-24 w-24 h-0.5 bg-blue-400 rounded-full transform rotate-45" />
              <View className="absolute bottom-20 right-24 w-20 h-0.5 bg-blue-400 rounded-full transform -rotate-12" />
            </View>

            <View className="bg-white rounded-2xl px-4 py-2 shadow-md">
              <Text className="text-gray-600 text-sm font-medium">
                {event.duration}
              </Text>
            </View>
          </View>
        </View>

        {/* Transport Options */}
        <View className="bg-white rounded-3xl p-6 shadow-lg">
          <Text className="text-lg font-bold text-gray-800 mb-4">
            Transport Options
          </Text>
          <View className="flex-row justify-around">
            <TouchableOpacity className="items-center p-4 rounded-2xl bg-blue-50">
              <Car size={24} color="#3B82F6" />
              <Text className="text-blue-600 text-sm font-medium mt-2">
                Car
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-4 rounded-2xl bg-gray-50">
              <Users size={24} color="#6B7280" />
              <Text className="text-gray-600 text-sm font-medium mt-2">
                Walk
              </Text>
            </TouchableOpacity>
            <TouchableOpacity className="items-center p-4 rounded-2xl bg-gray-50">
              <Clock size={24} color="#6B7280" />
              <Text className="text-gray-600 text-sm font-medium mt-2">
                More
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

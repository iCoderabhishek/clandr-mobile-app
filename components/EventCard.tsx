import {
  Bike,
  Calendar,
  Car,
  MapPin,
  Brain as Train,
} from "lucide-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

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

interface EventCardProps {
  event: Event;
  onPress: () => void;
}

export default function EventCard({ event, onPress }: EventCardProps) {
  const getTransportIcon = (iconType: string) => {
    switch (iconType) {
      case "car":
        return <Car size={20} color="#6B7280" />;
      case "bike":
        return <Bike size={20} color="#6B7280" />;
      case "train":
        return <Train size={20} color="#6B7280" />;
      default:
        return <Calendar size={20} color="#6B7280" />;
    }
  };

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
    <TouchableOpacity
      onPress={onPress}
      className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-4"
    >
      {/* Header */}
      <View className="flex-row items-center justify-between mb-4">
        <View className="flex-row items-center">
          <MapPin size={16} color="#6B7280" />
          <Text className="text-gray-600 ml-2 font-medium">
            {event.from} to {event.to}
          </Text>
        </View>
        <Text className="text-2xl font-bold text-gray-800">{event.time}</Text>
      </View>

      {/* Title */}
      <Text className="text-lg font-bold text-gray-800 mb-3">
        {event.title}
      </Text>

      {/* Bottom Row */}
      <View className="flex-row items-center justify-between">
        {/* Participants */}
        <View className="flex-row items-center">
          {event.participants.slice(0, 3).map((participant, index) => (
            <View
              key={index}
              className={`w-8 h-8 rounded-full ${participantColors[index % participantColors.length]} items-center justify-center mr-2 shadow-sm`}
            >
              <Text className="text-white text-xs font-bold">
                {getParticipantInitials(participant)}
              </Text>
            </View>
          ))}
          {event.participants.length > 3 && (
            <View className="w-8 h-8 rounded-full bg-gray-300 items-center justify-center shadow-sm">
              <Text className="text-gray-600 text-xs font-bold">
                +{event.participants.length - 3}
              </Text>
            </View>
          )}
        </View>

        {/* Icons and Duration */}
        <View className="flex-row items-center">
          <Text className="text-gray-500 text-sm mr-3">{event.duration}</Text>
          <View className="flex-row">
            {event.icons.map((icon, index) => (
              <View
                key={index}
                className="w-8 h-8 rounded-full bg-gray-50 items-center justify-center ml-2 shadow-sm"
              >
                {getTransportIcon(icon)}
              </View>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

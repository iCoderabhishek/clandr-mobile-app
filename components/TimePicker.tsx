import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface TimePickerProps {
  selectedTime: string;
  onTimeSelect: (time: string) => void;
}

export default function TimePicker({
  selectedTime,
  onTimeSelect,
}: TimePickerProps) {
  const timeSlots = [
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "09:30",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "15:30",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
  ];

  return (
    <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-6">
      <Text className="text-lg font-bold text-gray-800 mb-4">Select Time</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="flex-row"
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {timeSlots.map((time, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => onTimeSelect(time)}
            className={`mr-3 px-6 py-3 rounded-2xl shadow-sm ${
              selectedTime === time ? "bg-blue-500" : "bg-gray-50"
            }`}
          >
            <Text
              className={`font-semibold ${
                selectedTime === time ? "text-white" : "text-gray-700"
              }`}
            >
              {time}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Time Slider Visual */}
      <View className="mt-6 px-4">
        <View className="flex-row items-center justify-between mb-2">
          <Text className="text-sm text-gray-500">6</Text>
          <Text className="text-sm text-gray-500">12</Text>
          <Text className="text-sm text-gray-500">18</Text>
        </View>
        <View className="h-2 bg-gray-100 rounded-full relative">
          <View
            className="absolute left-0 top-0 h-2 bg-blue-500 rounded-full"
            style={{ width: "40%" }}
          />
          <View
            className="absolute w-6 h-6 bg-blue-500 rounded-full -top-2 shadow-md"
            style={{ left: "35%" }}
          />
        </View>
      </View>
    </View>
  );
}

import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ScheduleChartProps {
  schedule: any;
  onSlotPress: (day: string, time: string, status: string) => void;
}

export default function ScheduleChart({
  schedule,
  onSlotPress,
}: ScheduleChartProps) {
  const days = [
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
    "sunday",
  ];
  const dayLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const times = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

  const getSlotColor = (status: string) => {
    switch (status) {
      case "booked":
        return "bg-blue-500";
      case "available":
        return "bg-green-500";
      case "blocked":
        return "bg-gray-400";
      default:
        return "bg-gray-200";
    }
  };

  const getSlotTextColor = (status: string) => {
    switch (status) {
      case "booked":
      case "available":
      case "blocked":
        return "text-white";
      default:
        return "text-gray-500";
    }
  };

  return (
    <View className="bg-white rounded-3xl shadow-lg p-6">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Weekly Schedule
      </Text>

      {/* Legend */}
      <View className="flex-row justify-around mb-6 bg-gray-50 rounded-xl p-3">
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
          <Text className="text-gray-600 text-xs font-medium">Booked</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-green-500 rounded-full mr-2" />
          <Text className="text-gray-600 text-xs font-medium">Available</Text>
        </View>
        <View className="flex-row items-center">
          <View className="w-3 h-3 bg-gray-400 rounded-full mr-2" />
          <Text className="text-gray-600 text-xs font-medium">Blocked</Text>
        </View>
      </View>

      {/* Chart */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          {/* Time Header */}
          <View className="flex-row mb-2">
            <View className="w-12" />
            {times.map((time) => (
              <View key={time} className="w-16 items-center">
                <Text className="text-gray-500 text-xs font-medium">
                  {time}
                </Text>
              </View>
            ))}
          </View>

          {/* Days and Slots */}
          {days.map((day, dayIndex) => (
            <View key={day} className="flex-row items-center mb-2">
              <View className="w-12">
                <Text className="text-gray-600 text-sm font-semibold">
                  {dayLabels[dayIndex]}
                </Text>
              </View>
              {times.map((time) => {
                const status = schedule[day]?.[time] || "empty";
                return (
                  <TouchableOpacity
                    key={`${day}-${time}`}
                    onPress={() => onSlotPress(day, time, status)}
                    className={`w-14 h-8 rounded-xl mx-1 items-center justify-center ${getSlotColor(status)} shadow-sm`}
                  >
                    <Text
                      className={`text-xs font-medium ${getSlotTextColor(status)}`}
                    >
                      {status === "empty" ? "" : status.charAt(0).toUpperCase()}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Quick Actions */}
      <View className="mt-6 pt-4 border-t border-gray-100">
        <Text className="text-lg font-bold text-gray-800 mb-3">
          Quick Actions
        </Text>
        <View className="flex-row space-x-3">
          <TouchableOpacity className="bg-green-50 rounded-xl px-4 py-3 flex-1 items-center">
            <Text className="text-green-600 font-semibold text-sm">
              Add Available Slot
            </Text>
          </TouchableOpacity>
          <TouchableOpacity className="bg-gray-50 rounded-xl px-4 py-3 flex-1 items-center">
            <Text className="text-gray-600 font-semibold text-sm">
              Block Time
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

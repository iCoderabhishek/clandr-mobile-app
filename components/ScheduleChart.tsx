import { Calendar, Clock, Edit3 } from "lucide-react-native";
import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

interface ScheduleChartProps {
  schedule: Record<string, Record<string, string>>;
  onEditPress: () => void;
}

export default function ScheduleChart({
  schedule,
  onEditPress,
}: ScheduleChartProps) {
  const days = [
    { key: "monday", label: "Monday", short: "Mon" },
    { key: "tuesday", label: "Tuesday", short: "Tue" },
    { key: "wednesday", label: "Wednesday", short: "Wed" },
    { key: "thursday", label: "Thursday", short: "Thu" },
    { key: "friday", label: "Friday", short: "Fri" },
    { key: "saturday", label: "Saturday", short: "Sat" },
    { key: "sunday", label: "Sunday", short: "Sun" },
  ];

  const getAvailableHours = (daySchedule: Record<string, string>) => {
    if (!daySchedule) return [];

    const availableSlots = Object.entries(daySchedule)
      .filter(([_, status]) => status === "available")
      .map(([time]) => time)
      .sort();

    if (availableSlots.length === 0) return [];

    // Group consecutive hours into ranges
    const ranges: string[] = [];
    let start = availableSlots[0];
    let end = availableSlots[0];

    for (let i = 1; i < availableSlots.length; i++) {
      const currentHour = parseInt(availableSlots[i].split(":")[0]);
      const endHour = parseInt(end.split(":")[0]);

      if (currentHour === endHour + 1) {
        end = availableSlots[i];
      } else {
        // Add the current range
        if (start === end) {
          ranges.push(start);
        } else {
          const endTime =
            (parseInt(end.split(":")[0]) + 1).toString().padStart(2, "0") +
            ":00";
          ranges.push(`${start} - ${endTime}`);
        }
        start = availableSlots[i];
        end = availableSlots[i];
      }
    }

    // Add the last range
    if (start === end) {
      ranges.push(start);
    } else {
      const endTime =
        (parseInt(end.split(":")[0]) + 1).toString().padStart(2, "0") + ":00";
      ranges.push(`${start} - ${endTime}`);
    }

    return ranges;
  };

  const getTotalAvailableSlots = () => {
    return Object.values(schedule).reduce((total, daySchedule) => {
      return (
        total +
        Object.values(daySchedule || {}).filter(
          (status) => status === "available"
        ).length
      );
    }, 0);
  };

  const getBookedSlots = () => {
    return Object.values(schedule).reduce((total, daySchedule) => {
      return (
        total +
        Object.values(daySchedule || {}).filter((status) => status === "booked")
          .length
      );
    }, 0);
  };

  return (
    <View className="bg-white rounded-3xl shadow-lg p-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <Text className="text-xl font-bold text-gray-800">Weekly Schedule</Text>
        <TouchableOpacity
          onPress={onEditPress}
          className="flex-row items-center bg-blue-50 rounded-xl px-4 py-2"
        >
          <Edit3 size={16} color="#3B82F6" />
          <Text className="text-blue-600 font-medium ml-2">Edit</Text>
        </TouchableOpacity>
      </View>

      {/* Quick Stats */}
      <View className="flex-row mb-6 bg-gray-50 rounded-xl p-4">
        <View className="flex-1 items-center">
          <View className="flex-row items-center mb-1">
            <Calendar size={16} color="#10B981" />
            <Text className="text-green-600 font-bold text-lg ml-1">
              {getTotalAvailableSlots()}
            </Text>
          </View>
          <Text className="text-gray-600 text-xs">Available</Text>
        </View>

        <View className="w-px bg-gray-200 mx-4" />

        <View className="flex-1 items-center">
          <View className="flex-row items-center mb-1">
            <Clock size={16} color="#3B82F6" />
            <Text className="text-blue-600 font-bold text-lg ml-1">
              {getBookedSlots()}
            </Text>
          </View>
          <Text className="text-gray-600 text-xs">Booked</Text>
        </View>
      </View>

      {/* Days List */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {days.map((day) => {
          const daySchedule = schedule[day.key];
          const availableHours = getAvailableHours(daySchedule);
          const hasAvailability = availableHours.length > 0;

          return (
            <View
              key={day.key}
              className="flex-row items-center py-4 border-b border-gray-100 last:border-b-0"
            >
              <View className="w-16">
                <Text className="text-gray-800 font-semibold text-base">
                  {day.short}
                </Text>
              </View>

              <View className="flex-1 ml-4">
                {hasAvailability ? (
                  <View className="flex-row flex-wrap">
                    {availableHours.map((timeRange, index) => (
                      <View
                        key={index}
                        className="bg-green-100 rounded-lg px-3 py-1 mr-2 mb-1"
                      >
                        <Text className="text-green-700 text-sm font-medium">
                          {timeRange}
                        </Text>
                      </View>
                    ))}
                  </View>
                ) : (
                  <View className="bg-gray-100 rounded-lg px-3 py-2">
                    <Text className="text-gray-500 text-sm">Not available</Text>
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Empty State */}
      {getTotalAvailableSlots() === 0 && (
        <View className="items-center py-8">
          <Calendar size={48} color="#D1D5DB" />
          <Text className="text-gray-500 text-lg font-medium mt-4 mb-2">
            No availability set
          </Text>
          <Text className="text-gray-400 text-center mb-4">
            Set your available hours to start receiving bookings
          </Text>
          <TouchableOpacity
            onPress={onEditPress}
            className="bg-blue-500 rounded-xl px-6 py-3"
          >
            <Text className="text-white font-semibold">Set Availability</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

import { ChevronLeft, ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface DatePickerProps {
  selectedDate: string;
  onDateSelect: (date: string) => void;
}

export default function DatePicker({
  selectedDate,
  onDateSelect,
}: DatePickerProps) {
  const [currentMonth, setCurrentMonth] = useState(10); // November (0-indexed)
  const [currentYear, setCurrentYear] = useState(2024);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const generateDates = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const dates = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      dates.push(null);
    }

    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      dates.push({ day, dateString });
    }

    return dates;
  };

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const dates = generateDates();

  return (
    <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-6">
      {/* Header */}
      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity
          onPress={() => navigateMonth("prev")}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center shadow-sm"
        >
          <ChevronLeft size={20} color="#6B7280" />
        </TouchableOpacity>

        <Text className="text-xl font-bold text-gray-800">
          {months[currentMonth]} {currentYear}
        </Text>

        <TouchableOpacity
          onPress={() => navigateMonth("next")}
          className="w-10 h-10 rounded-full bg-gray-50 items-center justify-center shadow-sm"
        >
          <ChevronRight size={20} color="#6B7280" />
        </TouchableOpacity>
      </View>

      {/* Days of week */}
      <View className="flex-row mb-4">
        {["S", "M", "T", "W", "T", "F", "S"].map((day, index) => (
          <View key={index} className="flex-1 items-center">
            <Text className="text-gray-500 font-medium text-sm">{day}</Text>
          </View>
        ))}
      </View>

      {/* Calendar Grid */}
      <View className="flex-row flex-wrap">
        {dates.map((date, index) => (
          <View key={index} className="w-[14.28%] aspect-square p-1">
            {date && (
              <TouchableOpacity
                onPress={() => onDateSelect(date.dateString)}
                className={`flex-1 rounded-xl items-center justify-center ${
                  selectedDate === date.dateString
                    ? "bg-blue-500 shadow-md"
                    : "bg-gray-50"
                }`}
              >
                <Text
                  className={`font-medium ${
                    selectedDate === date.dateString
                      ? "text-white"
                      : "text-gray-700"
                  }`}
                >
                  {date.day}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

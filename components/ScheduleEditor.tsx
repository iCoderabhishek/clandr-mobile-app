import { useSaveSchedule } from "@/lib/queries";
import { Check, X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

interface ScheduleEditorProps {
  visible: boolean;
  schedule: any;
  onClose: () => void;
}

export default function ScheduleEditor({
  visible,
  schedule,
  onClose,
}: ScheduleEditorProps) {
  const saveScheduleMutation = useSaveSchedule();
  const [editedSchedule, setEditedSchedule] = useState(schedule || {});
  const [isLoading, setIsLoading] = useState(false);

  const days = [
    { key: "monday", label: "Monday" },
    { key: "tuesday", label: "Tuesday" },
    { key: "wednesday", label: "Wednesday" },
    { key: "thursday", label: "Thursday" },
    { key: "friday", label: "Friday" },
    { key: "saturday", label: "Saturday" },
    { key: "sunday", label: "Sunday" },
  ];

  const times = [
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
  ];

  const statusOptions = [
    { value: "available", label: "Available", color: "bg-green-500" },
    { value: "blocked", label: "Blocked", color: "bg-gray-400" },
    { value: "empty", label: "Empty", color: "bg-gray-200" },
  ];

  const toggleSlot = (day: string, time: string) => {
    const currentStatus = editedSchedule[day]?.[time] || "empty";
    let nextStatus = "available";

    if (currentStatus === "available") nextStatus = "blocked";
    else if (currentStatus === "blocked") nextStatus = "empty";
    else nextStatus = "available";

    setEditedSchedule((prev: any) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [time]: nextStatus === "empty" ? undefined : nextStatus,
      },
    }));
  };

  const getSlotColor = (status: string) => {
    switch (status) {
      case "available":
        return "bg-green-500";
      case "blocked":
        return "bg-gray-400";
      case "booked":
        return "bg-blue-500";
      default:
        return "bg-gray-200";
    }
  };

  const getSlotTextColor = (status: string) => {
    switch (status) {
      case "available":
      case "blocked":
      case "booked":
        return "text-white";
      default:
        return "text-gray-500";
    }
  };

  const handleSave = async () => {
    setIsLoading(true);

    // Calculate stats
    let totalSlots = 0;
    let availableSlots = 0;
    let bookedSlots = 0;
    let blockedSlots = 0;

    Object.values(editedSchedule).forEach((daySchedule: any) => {
      Object.values(daySchedule || {}).forEach((status: any) => {
        totalSlots++;
        if (status === "available") availableSlots++;
        else if (status === "booked") bookedSlots++;
        else if (status === "blocked") blockedSlots++;
      });
    });

    const scheduleData = {
      weeklySchedule: editedSchedule,
      stats: {
        totalSlots,
        availableSlots,
        bookedSlots,
        blockedSlots,
      },
    };

    try {
      await saveScheduleMutation.mutateAsync(scheduleData);
      onClose();
      Alert.alert("Success", "Schedule updated successfully!");
    } catch (error) {
      console.error("Save schedule error:", error);
      Alert.alert("Error", "Failed to save schedule. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setEditedSchedule(schedule || {});
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white pt-12 pb-4 px-4 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-800">
              Edit Schedule
            </Text>
            <View className="flex-row">
              <TouchableOpacity
                onPress={handleClose}
                disabled={isLoading}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center mr-3"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSave}
                disabled={isLoading || saveScheduleMutation.isPending}
                className={`w-8 h-8 rounded-full items-center justify-center ${
                  isLoading || saveScheduleMutation.isPending
                    ? "bg-gray-300"
                    : "bg-blue-500"
                }`}
              >
                <Check size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Instructions */}
          <View className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              How to Edit
            </Text>
            <Text className="text-gray-600 mb-4">
              Tap on time slots to cycle through:
            </Text>
            <View className="space-y-2">
              {statusOptions.map((status) => (
                <View key={status.value} className="flex-row items-center">
                  <View
                    className={`w-4 h-4 rounded-full ${status.color} mr-3`}
                  />
                  <Text className="text-gray-700">{status.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Schedule Grid */}
          <View className="bg-white rounded-3xl shadow-lg p-6">
            <Text className="text-lg font-bold text-gray-800 mb-4">
              Weekly Schedule
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View>
                {/* Time Header */}
                <View className="flex-row mb-3">
                  <View className="w-20" />
                  {times.map((time) => (
                    <View key={time} className="w-16 items-center">
                      <Text className="text-gray-500 text-xs font-medium">
                        {time}
                      </Text>
                    </View>
                  ))}
                </View>

                {/* Days and Slots */}
                {days.map((day) => (
                  <View key={day.key} className="flex-row items-center mb-2">
                    <View className="w-20">
                      <Text className="text-gray-600 text-sm font-semibold">
                        {day.label}
                      </Text>
                    </View>
                    {times.map((time) => {
                      const status = editedSchedule[day.key]?.[time] || "empty";
                      return (
                        <TouchableOpacity
                          key={`${day.key}-${time}`}
                          onPress={() => toggleSlot(day.key, time)}
                          disabled={status === "booked"}
                          className={`w-14 h-8 rounded-xl mx-1 items-center justify-center ${getSlotColor(status)} shadow-sm ${
                            status === "booked" ? "opacity-70" : ""
                          }`}
                        >
                          <Text
                            className={`text-xs font-medium ${getSlotTextColor(status)}`}
                          >
                            {status === "empty"
                              ? ""
                              : status.charAt(0).toUpperCase()}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Bottom Spacing */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </Modal>
  );
}

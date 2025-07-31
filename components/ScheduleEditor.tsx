import { Availability } from "@/lib/api";
import { useSaveSchedule } from "@/lib/queries";
import { Plus, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface ScheduleEditorProps {
  visible: boolean;
  schedule: any;
  onClose: () => void;
}

interface TimeSlot {
  startTime: string;
  endTime: string;
}

interface DaySchedule {
  [key: string]: TimeSlot[];
}

// Common timezone options
const TIMEZONE_OPTIONS = [
  { label: "Pacific Time (GMT-8:00)", value: "America/Los_Angeles" },
  { label: "Mountain Time (GMT-7:00)", value: "America/Denver" },
  { label: "Central Time (GMT-6:00)", value: "America/Chicago" },
  { label: "Eastern Time (GMT-5:00)", value: "America/New_York" },
  { label: "UTC (GMT+0:00)", value: "UTC" },
  { label: "London (GMT+0:00)", value: "Europe/London" },
  { label: "Paris (GMT+1:00)", value: "Europe/Paris" },
  { label: "Tokyo (GMT+9:00)", value: "Asia/Tokyo" },
  { label: "Sydney (GMT+10:00)", value: "Australia/Sydney" },
  { label: "Mumbai (GMT+5:30)", value: "Asia/Kolkata" },
  { label: "Dubai (GMT+4:00)", value: "Asia/Dubai" },
];

export default function ScheduleEditor({
  visible,
  schedule,
  onClose,
}: ScheduleEditorProps) {
  const saveScheduleMutation = useSaveSchedule();

  // Get user's current timezone as default
  const getUserTimezone = () => {
    try {
      return getTimezone();
    } catch {
      return "America/New_York"; // fallback
    }
  };

  const [timezone, setTimezone] = useState(
    schedule?.timezone || getUserTimezone()
  );
  const [daySchedules, setDaySchedules] = useState<DaySchedule>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showTimezoneDropdown, setShowTimezoneDropdown] = useState(false);

  const days = [
    { key: "monday", label: "Mon" },
    { key: "tuesday", label: "Tue" },
    { key: "wednesday", label: "Wed" },
    { key: "thursday", label: "Thu" },
    { key: "friday", label: "Fri" },
    { key: "saturday", label: "Sat" },
    { key: "sunday", label: "Sun" },
  ];

  // Convert availabilities to day schedules format
  useEffect(() => {
    if (schedule?.availabilities) {
      const newDaySchedules: DaySchedule = {};

      schedule.availabilities.forEach((availability: Availability) => {
        if (!newDaySchedules[availability.dayOfWeek]) {
          newDaySchedules[availability.dayOfWeek] = [];
        }
        newDaySchedules[availability.dayOfWeek].push({
          startTime: availability.startTime,
          endTime: availability.endTime,
        });
      });

      setDaySchedules(newDaySchedules);
    }
  }, [schedule]);

  // Update timezone when schedule changes
  useEffect(() => {
    if (schedule?.timezone) {
      setTimezone(schedule.timezone);
    }
  }, [schedule]);

  const addTimeSlot = (dayKey: string) => {
    setDaySchedules((prev) => ({
      ...prev,
      [dayKey]: [
        ...(prev[dayKey] || []),
        { startTime: "09:00", endTime: "17:00" },
      ],
    }));
  };

  const removeTimeSlot = (dayKey: string, index: number) => {
    setDaySchedules((prev) => ({
      ...prev,
      [dayKey]: prev[dayKey]?.filter((_, i) => i !== index) || [],
    }));
  };

  const updateTimeSlot = (
    dayKey: string,
    index: number,
    field: "startTime" | "endTime",
    value: string
  ) => {
    setDaySchedules((prev) => ({
      ...prev,
      [dayKey]:
        prev[dayKey]?.map((slot, i) =>
          i === index ? { ...slot, [field]: value } : slot
        ) || [],
    }));
  };

  const validateTimeFormat = (time: string): boolean => {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  };

  const convertToAvailabilities = (): Omit<
    Availability,
    "id" | "scheduleId"
  >[] => {
    const availabilities: Omit<Availability, "id" | "scheduleId">[] = [];

    Object.entries(daySchedules).forEach(([dayOfWeek, timeSlots]) => {
      timeSlots.forEach((slot) => {
        if (
          validateTimeFormat(slot.startTime) &&
          validateTimeFormat(slot.endTime)
        ) {
          const startFloat = parseFloat(slot.startTime.replace(":", "."));
          const endFloat = parseFloat(slot.endTime.replace(":", "."));

          if (startFloat < endFloat) {
            availabilities.push({
              dayOfWeek: dayOfWeek as any,
              startTime: slot.startTime,
              endTime: slot.endTime,
            });
          }
        }
      });
    });

    return availabilities;
  };

  const handleSave = async () => {
    setIsLoading(true);

    try {
      const availabilities = convertToAvailabilities();

      await saveScheduleMutation.mutateAsync({
        timezone,
        availabilities,
      });

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
    // Reset to original values
    setTimezone(schedule?.timezone || getUserTimezone());
    if (schedule?.availabilities) {
      const newDaySchedules: DaySchedule = {};
      schedule.availabilities.forEach((availability: Availability) => {
        if (!newDaySchedules[availability.dayOfWeek]) {
          newDaySchedules[availability.dayOfWeek] = [];
        }
        newDaySchedules[availability.dayOfWeek].push({
          startTime: availability.startTime,
          endTime: availability.endTime,
        });
      });
      setDaySchedules(newDaySchedules);
    } else {
      setDaySchedules({});
    }
    setShowTimezoneDropdown(false);
    onClose();
  };

  const getTimezoneLabel = (value: string) => {
    const option = TIMEZONE_OPTIONS.find((opt) => opt.value === value);
    return option?.label || value;
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="bg-white pt-12 pb-4 px-6 shadow-sm">
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-gray-800">Schedule</Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-6" showsVerticalScrollIndicator={false}>
          {/* Timezone Section */}
          <View className="mb-6">
            <Text className="text-base font-semibold text-gray-800 mb-3">
              Timezone
            </Text>
            <TouchableOpacity
              onPress={() => setShowTimezoneDropdown(!showTimezoneDropdown)}
              className="bg-white rounded-xl p-4 shadow-sm border border-gray-200"
            >
              <Text className="text-gray-800 text-base">
                {getTimezoneLabel(timezone)}
              </Text>
            </TouchableOpacity>

            {showTimezoneDropdown && (
              <View className="bg-white rounded-xl mt-2 shadow-lg border border-gray-200 max-h-48">
                <ScrollView showsVerticalScrollIndicator={false}>
                  {TIMEZONE_OPTIONS.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => {
                        setTimezone(option.value);
                        setShowTimezoneDropdown(false);
                      }}
                      className={`p-4 border-b border-gray-100 ${
                        timezone === option.value ? "bg-blue-50" : ""
                      }`}
                    >
                      <Text
                        className={`text-base ${
                          timezone === option.value
                            ? "text-blue-600 font-medium"
                            : "text-gray-800"
                        }`}
                      >
                        {option.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          {/* Days Schedule */}
          {days.map((day) => (
            <View key={day.key} className="mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-base font-semibold text-gray-800">
                  {day.label}
                </Text>
                <TouchableOpacity
                  onPress={() => addTimeSlot(day.key)}
                  className="w-8 h-8 rounded-full bg-blue-50 items-center justify-center"
                >
                  <Plus size={16} color="#3B82F6" />
                </TouchableOpacity>
              </View>

              {daySchedules[day.key]?.map((slot, index) => (
                <View
                  key={index}
                  className="flex-row items-center mb-3 bg-white rounded-xl p-4 shadow-sm"
                >
                  <TextInput
                    value={slot.startTime}
                    onChangeText={(value) =>
                      updateTimeSlot(day.key, index, "startTime", value)
                    }
                    placeholder="9:00"
                    className="bg-gray-50 rounded-lg px-3 py-2 text-center text-base text-gray-800 w-20"
                    keyboardType="numeric"
                  />

                  <Text className="mx-4 text-gray-500 text-lg">-</Text>

                  <TextInput
                    value={slot.endTime}
                    onChangeText={(value) =>
                      updateTimeSlot(day.key, index, "endTime", value)
                    }
                    placeholder="17:00"
                    className="bg-gray-50 rounded-lg px-3 py-2 text-center text-base text-gray-800 w-20"
                    keyboardType="numeric"
                  />

                  <TouchableOpacity
                    onPress={() => removeTimeSlot(day.key, index)}
                    className="ml-4 w-8 h-8 rounded-full bg-red-50 items-center justify-center"
                  >
                    <X size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              )) || (
                <View className="bg-gray-50 rounded-xl p-4 items-center">
                  <Text className="text-gray-500 text-sm">
                    No availability set
                  </Text>
                </View>
              )}
            </View>
          ))}

          {/* Save Button */}
          <TouchableOpacity
            onPress={handleSave}
            disabled={isLoading || saveScheduleMutation.isPending}
            className={`rounded-xl p-4 items-center mt-6 ${
              isLoading || saveScheduleMutation.isPending
                ? "bg-gray-300"
                : "bg-blue-500"
            }`}
          >
            <Text className="text-white text-base font-semibold">
              {isLoading || saveScheduleMutation.isPending
                ? "Saving..."
                : "Save"}
            </Text>
          </TouchableOpacity>

          {/* Bottom Spacing */}
          <View className="h-20" />
        </ScrollView>
      </View>
    </Modal>
  );
}

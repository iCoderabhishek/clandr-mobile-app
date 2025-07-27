import { useCreateEvent } from "@/lib/queries";
import { X } from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface CreateEventModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function CreateEventModal({
  visible,
  onClose,
}: CreateEventModalProps) {
  const createEventMutation = useCreateEvent();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [active, setActive] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDuration("30");
    setActive(true);
  };
  const durationNum = parseInt(duration);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter an event description");
      return;
    }

    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert("Error", "Please enter a valid duration in minutes");
      return;
    }

    const payload = {
      name: title.trim(),
      description: description.trim(),
      durationInMinutes: durationNum,
      isActive: active,
    };

    console.log("Sending event payload:", payload);

    setIsLoading(true);

    try {
      await createEventMutation.mutateAsync(payload);

      resetForm();
      onClose();
      Alert.alert("Success", "Event created successfully!");
    } catch (error) {
      console.error("Create event error:", error);
      Alert.alert("Error", "Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const ToggleSwitch = ({
    value,
    onToggle,
  }: {
    value: boolean;
    onToggle: () => void;
  }) => (
    <TouchableOpacity
      onPress={onToggle}
      disabled={isLoading}
      className={`w-12 h-6 rounded-full p-1 ${value ? "bg-blue-500" : "bg-gray-300"}`}
    >
      <View
        className={`w-4 h-4 bg-white rounded-full shadow-sm ${value ? "ml-auto" : ""}`}
      />
    </TouchableOpacity>
  );

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
              Create Event
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
            >
              <X size={20} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView className="flex-1 p-4">
          {/* Event Title */}
          <View className="bg-white rounded-3xl shadow-lg p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Event Title *
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Coffee Chat ☕"
              editable={!isLoading}
              className="bg-gray-50 rounded-2xl p-4 text-gray-800 text-lg"
              multiline={false}
            />
            <Text className="text-gray-500 text-sm mt-2">
              The name users will see when booking
            </Text>
          </View>

          {/* Duration */}
          <View className="bg-white rounded-3xl shadow-lg p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Duration *
            </Text>
            <View className="flex-row items-center">
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="30"
                keyboardType="numeric"
                editable={!isLoading}
                className="bg-gray-50 rounded-2xl p-4 text-gray-800 text-lg w-20 text-center"
              />
              <Text className="text-gray-600 ml-3 text-lg">minutes</Text>
            </View>
          </View>

          {/* Description */}
          <View className="bg-white rounded-3xl shadow-lg p-6 mb-4">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Description *
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe what this event is about..."
              editable={!isLoading}
              className="bg-gray-50 rounded-2xl p-4 text-gray-800 min-h-[100px]"
              multiline={true}
              textAlignVertical="top"
            />
            <Text className="text-gray-500 text-sm mt-2">
              Help users understand what to expect
            </Text>
          </View>

          {/* Active Toggle */}
          <View className="bg-white rounded-3xl shadow-lg p-6 mb-6">
            <View className="flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">
                  Active
                </Text>
                <Text className="text-gray-500 text-sm">
                  Make this event available for booking immediately
                </Text>
              </View>
              <ToggleSwitch
                value={active}
                onToggle={() => !isLoading && setActive(!active)}
              />
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View className="bg-white p-4 shadow-lg">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleClose}
              disabled={isLoading}
              className={`bg-gray-50 rounded-2xl px-6 py-4 flex-1 items-center justify-center ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              <Text className="text-gray-600 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleCreate}
              disabled={
                isLoading ||
                createEventMutation.isPending ||
                !title.trim() ||
                !description.trim()
              }
              className={`bg-blue-500 rounded-2xl px-6 py-4 flex-1 items-center justify-center ${
                isLoading ||
                createEventMutation.isPending ||
                !title.trim() ||
                !description.trim()
                  ? "opacity-50"
                  : ""
              }`}
            >
              <Text className="text-white font-semibold">
                {createEventMutation.isPending ? "Creating..." : "Create Event"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

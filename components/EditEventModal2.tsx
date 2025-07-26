import { Event } from "@/lib/api";
import { useDeleteEvent, useUpdateEvent } from "@/lib/queries";
import { Trash2, X } from "lucide-react-native";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface EditEventModalProps {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
}

export default function EditEventModal2({
  visible,
  event,
  onClose,
}: EditEventModalProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("30");
  const [active, setActive] = useState(true);

  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  // Update form when event changes
  useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDuration(event.duration.toString());
      setActive(event.active);
    }
  }, [event]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDuration("30");
    setActive(true);
  };

  const handleUpdate = async () => {
    if (!event) return;

    if (!title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }

    if (!description.trim()) {
      Alert.alert("Error", "Please enter an event description");
      return;
    }

    const durationNum = parseInt(duration);
    if (isNaN(durationNum) || durationNum <= 0) {
      Alert.alert("Error", "Please enter a valid duration in minutes");
      return;
    }

    try {
      await updateEventMutation.mutateAsync({
        id: event.id,
        event: {
          title: title.trim(),
          description: description.trim(),
          duration: durationNum,
          active,
        },
      });

      onClose();
      Alert.alert("Success", "Event updated successfully!");
    } catch (error) {
      console.error("Update event error:", error);
      Alert.alert("Error", "Failed to update event. Please try again.");
    }
  };

  const handleDelete = () => {
    if (!event) return;

    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteEventMutation.mutateAsync(event.id);
              onClose();
              Alert.alert("Success", "Event deleted successfully!");
            } catch (error) {
              console.error("Delete event error:", error);
              Alert.alert("Error", "Failed to delete event. Please try again.");
            }
          },
        },
      ]
    );
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
      className={`w-12 h-6 rounded-full p-1 ${value ? "bg-blue-500" : "bg-gray-300"}`}
    >
      <View
        className={`w-4 h-4 bg-white rounded-full ${value ? "ml-auto" : ""}`}
        style={styles.toggleShadow}
      />
    </TouchableOpacity>
  );

  if (!event) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-800">Edit Event</Text>
            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleDelete}
                className="w-8 h-8 rounded-full bg-red-50 items-center justify-center mr-3"
              >
                <Trash2 size={16} color="#EF4444" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleClose}
                className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center"
              >
                <X size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView
            className="flex-1 p-6"
            showsVerticalScrollIndicator={false}
          >
            {/* Event Title */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Event Title *
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Enter event title"
                className="bg-gray-50 rounded-xl p-4 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Event Description */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Description *
              </Text>
              <TextInput
                value={description}
                onChangeText={setDescription}
                placeholder="Describe your event"
                multiline
                numberOfLines={4}
                className="bg-gray-50 rounded-xl p-4 text-base text-gray-800 h-24"
                placeholderTextColor="#9CA3AF"
                textAlignVertical="top"
              />
            </View>

            {/* Duration */}
            <View className="mb-6">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Duration (minutes) *
              </Text>
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="30"
                keyboardType="numeric"
                className="bg-gray-50 rounded-xl p-4 text-base text-gray-800"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            {/* Active Toggle */}
            <View className="mb-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-base font-semibold text-gray-800 mb-1">
                    Active Event
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Allow people to book this event
                  </Text>
                </View>
                <ToggleSwitch
                  value={active}
                  onToggle={() => setActive(!active)}
                />
              </View>
            </View>

            {/* Event Stats */}
            <View className="mb-8 p-4 bg-blue-50 rounded-xl">
              <Text className="text-base font-semibold text-gray-800 mb-2">
                Event Statistics
              </Text>
              <View className="flex-row justify-between">
                <View className="items-center">
                  <Text className="text-lg font-bold text-blue-600">
                    {event.bookings}
                  </Text>
                  <Text className="text-gray-600 text-sm">Bookings</Text>
                </View>
                <View className="items-center">
                  <Text className="text-lg font-bold text-blue-600">
                    {new Date(event.created).toLocaleDateString()}
                  </Text>
                  <Text className="text-gray-600 text-sm">Created</Text>
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="flex-row space-x-3">
              <TouchableOpacity
                onPress={handleUpdate}
                disabled={updateEventMutation.isPending}
                className={`flex-1 rounded-xl p-4 items-center ${
                  updateEventMutation.isPending ? "bg-gray-300" : "bg-blue-500"
                }`}
              >
                <Text className="text-white text-base font-semibold">
                  {updateEventMutation.isPending
                    ? "Updating..."
                    : "Update Event"}
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  toggleShadow: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});

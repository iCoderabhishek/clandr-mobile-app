import { useDeleteEvent, useUpdateEvent } from "@/lib/queries";
import { Trash2, X } from "lucide-react-native";
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

interface Event {
  id: number;
  title: string;
  description: string;
  duration: number;
  active: boolean;
  bookings: number;
  created: string;
  userId: string;
}

interface EditEventModalProps {
  visible: boolean;
  event: Event | null;
  onClose: () => void;
}

export default function EditEventModal({
  visible,
  event,
  onClose,
}: EditEventModalProps) {
  const updateEventMutation = useUpdateEvent();
  const deleteEventMutation = useDeleteEvent();

  const [title, setTitle] = useState(event?.title || "");
  const [description, setDescription] = useState(event?.description || "");
  const [duration, setDuration] = useState(event?.duration?.toString() || "60");
  const [active, setActive] = useState(event?.active || true);
  const [isLoading, setIsLoading] = useState(false);

  React.useEffect(() => {
    if (event) {
      setTitle(event.title);
      setDescription(event.description);
      setDuration(event.duration.toString());
      setActive(event.active);
    }
  }, [event]);

  const handleSave = async () => {
    if (!event || !title.trim()) return;

    setIsLoading(true);

    const updatedEventData = {
      title: title.trim(),
      description: description.trim(),
      duration: parseInt(duration) || 60,
      active,
    };

    try {
      await updateEventMutation.mutateAsync({
        id: event.id,
        event: updatedEventData,
      });
      onClose();
    } catch (error) {
      Alert.alert("Error", "Failed to update event. Please try again.");
    } finally {
      setIsLoading(false);
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
            setIsLoading(true);
            try {
              await deleteEventMutation.mutateAsync(event.id);
              onClose();
            } catch (error) {
              Alert.alert("Error", "Failed to delete event. Please try again.");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (!event) return null;

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
            <Text className="text-xl font-bold text-gray-800">Edit Event</Text>
            <TouchableOpacity
              onPress={onClose}
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
              Event Title
            </Text>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Play football⚽"
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
              Duration
            </Text>
            <View className="flex-row items-center">
              <TextInput
                value={duration}
                onChangeText={setDuration}
                placeholder="60"
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
              Description
            </Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Play football with me. Make some time to go outside and play!"
              editable={!isLoading}
              className="bg-gray-50 rounded-2xl p-4 text-gray-800 min-h-[100px]"
              multiline={true}
              textAlignVertical="top"
            />
            <Text className="text-gray-500 text-sm mt-2">
              Optional description of the event
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
                  Inactive events will not be visible for users to book
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => !isLoading && setActive(!active)}
                disabled={isLoading}
                className={`w-14 h-8 rounded-full p-1 ${active ? "bg-blue-500" : "bg-gray-300"}`}
              >
                <View
                  className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all ${active ? "ml-auto" : ""}`}
                />
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>

        {/* Bottom Actions */}
        <View className="bg-white p-4 shadow-lg">
          <View className="flex-row space-x-3">
            <TouchableOpacity
              onPress={handleDelete}
              disabled={isLoading || deleteEventMutation.isPending}
              className={`bg-red-50 rounded-2xl px-6 py-4 flex-row items-center justify-center ${
                isLoading || deleteEventMutation.isPending ? "opacity-50" : ""
              }`}
            >
              <Trash2 size={20} color="#EF4444" />
              <Text className="text-red-500 font-semibold ml-2">
                {deleteEventMutation.isPending ? "Deleting..." : "Delete"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onClose}
              disabled={isLoading}
              className={`bg-gray-50 rounded-2xl px-6 py-4 flex-1 items-center justify-center ${
                isLoading ? "opacity-50" : ""
              }`}
            >
              <Text className="text-gray-600 font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSave}
              disabled={
                isLoading || updateEventMutation.isPending || !title.trim()
              }
              className={`bg-blue-500 rounded-2xl px-6 py-4 flex-1 items-center justify-center ${
                isLoading || updateEventMutation.isPending || !title.trim()
                  ? "opacity-50"
                  : ""
              }`}
            >
              <Text className="text-white font-semibold">
                {updateEventMutation.isPending ? "Saving..." : "Save"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

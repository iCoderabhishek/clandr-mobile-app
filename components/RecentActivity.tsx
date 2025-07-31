import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { Event, useApiClient } from "../lib/api"; // adjust path if needed

export default function RecentActivity() {
  const api = useApiClient();
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const data = await api.getEvents();
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        setEvents(sorted.slice(0, 5)); // show recent 5 only
      } catch (error) {
        console.error("Failed to fetch events:", error);
      }
    };

    fetchEvents();
  }, []);

  return (
    <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-6">
      <Text className="text-xl font-bold text-gray-800 mb-4">
        Recent Activity
      </Text>

      {events.map((event) => (
        <View
          key={event.id}
          className="py-3 border-b border-gray-100 last:border-b-0"
        >
          <Text className="text-gray-800 font-medium mb-1">
            Created new event "{event.name}"
          </Text>
          <Text className="text-gray-500 text-sm">
            {formatDistanceToNow(new Date(event.createdAt))} ago
          </Text>
        </View>
      ))}
    </View>
  );
}

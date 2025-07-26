import { Tabs } from "expo-router";
import { Calendar, Clock, Globe, User } from "lucide-react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "white",
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          height: 80,
          paddingBottom: 20,
          paddingTop: 10,
        },
        tabBarActiveTintColor: "#3B82F6",
        tabBarInactiveTintColor: "#6B7280",
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "My Events",
          tabBarIcon: ({ size, color }) => (
            <Calendar size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="schedule"
        options={{
          title: "My Schedule",
          tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="public"
        options={{
          title: "Public Profile",
          tabBarIcon: ({ size, color }) => <Globe size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="time"
        options={{
          title: "Time",
          tabBarIcon: ({ size, color }) => <Clock size={size} color={color} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ size, color }) => <User size={size} color={color} />,
        }}
      />
    </Tabs>
  );
}

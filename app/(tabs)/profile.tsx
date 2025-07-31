import RecentActivity from "@/components/RecentActivity";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import {
  Bell,
  Calendar,
  ChevronRight,
  Globe,
  LogOut,
  Settings,
  User,
} from "lucide-react-native";
import React, { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ProfileScreen() {
  const { isSignedIn, signOut } = useAuth();
  const { user } = useUser();

  const [calendarSync, setCalendarSync] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [publicProfile, setPublicProfile] = useState(true);

  const router = useRouter();

  // Show auth required state
  if (!isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center px-4">
        <Text className="text-gray-800 text-xl font-bold mb-2">
          Sign in required
        </Text>
        <Text className="text-gray-600 text-center">
          Please sign in to view your profile
        </Text>
      </SafeAreaView>
    );
  }

  const profileStats = [
    { label: "Total Events", value: "4", icon: Calendar },
    { label: "Active Events", value: "3", icon: Globe },
    { label: "Monthly Bookings", value: "38", icon: User },
  ];

  const accountSettings = [
    {
      label: "Account Settings",
      icon: User,
      link: "https://humane-anchovy-35.accounts.dev/user",
    },
    {
      label: "Privacy & Security",
      icon: Settings,
      link: "https://clandr-web.vercel.app/",
    },
    {
      label: "Help & Support",
      icon: Bell,
      link: "mailto:iamabhishek1310@gmail.com?subject=Clandr%20Support%20Request&body=Hi%20Abhishek%2C%0A%0AI%27m%20facing%20an%20issue%20with%20Clandr.%20Here%20are%20the%20details%3A%0A%0A-%20Issue%20Description%3A%20%0A-%20Steps%20to%20Reproduce%3A%0A-%20Expected%20Behavior%3A%0A-%20Device/Platform%3A%0A%0AThank%20you%20for%20your%20assistance.%0A%0ABest%2C%0A%5BYour%20Name%5D",
    },

    { label: "About", icon: Settings, link: "https://clandr-web.vercel.app/" },
    {
      label: "Sign Out",
      icon: LogOut,
      action: async () => {
        try {
          await signOut();
        } catch (error) {
          console.error("Sign out error:", error);
        }
      },
    },
  ];

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
        style={Platform.select({
          ios: {
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 1 },
            shadowOpacity: 0.1,
            shadowRadius: 2,
          },
          android: {
            elevation: 2,
          },
        })}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="pt-4 pb-6 px-4">
          <Text className="text-3xl font-bold text-gray-800 mb-2">
            My Profile
          </Text>
          <Text className="text-gray-600 text-lg">
            Manage your account and preferences
          </Text>
        </View>

        {/* Profile Card */}
        <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-6">
          <View className="items-center mb-6">
            <View className="w-24 h-24  rounded-full items-center justify-center mb-4 shadow-lg">
              <Image
                source={{ uri: user?.imageUrl }}
                className="w-24 h-24 rounded-full mb-4 shadow-lg"
              />
            </View>
            <Text className="text-2xl font-bold text-gray-800 mb-1">
              {user?.fullName || user?.firstName || "User"}
            </Text>
            <Text className="text-gray-600">
              {user?.primaryEmailAddress?.emailAddress || "No email"}
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row justify-between">
            {profileStats.map((stat, index) => (
              <View key={index} className="items-center flex-1">
                <View className="bg-blue-50 rounded-full p-3 mb-2">
                  <stat.icon size={20} color="#3B82F6" />
                </View>
                <Text className="text-lg font-bold text-gray-800">
                  {stat.value}
                </Text>
                <Text className="text-gray-500 text-sm text-center">
                  {stat.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Account Settings */}
        <View className="bg-white rounded-3xl shadow-lg p-6 mx-4 mb-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">Account</Text>

          {accountSettings.map((setting, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (setting.action) {
                  setting.action(); // Sign out
                } else if (setting.link) {
                  Alert.alert(
                    "Open Link",
                    `Do you want to open "${setting.label}" in your browser?`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Open",
                        onPress: () => Linking.openURL(setting.link!),
                      },
                    ]
                  );
                }
              }}
              className="flex-row items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
            >
              <View className="flex-row items-center">
                <View className="bg-gray-50 rounded-full p-2 mr-3">
                  <setting.icon size={20} color="#6B7280" />
                </View>
                <Text
                  className={`font-medium ${setting.label === "Sign Out" ? "text-red-600" : "text-gray-800"}`}
                >
                  {setting.label}
                </Text>
              </View>
              {setting.label !== "Sign Out" && (
                <ChevronRight size={20} color="#6B7280" />
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Recent Activity */}
        <RecentActivity />

        {/* Bottom Spacing with GitHub Credit */}
        <View className="h-24 items-center justify-center">
          <Text className="text-gray-500 text-base">
            Craft by{" "}
            <Text
              className="text-blue-600 underline"
              onPress={() =>
                Linking.openURL("https://github.com/iCoderabhishek")
              }
            >
              @iCoderabhishek
            </Text>{" "}
            •{" "}
            <Text
              className="text-yellow-500 underline"
              onPress={() =>
                Linking.openURL(
                  "https://github.com/iCoderabhishek/clandr-mobile-app"
                )
              }
            >
              Star on GitHub ⭐
            </Text>
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

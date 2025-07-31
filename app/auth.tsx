import { useAuth, useOAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const { isSignedIn, isLoaded } = useAuth();
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const router = useRouter();

  if (!isLoaded) {
    return (
      <SafeAreaView className="flex-1 bg-blue-500 items-center justify-center">
        <Text className="text-white text-lg">Loading auth state...</Text>
      </SafeAreaView>
    );
  }

  // Redirect if already signed in
  React.useEffect(() => {
    if (!isLoaded) return; // Wait for Clerk to load

    if (isSignedIn) {
      router.replace("/(tabs)");
    }
  }, [isSignedIn, isLoaded, router]);

  const handleGoogleAuth = async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (createdSessionId) {
        setActive!({ session: createdSessionId });
        router.replace("/(tabs)");
      }
    } catch (err: any) {
      console.error("OAuth error", err);

      // Handle the case where user is already signed in
      if (err.message?.includes("already signed in")) {
        router.replace("/(tabs)");
      } else {
        Alert.alert(
          "Authentication Error",
          "Failed to sign in with Google. Please try again."
        );
      }
    }
  };

  // Show loading if already signed in
  if (isSignedIn) {
    return (
      <SafeAreaView className="flex-1 bg-blue-500 items-center justify-center">
        <Text className="text-white text-lg">Redirecting...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-500">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6 pt-24 pb-12 relative z-10">
          {/* Logo & Title */}
          <View className="items-center mb-12">
            <View className="w-24 h-24 rounded-full bg-white/10 items-center justify-center mb-4 shadow-xl">
              <Image
                source={require("../assets/images/logo.png")}
                resizeMode="contain"
                style={{ width: 60, height: 60 }}
              />
            </View>
            <Text className="text-white text-4xl font-extrabold mb-2 tracking-tight shadow-xl">
              Clandr
            </Text>
            <Text className="text-blue-100 text-center text-lg leading-relaxed">
              Schedule smarter, connect better
            </Text>
          </View>

          {/* Headline */}
          <Text className="text-white text-3xl font-semibold text-center mb-2 mt-10">
            Welcome Back!
          </Text>
          <Text className="text-blue-100 text-center mb-8 text-lg">
            Sign in to start organizing your events
          </Text>

          {/* Google Sign In */}
          <TouchableOpacity
            onPress={handleGoogleAuth}
            className="bg-white/90 rounded-2xl py-4 px-6 flex-row items-center justify-center shadow-lg mb-6"
          >
            <View className="w-10 h-10 rounded-full mr-3 items-center justify-center overflow-hidden">
              <Image
                source={require("../assets/images/google-logo.png")}
                style={{ width: 26, height: 26, resizeMode: "contain" }}
              />
            </View>
            <Text className="text-black font-medium text-lg shadow-md">
              Continue with Google
            </Text>
          </TouchableOpacity>

          {/* Terms */}
          <Text className="text-white/80 text-sm text-center leading-4 px-4 mt-10">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </Text>
        </View>
      </ScrollView>

      {/* Decorative Circles - Top */}
      <View className="absolute top-0 left-0 right-0 h-72 overflow-hidden">
        <View className="absolute -top-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <View className="absolute -top-32 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <View
          className="absolute top-20 left-1/2 w-48 h-48 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            transform: [{ translateX: -96 }],
          }}
        />
      </View>

      {/* Decorative Circles - Bottom */}
      <View className="absolute bottom-0 left-0 right-0 h-72 overflow-hidden">
        <View className="absolute -bottom-20 -left-20 w-80 h-80 bg-white/10 rounded-full" />
        <View className="absolute -bottom-32 -right-16 w-64 h-64 bg-white/5 rounded-full" />
        <View
          className="absolute bottom-20 left-1/2 w-48 h-48 rounded-full"
          style={{
            backgroundColor: "rgba(255,255,255,0.08)",
            transform: [{ translateX: -96 }],
          }}
        />
      </View>
    </SafeAreaView>
  );
}

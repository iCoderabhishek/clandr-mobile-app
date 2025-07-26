import Container from "@/components/Container";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function RootLayoutNav() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "auth";

    if (isSignedIn && inAuthGroup) {
      // Redirect away from auth screen if signed in
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      // Redirect to auth screen if not signed in
      router.replace("/auth");
    }
  }, [isSignedIn, isLoaded, segments, router]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useFrameworkReady();
  return (
    <AuthProvider>
      <QueryProvider>
        <Container>
          <RootLayoutNav />
        </Container>
      </QueryProvider>
    </AuthProvider>
  );
}

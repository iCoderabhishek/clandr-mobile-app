import Container from "@/components/Container";
import { useFrameworkReady } from "@/hooks/useFrameworkReady";
import AuthProvider from "@/providers/AuthProvider";
import QueryProvider from "@/providers/QueryProvider";
import { useAuth } from "@clerk/clerk-expo";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";

function AuthRedirectLogic() {
  const { isSignedIn, isLoaded } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!isLoaded) return;

    const inAuthGroup = segments[0] === "auth";

    if (isSignedIn && inAuthGroup) {
      router.replace("/(tabs)");
    } else if (!isSignedIn && !inAuthGroup) {
      router.replace("/auth");
    }
  }, [isSignedIn, isLoaded, segments, router]);

  return null;
}

export default function RootLayout() {
  useFrameworkReady();

  return (
    <AuthProvider>
      <QueryProvider>
        <Container>
          <AuthRedirectLogic />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="auth" />
            <Stack.Screen name="(tabs)" />
          </Stack>
        </Container>
      </QueryProvider>
    </AuthProvider>
  );
}

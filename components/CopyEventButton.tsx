import { CopyIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
// import Clipboard from "@react-native-clipboard/clipboard"; // optional if using this
import { Clipboard } from "react-native"; // fallback

type CopyState = "idle" | "copied" | "error";

interface CopyEventButtonProps {
  eventId: string;
  clerkUserId: string;
  style?: string;
}

const getCopyLabel = (state: CopyState) => {
  switch (state) {
    case "copied":
      return "Copied!";
    case "error":
      return "Error";
    default:
      return "Copy Link";
  }
};

export function CopyEventButton({
  eventId,
  clerkUserId,
  style = "",
}: CopyEventButtonProps) {
  const [copyState, setCopyState] = useState<CopyState>("idle");

  const handleCopy = async () => {
    try {
      const url = `https://clandr-web.vercel.app/book/${clerkUserId}/${eventId}`;

      if (Platform.OS === "web") {
        await navigator.clipboard.writeText(url);
      } else {
        Clipboard.setString(url);
      }

      setCopyState("copied");
      Toast.show({
        type: "success",
        text1: "Link copied successfully.",
      });

      setTimeout(() => setCopyState("idle"), 2000);
    } catch (error) {
      setCopyState("error");
      Toast.show({
        type: "error",
        text1: "Failed to copy link.",
      });

      setTimeout(() => setCopyState("idle"), 2000);
    }
  };

  return (
    <TouchableOpacity
      onPress={handleCopy}
      className={`bg-blue-600 rounded-xl px-4 py-2 ${style}`}
    >
      <View className="flex-row items-center">
        <CopyIcon size={16} color="white" />
        <Text className="text-white font-bold ml-2">
          {getCopyLabel(copyState)}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

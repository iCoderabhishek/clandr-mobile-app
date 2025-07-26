// components/Container.tsx
import React from "react";
import { ScrollView, View, ViewProps } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ContainerProps = {
  children: React.ReactNode;
  scroll?: boolean;
} & ViewProps;

export default function Container({
  children,
  scroll = false,
  style,
  ...props
}: ContainerProps) {
  const insets = useSafeAreaInsets();

  const content = (
    <View
      style={[
        {
          flex: 1,
          paddingHorizontal: 1,
          paddingTop: insets.top + 1,
          paddingBottom: insets.bottom + 1,
        },
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );

  return scroll ? <ScrollView>{content}</ScrollView> : content;
}

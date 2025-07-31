import { useAuth, useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export const CustomUserButton = () => {
  const { user } = useUser();
  const { signOut } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);

  if (!user) return null;

  const handleManageAccount = () => {
    setModalVisible(false);
    Linking.openURL("https://humane-anchovy-35.accounts.dev/user");
  };

  const handleSignOut = async () => {
    setModalVisible(false);
    await signOut();
  };

  return (
    <>
      <TouchableOpacity onPress={() => setModalVisible(true)}>
        <Image
          source={{ uri: user.imageUrl }}
          className="w-12 h-12 rounded-full"
        />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0,0,0,0.3)",
          }}
          onPress={() => setModalVisible(false)}
        >
          <View
            style={{
              backgroundColor: "white",
              padding: 20,
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
            }}
          >
            <Text className="text-lg font-semibold mb-2">
              Signed in as {user.fullName}
            </Text>

            <Pressable onPress={handleManageAccount}>
              <Text className="text-blue-600 text-base py-2">
                Manage Account
              </Text>
            </Pressable>

            <Pressable onPress={handleSignOut}>
              <Text className="text-red-600 text-base py-2">Sign Out</Text>
            </Pressable>

            <Pressable onPress={() => setModalVisible(false)}>
              <Text className="text-gray-600 text-base py-2">Cancel</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </>
  );
};

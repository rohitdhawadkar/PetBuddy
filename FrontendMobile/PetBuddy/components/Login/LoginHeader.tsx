import React from "react";
import { View, Text, Image } from "react-native";

interface LoginHeaderProps {
  logoUrl: string;
}

export const LoginHeader: React.FC<LoginHeaderProps> = ({ logoUrl }) => {
  return (
    <View className="items-center mb-8">
      <Image
        source={{ uri: logoUrl }}
        className="w-32 h-32 mb-6"
        accessibilityLabel="Company logo"
      />
      <Text className="text-3xl font-bold mb-2 text-gray-800">Login</Text>
      <Text className="text-base text-gray-600 text-center">
        Enter your credentials to access your account
      </Text>
    </View>
  );
};

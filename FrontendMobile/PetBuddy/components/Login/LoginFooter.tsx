import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

interface LoginFooterProps {
  onSignUpPress: () => void;
}

export const LoginFooter: React.FC<LoginFooterProps> = ({ onSignUpPress }) => {
  return (
    <View className="mt-6 flex-row justify-center">
      <Text className="text-gray-600">Don't have an account? </Text>
      <TouchableOpacity
        onPress={onSignUpPress}
        accessibilityRole="button"
        accessibilityLabel="Sign up button"
      >
        <Text className="text-blue-600 font-semibold">Sign Up</Text>
      </TouchableOpacity>
    </View>
  );
};

import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

interface LoginFormProps {
  onSubmit: (credentials: { username: string; password: string }) => void;
}

export const LoginForm: React.FC<LoginFormProps> = ({ onSubmit }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = () => {
    onSubmit({ username, password });
  };

  return (
    <View className="w-full">
      <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-1">
          Username/Email
        </Text>
        <TextInput
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          placeholder="Enter your username or email"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
          keyboardType="email-address"
          accessibilityLabel="Username or email input"
          accessibilityHint="Enter your username or email address"
        />
      </View>

      <View className="mb-6">
        <Text className="text-sm font-medium text-gray-700 mb-1">Password</Text>
        <TextInput
          className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white text-gray-900"
          placeholder="Enter your password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          accessibilityLabel="Password input"
          accessibilityHint="Enter your password"
        />
      </View>

      <TouchableOpacity
        className="w-full bg-blue-600 py-3 rounded-lg items-center"
        onPress={handleSubmit}
        accessibilityRole="button"
        accessibilityLabel="Login button"
      >
        <Text className="text-white font-semibold text-base">Login</Text>
      </TouchableOpacity>
    </View>
  );
};

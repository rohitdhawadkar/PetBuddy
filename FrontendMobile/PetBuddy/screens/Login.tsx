import React from "react";
import { View, ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { LoginHeader } from "../components/Login/LoginHeader";
import { LoginForm } from "../components/Login/LoginForm";
import { LoginFooter } from "../components/Login/LoginFooter";

const Login: React.FC = () => {
  const handleLogin = (credentials: { username: string; password: string }) => {
    // Handle login logic here
    console.log("Login attempt:", credentials);
  };

  const handleSignUpPress = () => {
    // Handle navigation to sign up screen
    console.log("Navigate to sign up");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerClassName="flex-grow"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 py-12 justify-center">
          <LoginHeader logoUrl="https://cdn.builder.io/api/v1/image/assets/8652f5a2af614b3fa8fcac9320912096/68b30979033514f3da6bc43be9df144330399f0825729b5db428bec5fc5b66e5?placeholderIfAbsent=true" />
          <LoginForm onSubmit={handleLogin} />
          <LoginFooter onSignUpPress={handleSignUpPress} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;

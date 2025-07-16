import React from "react";
import { useAuth } from "@clerk/clerk-expo";
import { ActivityIndicator, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import AppStack from "./AppStack";
import AuthStack from "./AuthStack";

const AuthGate = () => {
  const { isSignedIn, isLoaded } = useAuth();
  console.log('AuthGate:', { isSignedIn, isLoaded });

  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#181A20" }}>
        <ActivityIndicator size="large" color="#4F8CFF" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {isSignedIn ? <AppStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

export default AuthGate; 
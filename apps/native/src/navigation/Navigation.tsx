import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import CreateNoteScreen from "../screens/CreateNoteScreen";
import { useAuth } from "@clerk/clerk-expo";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isSignedIn, isLoaded } = useAuth();

  if (!isLoaded) return null; // or a loading spinner

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isSignedIn ? (
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="NotesDashboardScreen" component={NotesDashboardScreen} />
            <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
            <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

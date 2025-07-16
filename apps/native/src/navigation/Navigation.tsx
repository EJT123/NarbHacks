import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import CreateNoteScreen from "../screens/CreateNoteScreen";
import FitnessTrackerScreen from "../screens/FitnessTrackerScreen";
import FitnessExtraScreen from "../screens/FitnessExtraScreen";
import FitnessHistoryScreen from "../screens/FitnessHistoryScreen";
import { useAuth } from "@clerk/clerk-expo";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isSignedIn, isLoaded } = useAuth();

  // Debug logging
  console.log('Navigation.tsx - isLoaded:', isLoaded, 'isSignedIn:', isSignedIn);

  if (!isLoaded) return null; // or a loading spinner

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }} id={undefined}>
        {!isSignedIn ? (
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="NotesDashboardScreen" component={NotesDashboardScreen} />
            <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
            <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
            <Stack.Screen name="FitnessTrackerScreen" component={FitnessTrackerScreen} />
            <Stack.Screen name="FitnessHistoryScreen" component={FitnessHistoryScreen} />
            <Stack.Screen name="FitnessExtraScreen" component={FitnessExtraScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;

import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import NotesDashboardScreen from "../screens/NotesDashboardScreen";
import InsideNoteScreen from "../screens/InsideNoteScreen";
import CreateNoteScreen from "../screens/CreateNoteScreen";
import FitnessTrackerScreen from "../screens/FitnessTrackerScreen";
import FitnessHistoryScreen from "../screens/FitnessHistoryScreen";

const Stack = createNativeStackNavigator();

const AppStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="NotesDashboardScreen" component={NotesDashboardScreen} />
    <Stack.Screen name="InsideNoteScreen" component={InsideNoteScreen} />
    <Stack.Screen name="CreateNoteScreen" component={CreateNoteScreen} />
    <Stack.Screen name="FitnessTrackerScreen" component={FitnessTrackerScreen} />
    <Stack.Screen name="FitnessHistoryScreen" component={FitnessHistoryScreen} />
  </Stack.Navigator>
);

export default AppStack; 
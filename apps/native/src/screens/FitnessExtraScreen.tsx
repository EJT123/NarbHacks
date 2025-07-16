import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';

const FitnessExtraScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backIconContainer}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <AntDesign name="arrowleft" size={28} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.header}>Extra Fitness Page</Text>
      <Text style={styles.text}>This is a blank page for future features.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
  },
  backIconContainer: {
    position: 'absolute',
    top: 50, // Adjust as needed for spacing
    left: 20, // Adjust as needed for spacing
    zIndex: 1, // Ensure it's above other content
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 16,
  },
  text: {
    fontSize: 16,
    color: "#fff",
  },
});

export default FitnessExtraScreen; 
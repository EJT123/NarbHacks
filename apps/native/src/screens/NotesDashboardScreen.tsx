import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { Feather, AntDesign } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useAuth, useUser } from "@clerk/clerk-expo";
import { api } from "@packages/backend/convex/_generated/api";
import { useQuery } from "convex/react";
import { darkTheme } from "../theme";

const NotesDashboardScreen = ({ navigation }) => {
  const user = useUser();
  const imageUrl = user?.user?.imageUrl;
  const firstName = user?.user?.firstName;

  const allNotes = useQuery(api.notes.getNotes);
  const [search, setSearch] = useState("");

  const finalNotes = search
    ? allNotes.filter(
        (note) =>
          note.title.toLowerCase().includes(search.toLowerCase()) ||
          note.content.toLowerCase().includes(search.toLowerCase()),
      )
    : allNotes;

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        navigation.navigate("InsideNoteScreen", {
          item: item,
        })
      }
      activeOpacity={0.5}
      style={styles.noteItem}
    >
      <Text style={styles.noteText}>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../assets/icons/logo2small.png")} // Replace with your logo image file
          style={styles.logo}
        />
      </View>

      <View style={styles.yourNotesContainer}>
        {/* @ts-ignore, for css purposes */}
        <Image style={styles.avatarSmall} />
        <Text style={styles.title}>Your Notes</Text>
        {imageUrl ? (
          <Image style={styles.avatarSmall} source={{ uri: imageUrl }} />
        ) : (
          <Text>{firstName ? firstName : ""}</Text>
        )}
      </View>
      <View style={styles.searchContainer}>
        <Feather
          name="search"
          size={20}
          color={darkTheme.colors.text}
          style={styles.searchIcon}
        />
        <TextInput
          value={search}
          onChangeText={setSearch}
          placeholder="Search"
          style={styles.searchInput}
        />
      </View>
      <View style={styles.contentContainer}>
        {!finalNotes || finalNotes.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>
              Create your first note to{"\n"}get started
            </Text>
          </View>
        ) : (
          <FlatList
            data={finalNotes}
            renderItem={renderItem}
            keyExtractor={(item) => item._id}
            style={styles.notesList}
            contentContainerStyle={{
              marginTop: 19,
              borderTopWidth: 0.5,
              borderTopColor: darkTheme.colors.border,
              paddingBottom: 20,
            }}
          />
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate("CreateNoteScreen")}
          style={styles.newNoteButton}
        >
          <AntDesign name="pluscircle" size={20} color={darkTheme.colors.text} />
          <Text style={styles.newNoteButtonText}>Create a New Note</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("FitnessTrackerScreen")}
          style={[styles.newNoteButton, { backgroundColor: darkTheme.colors.accent, marginTop: 16 }]}
        >
          <AntDesign name="heart" size={20} color={darkTheme.colors.text} />
          <Text style={styles.newNoteButtonText}>Fitness Tracker</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            console.log("Setup Profile button pressed");
            navigation.navigate("UserSetupScreen");
          }}
          style={[styles.newNoteButton, { backgroundColor: "#F97316", marginTop: 16 }]}
        >
          <AntDesign name="user" size={20} color={darkTheme.colors.text} />
          <Text style={styles.newNoteButtonText}>Setup Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  header: {
    backgroundColor: darkTheme.colors.primary,
    height: 67,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 46,
    height: 46,
    borderRadius: 20,
    resizeMode: "contain",
  },
  title: {
    fontSize: RFValue(17.5),
    fontFamily: "MMedium",
    alignSelf: "center",
    color: darkTheme.colors.text,
  },
  yourNotesContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 13,
    marginTop: 19,
  },
  avatarSmall: {
    width: 28,
    height: 28,
    borderRadius: 10,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
    borderRadius: 10,
    padding: 10,
    marginHorizontal: 15,
    marginTop: 30,
    backgroundColor: darkTheme.colors.card,
  },
  searchIcon: {
    marginRight: 10,
    color: darkTheme.colors.text,
  },
  searchInput: {
    flex: 1,
    fontSize: RFValue(15),
    fontFamily: "MRegular",
    color: darkTheme.colors.text,
  },
  contentContainer: {
    flex: 1,
  },
  notesList: {
    flex: 1,
  },
  noteItem: {
    padding: 20,
    borderBottomWidth: 0.5,
    borderBottomColor: darkTheme.colors.border,
    backgroundColor: darkTheme.colors.card,
  },
  noteText: {
    fontSize: 16,
    fontFamily: "MLight",
    color: darkTheme.colors.text,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 20,
  },
  newNoteButton: {
    flexDirection: "row",
    backgroundColor: darkTheme.colors.primary,
    borderRadius: 7,
    width: "100%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  newNoteButtonText: {
    color: darkTheme.colors.text,
    fontFamily: "SemiBold",
    fontSize: RFValue(15),
    marginLeft: 8,
  },
  switchContainer: {
    position: "absolute",
    top: 20,
    right: 20,
  },
  emptyStateText: {
    color: darkTheme.colors.text,
    fontFamily: "Regular",
    fontSize: RFValue(16),
    textAlign: "center",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default NotesDashboardScreen;

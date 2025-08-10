import React from "react";
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from "react-native";

const mockData = [
  { id: "you", name: "You", status: "pending", isSelf: true },
  { id: "1", name: "Aaron Nguyen", status: "accepted" },
  { id: "2", name: "Anushka Bora", status: "pending" },
  { id: "3", name: "Connor Cho", status: "accepted" },
];

export default function MatchedRideScreen() {
  const renderItem = ({ item }) => {
    if (item.isSelf) {
      return (
        <View style={styles.selfRow}>
          <View>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.subText}>Sophomore at UC Berkeley</Text>
          </View>
          <View style={styles.selfButtons}>
            <TouchableOpacity style={styles.leaveButton}>
              <Text style={styles.leaveText}>Leave</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.acceptButton}>
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        </View>
      );
    }

    return (
      <View style={styles.row}>
        <View style={styles.avatar} />
        <View>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.subText}>Sophomore at UC Berkeley</Text>
        </View>
        <View
          style={[
            styles.statusDot,
            { backgroundColor: item.status === "accepted" ? "green" : "#ccc" },
          ]}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Waiting thirty seconds for all to accept...</Text>
      <View style={styles.progressBarBackground}>
        <View style={[styles.progressBarFill, { width: "20%" }]} />
      </View>

      <FlatList
        data={mockData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  header: {
    fontWeight: "bold",
    fontSize: 18,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  progressBarBackground: {
    height: 10,
    backgroundColor: "#eee",
    borderRadius: 5,
    marginHorizontal: 20,
    marginVertical: 10,
  },
  progressBarFill: {
    height: 10,
    backgroundColor: "#DB9C9C",
    borderRadius: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    padding: 12,
    margin: 15,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#ccc",
    marginRight: 12,
  },
  name: {
    fontWeight: "bold",
  },
  subText: {
    color: "#999",
  },
  statusDot: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginLeft: "auto",
  },
  selfRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 12,
    margin: 15,
    justifyContent: "space-between",
  },
  selfButtons: {
    flexDirection: "row",
    gap: 8,
  },
  leaveButton: {
    backgroundColor: "#FAD4D4",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  leaveText: {
    color: "#B44",
    fontWeight: "bold",
  },
  acceptButton: {
    backgroundColor: "green",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 4,
  },
  acceptText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, FlatList, TouchableOpacity } from "react-native";
import { supabase } from '../../supabase.js';

type Member = {
  id: string;
  user_id: string;
  starting_point: string;
  destination: string;
  is_matched: boolean;
  group_id: string | null;
  profile: {
    full_name: string;
    year: string | null;
    major: string | null;
    profile_picture_uri: string | null;
  };
};

export default function MatchedRideScreen({ route }) {
  const { groupId } = route.params;
  console.log(groupId);

  const [members, setMembers] = useState<Member[] | null>(null);
  // const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      const { data, error } = await supabase
        .from('ride_now_requests')
        .select(`
          id,
          user_id,
          starting_point,
          destination,
          is_matched,
          group_id,
          profile:profiles!user_id ( 
            full_name,
            year,
            major,
            profile_picture_uri
          )
        `)
        .eq('group_id', groupId);

      if (!cancelled) {
        const currentUserId = '12345678-1234-1234-1234-123456789abc';

        const normalized = (data ?? []).map(row => ({
          ...row,
          profile: Array.isArray(row.profile) ? row.profile[0] : row.profile
        }));
      
        const sorted = normalized.sort((a, b) => {
          if (a.user_id === currentUserId) return -1;
          if (b.user_id === currentUserId) return 1;
          return 0;
        });

        setMembers(sorted);
      }
    })();

    return () => { cancelled = true; };
  }, [groupId]);

  const renderItem = ({ item }) => {
    console.log(item);

    if (item.user_id === '12345678-1234-1234-1234-123456789abc') {
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
          <Text style={styles.name}>{item.profile.full_name}</Text>
          <Text style={styles.subText}>
            {item.profile.year ? `${item.profile.year} at UC Berkeley` : "UC Berkeley"}
          </Text>
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
        data={members}
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

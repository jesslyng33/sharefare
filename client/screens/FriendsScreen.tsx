import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

interface Friend {
  id: string;
  name: string;
  instagram: string;
}

const FriendItem: React.FC<{ friend: Friend }> = ({ friend }) => {
  return (
    <TouchableOpacity style={styles.friendItem}>
      <View style={styles.friendInfo}>
        <Text style={styles.friendName}>{friend.name}</Text>
        <Ionicons name="logo-instagram" size={20} color="#E4405F" />
      </View>
      <Ionicons name="chevron-forward" size={20} color="#a88" />
    </TouchableOpacity>
  );
};

export default function FriendsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  
  // Mock data for now
  const friends: Friend[] = [
    {
      id: '1',
      name: 'Jesslyn Gunadi',
      instagram: '@jesslyn.g'
    }
  ];

  const handleInboxPress = () => {
    navigation.navigate('FriendRequests');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
        </View>
        <TouchableOpacity onPress={handleInboxPress} style={styles.inboxButton}>
          <Ionicons name="mail" size={24} color="#8C4E4E" />
        </TouchableOpacity>
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>friends</Text>
        
        <ScrollView style={styles.friendsList} showsVerticalScrollIndicator={false}>
          {friends.map((friend) => (
            <FriendItem key={friend.id} friend={friend} />
          ))}
          
          {friends.length === 0 && (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>No friends yet</Text>
              <Text style={styles.emptySubtext}>Add friends to see them here</Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: 16,
    color: '#999',
    fontWeight: '500',
  },
  inboxButton: {
    padding: 8,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8C4E4E',
    marginBottom: 20,
    textTransform: 'lowercase',
  },
  friendsList: {
    flex: 1,
  },
  friendItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8e8e8',
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 0,
    elevation: 0,
    shadowOpacity: 0,
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendName: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});

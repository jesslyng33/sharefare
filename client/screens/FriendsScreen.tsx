import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../supabase.js';

interface Friend {
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Assuming the current user ID - you may need to get this from auth context
      const currentUserId = '12345678-1234-1234-1234-123456789abc';
      
      // First, get the friend_ids for the current user
      const { data: friendIds, error: friendError } = await supabase
        .from('friends')
        .select('friend_id')
        .eq('user_id', currentUserId);

      if (friendError) {
        console.error('Error fetching friend IDs:', friendError);
        setError('Failed to load friends');
        return;
      }

      if (!friendIds || friendIds.length === 0) {
        setFriends([]);
        return;
      }

      // Extract the friend_id values
      const friendIdArray = friendIds.map(friend => friend.friend_id);

      // Then, get the profile information for those friend_ids
      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('full_name, instagram')
        .in('id', friendIdArray);

      if (profileError) {
        console.error('Error fetching friend profiles:', profileError);
        setError('Failed to load friend profiles');
      } else {
        // Transform the data to match our Friend interface
        const friendsData = (profiles || []).map(profile => ({
          name: profile.full_name,
          instagram: profile.instagram || ''
        }));
        setFriends(friendsData);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleInboxPress = () => {
    navigation.navigate('FriendRequests');
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
          </View>
          <TouchableOpacity onPress={handleInboxPress} style={styles.inboxButton}>
            <Ionicons name="mail" size={24} color="#8C4E4E" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>friends</Text>
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Loading friends...</Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
          </View>
          <TouchableOpacity onPress={handleInboxPress} style={styles.inboxButton}>
            <Ionicons name="mail" size={24} color="#8C4E4E" />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>friends</Text>
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity style={styles.retryButton} onPress={fetchFriends}>
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

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
          {friends.map((friend, index) => (
            <FriendItem key={`${friend.name}-${index}`} friend={friend} />
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#8C4E4E',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: 'white',
    fontWeight: '600',
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

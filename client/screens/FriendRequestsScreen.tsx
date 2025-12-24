import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../supabase';
import { useAuth } from '../authentication/AuthContext';

interface FriendRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  status: string;
  created_at: string;
  sender_name: string;
  sender_instagram: string;
  mutualFriends?: number;
}

const FriendRequestItem: React.FC<{ 
  request: {
    id: string;
    name: string;
    instagram: string;
    mutualFriends?: number;
    timestamp: string;
  }; 
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}> = ({ request, onAccept, onDecline }) => {
  return (
    <View style={styles.requestItem}>
      <View style={styles.requestInfo}>
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{request.name}</Text>
          <View style={styles.instagramRow}>
            <Ionicons name="logo-instagram" size={16} color="#E4405F" />
            <Text style={styles.instagramHandle}>{request.instagram}</Text>
          </View>
          {request.mutualFriends && (
            <Text style={styles.mutualFriends}>
              {request.mutualFriends} mutual friend{request.mutualFriends !== 1 ? 's' : ''}
            </Text>
          )}
        </View>
        <Text style={styles.timestamp}>{request.timestamp}</Text>
      </View>
      
      <View style={styles.actionButtons}>
        <TouchableOpacity 
          style={styles.acceptButton} 
          onPress={() => onAccept(request.id)}
        >
          <Text style={styles.acceptButtonText}>Accept</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.declineButton} 
          onPress={() => onDecline(request.id)}
        >
          <Text style={styles.declineButtonText}>Decline</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default function FriendRequestsScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { user } = useAuth();
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const [loading, setLoading] = useState(true);

  console.log('FriendRequestsScreen - Current user:', user);

  useEffect(() => {
    console.log('useEffect triggered with user ID:', user?.id);
    if (user?.id) {
      fetchFriendRequests();
    } else {
      console.log('No user ID available');
    }
  }, [user?.id]);

  const fetchFriendRequests = async () => {
    try {
      setLoading(true);
      
      console.log('Searching for receiver_id:', user.id);
      console.log('User object:', user);
      
      // Fetch friend requests where current user is the receiver and status is 'pending'
      const { data: requests, error } = await supabase
        .from('friend_requests')
        .select(`
          id,
          sender_id,
          receiver_id,
          status,
          created_at
        `)
        .eq('receiver_id', user.id)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
        
              console.log('Found requests:', requests);
        if (requests && requests.length > 0) {
          console.log('Receiver ID from database:', requests[0].receiver_id);
        }

      if (!requests || requests.length === 0) {
        console.log('No pending friend requests found');
        
        // Let's also check if there are any friend requests at all for this user
        const { data: allRequests, error: allRequestsError } = await supabase
          .from('friend_requests')
          .select('*')
          .eq('receiver_id', user.id);
        
        console.log('All friend requests for this user:', { allRequests, allRequestsError });
        if (allRequests && allRequests.length > 0) {
          console.log('All receiver IDs:', allRequests.map(r => r.receiver_id));
          console.log('All sender IDs:', allRequests.map(r => r.sender_id));
          console.log('All statuses:', allRequests.map(r => r.status));
        }
        
        setFriendRequests([]);
        return;
      }


      // Get sender details for each request
      const requestsWithSenderDetails = await Promise.all(
        requests.map(async (request) => {
          console.log('Fetching profile for sender_id:', request.sender_id);
          
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('full_name, instagram')
            .eq('id', request.sender_id)
            .single();

          console.log('Profile query result for', request.sender_id, ':', { profile, profileError });

          if (profileError) {
            console.error('Error fetching sender profile:', profileError);
            return {
              ...request,
              sender_name: 'Unknown User',
              sender_instagram: '@unknown'
            };
          }

          return {
            ...request,
            sender_name: profile.full_name || 'Unknown User',
            sender_instagram: profile.instagram || '@unknown'
          };
        })
      );

      console.log('Final requests with sender details:', requestsWithSenderDetails);
      setFriendRequests(requestsWithSenderDetails);
    } catch (error) {
      console.error('Error in fetchFriendRequests:', error);
      Alert.alert('Error', 'Failed to load friend requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (id: string) => {
    try {
      // Find the friend request to get sender_id and receiver_id
      const request = friendRequests.find(req => req.id === id);
      if (!request) {
        console.error('Friend request not found');
        Alert.alert('Error', 'Friend request not found');
        return;
      }

      // Update the friend request status to 'accepted'
      const { error: updateError } = await supabase
        .from('friend_requests')
        .update({ status: 'accepted' })
        .eq('id', id);

      if (updateError) {
        console.error('Error accepting friend request:', updateError);
        Alert.alert('Error', 'Failed to accept friend request');
        return;
      }

      // Check if friendship already exists before inserting
      const { data: existingFriendship, error: checkError } = await supabase
        .from('friends')
        .select('*')
        .eq('user_id', request.receiver_id)
        .eq('friend_id', request.sender_id)
        .single();

      if (checkError && checkError.code !== 'PGRST116') { // PGRST116 is "not found" error
        console.error('Error checking existing friendship:', checkError);
      }

      // Only insert if friendship doesn't already exist
      if (!existingFriendship) {
        const { error: insertError } = await supabase
          .from('friends')
          .insert({
            user_id: request.receiver_id,
            friend_id: request.sender_id
          });

        if (insertError) {
          console.error('Error adding to friends table:', insertError);
          Alert.alert('Error', 'Friend request accepted but failed to add to friends list');
          return;
        }
      } else {
        console.log('Friendship already exists, skipping insert');
      }

      // Remove the accepted request from the list
      setFriendRequests(prev => prev.filter(request => request.id !== id));
      Alert.alert('Success', 'Friend request accepted!');
    } catch (error) {
      console.error('Error in handleAccept:', error);
      Alert.alert('Error', 'Failed to accept friend request');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      // Update the friend request status to 'declined'
      const { error } = await supabase
        .from('friend_requests')
        .update({ status: 'declined' })
        .eq('id', id);

      if (error) {
        console.error('Error declining friend request:', error);
        Alert.alert('Error', 'Failed to decline friend request');
        return;
      }

      // Remove the declined request from the list
      setFriendRequests(prev => prev.filter(request => request.id !== id));
      Alert.alert('Success', 'Friend request declined');
    } catch (error) {
      console.error('Error in handleDecline:', error);
      Alert.alert('Error', 'Failed to decline friend request');
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours} hour${diffInHours !== 1 ? 's' : ''} ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} day${diffInDays !== 1 ? 's' : ''} ago`;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Friend Requests</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Main Content */}
      <View style={styles.contentContainer}>
        <ScrollView style={styles.requestsList} showsVerticalScrollIndicator={false}>
          {loading ? (
            <View style={styles.emptyState}>
              <Ionicons name="refresh" size={48} color="#ccc" />
              <Text style={styles.emptyText}>Loading...</Text>
            </View>
          ) : friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <FriendRequestItem 
                key={request.id} 
                request={{
                  id: request.id,
                  name: request.sender_name,
                  instagram: request.sender_instagram,
                  mutualFriends: request.mutualFriends,
                  timestamp: formatTimestamp(request.created_at)
                }}
                onAccept={handleAccept}
                onDecline={handleDecline}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="mail-outline" size={48} color="#ccc" />
              <Text style={styles.emptyText}>No friend requests</Text>
              <Text style={styles.emptySubtext}>When people send you friend requests, they'll appear here</Text>
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
    backgroundColor: '#f8e8e8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#f8e8e8',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    color: '#333',
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  contentContainer: {
    flex: 1,
    backgroundColor: '#f8e8e8',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  requestsList: {
    flex: 1,
  },
  requestItem: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  requestInfo: {
    marginBottom: 15,
  },
  userInfo: {
    marginBottom: 8,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  instagramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  instagramHandle: {
    fontSize: 14,
    color: '#666',
  },
  mutualFriends: {
    fontSize: 12,
    color: '#8C4E4E',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
    textAlign: 'right',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#8C4E4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  acceptButtonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  declineButton: {
    flex: 1,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#8C4E4E',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  declineButtonText: {
    color: '#8C4E4E',
    fontWeight: '600',
    fontSize: 14,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    fontWeight: '500',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
}); 
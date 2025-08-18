import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';

interface FriendRequest {
  id: string;
  name: string;
  instagram: string;
  mutualFriends?: number;
  timestamp: string;
}

const FriendRequestItem: React.FC<{ 
  request: FriendRequest; 
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
  
  // Mock data for now
  const friendRequests: FriendRequest[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      instagram: '@sarah.j',
      mutualFriends: 3,
      timestamp: '2 hours ago'
    },
    {
      id: '2',
      name: 'Mike Chen',
      instagram: '@mike.chen',
      mutualFriends: 1,
      timestamp: '1 day ago'
    }
  ];

  const handleAccept = (id: string) => {
    // TODO: Implement accept logic
    console.log('Accept friend request:', id);
  };

  const handleDecline = (id: string) => {
    // TODO: Implement decline logic
    console.log('Decline friend request:', id);
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
          {friendRequests.length > 0 ? (
            friendRequests.map((request) => (
              <FriendRequestItem 
                key={request.id} 
                request={request}
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
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface FriendPopupProps {
  visible: boolean;
  friend: {
    name: string;
    instagram: string;
  } | null;
  onClose: () => void;
}

const FriendPopup: React.FC<FriendPopupProps> = ({ visible, friend, onClose }) => {
  console.log('FriendPopup render:', { visible, friend });
  if (!friend) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.popup}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          {/* Friend info */}
          <View style={styles.content}>
            <Text style={styles.name}>{friend.name}</Text>
            <View style={styles.instagramContainer}>
              <Ionicons name="logo-instagram" size={20} color="#E4405F" />
              <Text style={styles.instagram}>{friend.instagram}</Text>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    margin: 20,
    minWidth: 280,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    left: 12,
    zIndex: 1,
    padding: 4,
  },
  content: {
    alignItems: 'center',
    paddingTop: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },
  instagramContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  instagram: {
    fontSize: 16,
    color: '#666',
    fontWeight: '500',
  },
});

export default FriendPopup;

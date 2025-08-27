import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import { supabase } from '../supabase.js';
import { useAuth } from '../authentication/AuthContext';

// Define the screens and route names
const screens = [
  { label: 'Account Management', route: 'Account' },
  { label: 'Profile Visibility', route: 'Profile' },
  { label: 'Notifications', route: 'Notifications' },
  { label: 'Past Rides', route: 'PastRides' },
  { label: 'Privacy and Data', route: 'Privacy' },
  { label: 'Reports and Violations Center', route: 'Reports' },
];

export default function YouScreen() {
  const navigation = useNavigation<StackNavigationProp<any>>();
  const { signOut, user } = useAuth();
  const [userData, setUserData] = useState<{
    full_name?: string;
    profile_picture_uri?: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const getImageSource = () => {
    if (!userData?.profile_picture_uri) {
      return require('../assets/jess.png');
    }
    
    const uri = userData.profile_picture_uri;
    
    // Check if it's a Supabase Storage URL (permanent)
    if (uri.startsWith('https://') && uri.includes('supabase.co')) {
      console.log('Using Supabase Storage URL:', uri);
      return { uri };
    }
    
    // Check if it's a local file URI (temporary - should be avoided)
    if (uri.startsWith('file://') || uri.startsWith('content://')) {
      console.log('Warning: Using local file URI (temporary):', uri);
      return { uri };
    }
    
    // If it's not a valid URI, use fallback
    console.log('Invalid image URI:', uri);
    return require('../assets/jess.png');
  };

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user?.id]);

  const fetchUserData = async () => {
    try {
      if (!user?.id) {
        console.log('No authenticated user found');
        return;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, profile_picture_uri')
        .eq('id', user.id)
        .single();

      if (error) {
        console.log('Error fetching user data:', error);
      } else {
        console.log('Fetched user data:', data);
        
        // Check if we need to migrate a local URI to Supabase Storage
        if (data?.profile_picture_uri && 
            (data.profile_picture_uri.startsWith('file://') || data.profile_picture_uri.startsWith('content://'))) {
          console.log('Found local URI, attempting to migrate to Supabase Storage...');
          await migrateLocalUriToStorage(data.profile_picture_uri, user.id);
        } else {
          setUserData(data);
        }
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const migrateLocalUriToStorage = async (localUri: string, userId: string) => {
    try {
      // Import FileSystem for reading local files
      const FileSystem = require('expo-file-system');
      
      // Read the local file as base64
      const base64 = await FileSystem.readAsStringAsync(localUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Get file extension
      const fileExtension = localUri.split('.').pop() || 'jpg';
      const fileName = `profile-picture-${Date.now()}.${fileExtension}`;
      
      // Helper function to decode base64
      const decode = (base64: string) => {
        const binaryString = atob(base64);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        return bytes;
      };
      
      // Upload to Supabase Storage
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, decode(base64), {
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.log('Migration upload error:', error);
        // If migration fails, still use the local URI
        setUserData({ full_name: userData?.full_name, profile_picture_uri: localUri });
        return;
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      console.log('Successfully migrated to Supabase Storage:', urlData.publicUrl);
      
      // Update the database with the new permanent URL
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ profile_picture_uri: urlData.publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.log('Error updating database with new URL:', updateError);
      }
      
      // Update local state
      setUserData({ 
        full_name: userData?.full_name, 
        profile_picture_uri: urlData.publicUrl 
      });
      
    } catch (error) {
      console.log('Migration error:', error);
      // If migration fails, still use the local URI
      setUserData({ full_name: userData?.full_name, profile_picture_uri: localUri });
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileContainer}>
          <Image
            source={getImageSource()}
            style={styles.avatar}
            onError={(error) => console.log('Image loading error:', error.nativeEvent)}
            onLoad={() => console.log('Image loaded successfully')}
          />
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileName}>
              {userData?.full_name || 'Loading...'}
            </Text>
            <Text style={styles.viewProfile}>View profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings List */}
        <View style={styles.settingsBox}>
          {screens.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.settingItem}
              onPress={() => navigation.navigate(item.route)}
            >
              <Text style={styles.settingText}>{item.label}</Text>
              <View style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out */}
        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={async () => {
            Alert.alert(
              'Sign Out',
              'Are you sure you want to sign out?',
              [
                { text: 'Cancel', style: 'cancel' },
                {
                  text: 'Sign Out',
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await signOut();
                    } catch (error) {
                      console.error('Sign out error:', error);
                      Alert.alert('Error', 'Failed to sign out');
                    }
                  },
                },
              ]
            );
          }}
        >
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}



const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#db9090',
    padding: 10,
    borderRadius: 20,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewProfile: {
    fontSize: 14,
    color: 'gray',
  },
  settingsBox: {
    borderWidth: 1,
    borderColor: '#db9090',
    borderRadius: 15,
    paddingVertical: 10,
  },
  settingItem: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#a88',
    transform: [{ rotate: '-45deg' }],
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
  },
});

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Image } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.js';
import PinkButton from '../../components/PinkButton';
import { supabase } from '../../supabase.js';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { useAuth } from '../../authentication/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'ProfilePicture'>;

const ProfilePictureScreen: React.FC<Props> = ({ navigation }) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const { user } = useAuth();

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant camera roll permissions to select a profile picture.');
      return false;
    }
    return true;
  };

  const selectImage = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets[0]) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image');
    }
  };

  const uploadImageToSupabase = async (uri: string) => {
    try {
      console.log('Starting upload process...');
      
      // Convert image to base64
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log('Image converted to base64');

      // Get file extension
      const fileExtension = uri.split('.').pop() || 'jpg';
      const fileName = `profile-picture-${Date.now()}.${fileExtension}`;
      console.log('File name:', fileName);

      // Upload to Supabase Storage
      console.log('Attempting to upload to Supabase Storage...');
      const { data, error } = await supabase.storage
        .from('profile-pictures')
        .upload(fileName, decode(base64), {
          contentType: `image/${fileExtension}`,
        });

      if (error) {
        console.log('Supabase upload error:', error);
        throw error;
      }

      console.log('Upload successful, getting public URL...');
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(fileName);

      console.log('Public URL:', urlData.publicUrl);
      return urlData.publicUrl;
    } catch (error) {
      console.log('Upload error details:', error);
      throw error;
    }
  };

  // Helper function to decode base64
  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
  };

  const handleSkip = async () => {
    setLoading(true);
    
    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture_skipped: true })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Database error', error.message);
      } else {
        navigation.navigate('Preferences');
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }

    setLoading(false);
  };

  const handleNext = async () => {
    if (!imageUri) {
      Alert.alert('Error', 'Please select a profile picture');
      return;
    }

    setLoading(true);

    try {
      if (!user?.id) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }
      
      // Try to upload to Supabase Storage first
      let imageUrl;
      try {
        imageUrl = await uploadImageToSupabase(imageUri);
        console.log('Uploaded to Supabase Storage:', imageUrl);
      } catch (uploadError) {
        console.log('Storage upload failed, saving local URI:', uploadError);
        // Fallback: save local URI for testing
        imageUrl = imageUri;
      }
      
      // Save profile picture URL to database
      const { error } = await supabase
        .from('profiles')
        .update({ profile_picture_uri: imageUrl })
        .eq('id', user.id);

      if (error) {
        Alert.alert('Database error', error.message);
      } else {
        navigation.navigate('Preferences');
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>profile picture</Text>
        
        <TouchableOpacity style={styles.imageContainer} onPress={selectImage}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.profileImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Text style={styles.placeholderText}>tap to add photo</Text>
            </View>
          )}
        </TouchableOpacity>

        <View style={styles.buttonContainer}>
          <PinkButton 
            title={loading ? 'Saving...' : 'next'} 
            onPress={handleNext} 
            disabled={loading || !imageUri} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    marginTop: -50,
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
  },
  label: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 30,
    color: '#8C4E4E',
    textTransform: 'lowercase',
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: '#D58484',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFEBEB',
  },
  profileImage: {
    width: 116,
    height: 116,
    borderRadius: 58,
  },
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#D58484',
    fontSize: 12,
    textAlign: 'center',
    textTransform: 'lowercase',
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginRight: -250,
    marginBottom: 10,
    marginTop: 30,
  },
  skipText: {
    color: '#D58484',
    fontSize: 14,
    textTransform: 'lowercase',
    textDecorationLine: 'underline',
  },
});

export default ProfilePictureScreen; 
import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert } from 'react-native';
import { supabase } from '../supabase.js';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types/navigation';
import PinkButton from './PinkButton';

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

interface OnboardingInputProps {
  navigation: NavigationProp;
  label: string;
  placeholder: string;
  fieldName: string;
  nextScreen: keyof RootStackParamList;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  autoCorrect?: boolean;
  isOptional?: boolean;
  isLastScreen?: boolean;
  onComplete?: () => void;
}

const OnboardingInput: React.FC<OnboardingInputProps> = ({
  navigation,
  label,
  placeholder,
  fieldName,
  nextScreen,
  autoCapitalize = 'words',
  autoCorrect = true,
  isOptional = false,
  isLastScreen = false,
  onComplete,
}) => {
  const [value, setValue] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const handleNext = async () => {
    if (!isOptional && !value.trim()) {
      Alert.alert('Error', 'This field is required');
      return;
    }

    setLoading(true);

    try {
      const mockUserId = '12345678-1234-1234-1234-123456789abc';

      const { error } = await supabase
        .from('profiles')
        .update({ [fieldName]: value.trim() })
        .eq('id', mockUserId);

      if (error) {
        Alert.alert('Database error', error.message);
      } else {
        if (isLastScreen && onComplete) {
          onComplete();
        } else {
          navigation.navigate(nextScreen);
        }
      }
    } catch (error) {
      console.log('Error:', error);
      Alert.alert('Error', 'An unexpected error occurred');
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>
          {label}
          {isOptional && <Text style={styles.optional}> (optional)</Text>}
        </Text>
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
        />
        <View style={styles.buttonContainer}>
          <PinkButton 
            title={loading ? 'Saving...' : 'next'} 
            onPress={handleNext} 
            disabled={loading || (!isOptional && !value.trim())} 
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
  },
  label: { 
    fontWeight: 'bold', 
    fontSize: 18, 
    marginBottom: 20,
    color: '#8C4E4E',
    textTransform: 'lowercase',
  },
  optional: {
    fontWeight: 'normal',
    color: '#666',
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    marginBottom: 15,
    fontSize: 16,
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginRight: 25,
  },
});

export default OnboardingInput; 
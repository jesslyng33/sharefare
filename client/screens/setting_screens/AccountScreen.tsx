import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Switch, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../../supabase.js';
import PinkButton from '../../components/PinkButton';
import CustomAlert from '../../components/CustomAlert';
import { useAuth } from '../../authentication/AuthContext';

interface UserData {
  full_name?: string;
  instagram?: string;
  preferences?: {
    same_school: boolean;
    within_2_years: boolean;
    same_gender: boolean;
    friends_only: boolean;
  };
}

export default function AccountScreen() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { signOut, user } = useAuth();
  
  // Form state
  const [instagram, setInstagram] = useState('');
  const [preferences, setPreferences] = useState({
    same_school: false,
    within_2_years: false,
    same_gender: false,
    friends_only: false,
  });

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
        .select('full_name, instagram, preferences')
        .eq('id', user.id)
        .single();

      if (error) {
        console.log('Error fetching user data:', error);
        setAlertTitle('Error');
        setAlertMessage('Failed to load account data');
        setAlertVisible(true);
      } else {
        setUserData(data);
        setInstagram(data.instagram || '');
        setPreferences(data.preferences || {
          same_school: false,
          within_2_years: false,
          same_gender: false,
          friends_only: false,
        });
      }
    } catch (error) {
      console.log('Error:', error);
      setAlertTitle('Error');
      setAlertMessage('An unexpected error occurred');
      setAlertVisible(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    try {
      if (!user?.id) {
        setAlertTitle('Error');
        setAlertMessage('User not authenticated');
        setAlertVisible(true);
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({ 
          instagram: instagram.trim(),
          preferences 
        })
        .eq('id', user.id);

      if (error) {
        setAlertTitle('Database error');
        setAlertMessage(error.message);
        setAlertVisible(true);
      } else {
        setAlertTitle('Success');
        setAlertMessage('settings changed successfully!');
        setAlertVisible(true);
        // Update local state
        setUserData(prev => ({
          ...prev,
          instagram: instagram.trim(),
          preferences
        }));
      }
    } catch (error) {
      console.log('Error:', error);
      setAlertTitle('Error');
      setAlertMessage('An unexpected error occurred');
      setAlertVisible(true);
    }

    setSaving(false);
  };

  const updatePreference = (key: keyof typeof preferences, value: boolean) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSignOut = async () => {
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
              console.error('Error signing out:', error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Account Management</Text>
        
        {/* Instagram Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Instagram Handle</Text>
          <TextInput
            style={styles.input}
            value={instagram}
            onChangeText={setInstagram}
            placeholder="@yourhandle"
            autoCapitalize="none"
            autoCorrect={false}
          />
        </View>

        {/* Preferences Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ride Preferences</Text>
          <Text style={styles.sectionSubtitle}>I only want to ride with...</Text>
          
          <LabelledSwitch 
            label="Same School" 
            value={preferences.same_school} 
            setValue={(value) => updatePreference('same_school', value)} 
          />
          <LabelledSwitch 
            label="Within 2 Years" 
            value={preferences.within_2_years} 
            setValue={(value) => updatePreference('within_2_years', value)} 
          />
          <LabelledSwitch 
            label="Same Gender" 
            value={preferences.same_gender} 
            setValue={(value) => updatePreference('same_gender', value)} 
          />
          <LabelledSwitch 
            label="Friends Only" 
            value={preferences.friends_only} 
            setValue={(value) => updatePreference('friends_only', value)} 
          />
        </View>

        {/* Save Button */}
        <View style={styles.buttonContainer}>
          <PinkButton 
            title={saving ? 'Saving...' : 'Save Changes'} 
            onPress={handleSave} 
            disabled={saving} 
          />
        </View>

        {/* Sign Out Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.signOutButton}
            onPress={handleSignOut}
          >
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </SafeAreaView>
  );
}

const LabelledSwitch = ({
  label,
  value,
  setValue,
}: {
  label: string;
  value: boolean;
  setValue: (val: boolean) => void;
}) => (
  <View style={styles.switchRow}>
    <Text style={styles.switchLabel}>{label}</Text>
    <Switch value={value} onValueChange={setValue} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#8C4E4E',
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  sectionSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#8C4E4E',
    textTransform: 'lowercase',
  },
  input: {
    borderWidth: 1,
    borderColor: '#db9090',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 5,
  },
  switchLabel: {
    fontSize: 16,
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  signOutButton: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 10,
  },
  signOutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

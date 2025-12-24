import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { supabase } from '../../supabase.js';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.js';
import PinkButton from '../../components/PinkButton';
import CustomAlert from '../../components/CustomAlert';
import { useAuth } from '../../authentication/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Preferences'>;

const PreferencesScreen: React.FC<Props> = ({ navigation }) => {
  const [sameSchool, setSameSchool] = useState(false);
  const [within2Years, setWithin2Years] = useState(false);
  const [sameGender, setSameGender] = useState(false);
  const [friendsOnly, setFriendsOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alertVisible, setAlertVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const { user, checkOnboardingStatus } = useAuth();

  const handleSubmit = async () => {
    setLoading(true);

    try {
      if (!user?.id) {
        setAlertTitle('Error');
        setAlertMessage('User not authenticated');
        setAlertVisible(true);
        return;
      }

      const preferences = {
        same_school: sameSchool,
        within_2_years: within2Years,
        same_gender: sameGender,
        friends_only: friendsOnly,
      };

      const { error } = await supabase
        .from('profiles')
        .update({ preferences })
        .eq('id', user.id);

      if (error) {
        setAlertTitle('Database error');
        setAlertMessage(error.message);
        setAlertVisible(true);
      } else {
        setAlertTitle('Success');
        setAlertMessage('Preferences saved!');
        setAlertVisible(true);
        
        // Update onboarding status
        await checkOnboardingStatus();
        
        // Navigate to main app
        navigation.reset({
          index: 0,
          routes: [{ name: 'MainTabs' as any }],
        });
      }
    } catch (error) {
      console.log('Error:', error);
      setAlertTitle('Error');
      setAlertMessage('An unexpected error occurred');
      setAlertVisible(true);
    }

    setLoading(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.contentContainer}>
        <Text style={styles.label}>i only want to ride with... </Text>

        <LabelledSwitch label="Same School" value={sameSchool} setValue={setSameSchool} />
        <LabelledSwitch label="Within 2 Years" value={within2Years} setValue={setWithin2Years} />
        <LabelledSwitch label="Same Gender" value={sameGender} setValue={setSameGender} />
        <LabelledSwitch label="Friends Only" value={friendsOnly} setValue={setFriendsOnly} />

        <View style={styles.buttonContainer}>
          <PinkButton 
            title={loading ? 'Saving...' : 'finish'} 
            onPress={handleSubmit} 
            disabled={loading} 
          />
        </View>
      </View>
      
      <CustomAlert
        visible={alertVisible}
        title={alertTitle}
        message={alertMessage}
        onClose={() => setAlertVisible(false)}
      />
    </View>
  );
};

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
    <Text>{label}</Text>
    <Switch value={value} onValueChange={setValue} />
  </View>
);

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
    fontSize: 25, 
    marginBottom: 30,
    color: '#8C4E4E',
    textTransform: 'lowercase',
  },
  switchRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    alignItems: 'flex-end',
    marginRight: 25,
    marginTop: 20,
  },
});

export default PreferencesScreen;

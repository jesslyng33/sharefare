import React from 'react';
import { SafeAreaView } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';
import OnboardingInput from '../../components/OnboardingInput';

type Props = NativeStackScreenProps<RootStackParamList, 'FullName'>;

const FullNameScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <OnboardingInput
        navigation={navigation}
        label="full name"
        placeholder="Enter your full name"
        fieldName="full_name"
        nextScreen="Year"
        autoCapitalize="words"
      />
    </SafeAreaView>
  );
};

export default FullNameScreen;
  
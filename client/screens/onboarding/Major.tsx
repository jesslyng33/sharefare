import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.js';
import OnboardingInput from '../../components/OnboardingInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Major'>;

const MajorScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <OnboardingInput
      navigation={navigation}
      label="major"
      placeholder="Enter your major"
      fieldName="major"
      nextScreen="Instagram"
      autoCapitalize="words"
    />
  );
};

export default MajorScreen;

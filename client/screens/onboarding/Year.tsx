import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.js';
import OnboardingInput from '../../components/OnboardingInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Year'>;

const YearScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <OnboardingInput
      navigation={navigation}
      label="year"
      placeholder="Enter your year (e.g., Sophomore)"
      fieldName="year"
      nextScreen="Major"
      autoCapitalize="words"
    />
  );
};

export default YearScreen;

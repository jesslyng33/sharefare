import React from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation.js';
import OnboardingInput from '../../components/OnboardingInput';

type Props = NativeStackScreenProps<RootStackParamList, 'Instagram'>;

const InstagramScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <OnboardingInput
      navigation={navigation}
      label="Instagram"
      placeholder="@yourhandle"
      fieldName="instagram"
      nextScreen="ProfilePicture"
      autoCapitalize="none"
      autoCorrect={false}
      isOptional={true}
    />
  );
};

export default InstagramScreen;

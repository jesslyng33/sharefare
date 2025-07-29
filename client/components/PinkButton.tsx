import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface PinkButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

const PinkButton: React.FC<PinkButtonProps> = ({ title, onPress, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFEBEB',
    borderWidth: 1,
    borderColor: '#D58484',
    borderRadius: 0,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  disabled: {
    opacity: 0.5,
  },
  text: {
    color: '#D58484',
    fontSize: 16,
    fontWeight: '500',
    textTransform: 'lowercase',
  },
  disabledText: {
    color: '#999',
  },
});

export default PinkButton; 
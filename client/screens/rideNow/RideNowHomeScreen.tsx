import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Platform, ViewStyle, StyleProp, SafeAreaView } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { StackNavigationProp } from '@react-navigation/stack';
import { RideNowStackParamList } from '../../navigation/RideNowStackNavigator';
import { supabase } from '../../supabase.js';
import { v4 as uuid } from 'uuid';

type Nav = StackNavigationProp<RideNowStackParamList, 'Home'>;

export default function RideNowHomeScreen() {
    const navigation = useNavigation<Nav>();
    
    // const [phoneNumber, setPhoneNumber] = useState('');

    // const handleLogin = async (phoneNumber) => {
    //     try {
    //         await sendOTP(phoneNumber);
    //     } catch (error) {
    //         console.error('Error sending OTP:', error);
    //     }
    // };

    const [selectedStartingPoint, setSelectedStartingPoint] = useState<string | null>(null);
    const [showStartingPointDropdown, setShowStartingPointDropdown] = useState(false);
    const [selectedDestination, setSelectedDestination] = useState<string | null>(null);

    const startingPointOptions = [
      "SFO-Terminal 1",
      "SFO-Terminal 2", 
      "SFO-Terminal 3",
      "SFO-Terminal 4"
    ];

    const handleStartingPointPress = () => {
      setShowStartingPointDropdown(!showStartingPointDropdown);
    };

    const handleOptionSelect = (option: string) => {
      setSelectedStartingPoint(option);
      setShowStartingPointDropdown(false);
    };

    type RideRequest = {
      startingPoint: string;
      destination: string;
    };

    const handleRideRequest = async () => {
      const { data, error } = await supabase.from('ride_now_requests').insert([
          {
            user_id: '12345678-1234-1234-1234-123456789abc', // rn using a uuid that already exists in the db
            starting_point: selectedStartingPoint,
            destination: selectedDestination,
          }
        ])

      if (error) {
        console.error('Error inserting ride request:', error)
      } else {
        console.log('Ride request inserted')
      }

      navigation.navigate('FindingRide');
    };

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.container}>
          <Text style={styles.title}>looking for a ride?</Text>
          
          <View style={styles.dropdownContainer}>
            <Pressable onPress={handleStartingPointPress} style={styles.dropdownInput}>
              <Text style={[
                styles.dropdownText,
                !selectedStartingPoint && styles.dropdownPlaceholder
              ]}>
                {selectedStartingPoint || "Choose starting point"}
              </Text>
            </Pressable>
            
            {showStartingPointDropdown && (
              <View style={styles.dropdownOptions}>
                {startingPointOptions.map((option) => (
                  <Pressable
                    key={option}
                    style={styles.dropdownOption}
                    onPress={() => handleOptionSelect(option)}
                  >
                    <Text style={styles.dropdownOptionText}>{option}</Text>
                  </Pressable>
                ))}
              </View>
            )}
          </View>

          <TextInput
            value={selectedDestination}
            onChangeText={setSelectedDestination}
            placeholder="Choose destination"
            placeholderTextColor="#DB9C9C80"
            style={styles.textInput}
          />

          <Pressable
            onPress={handleRideRequest}
            style={({ pressed }) => [
                styles.button,
                { transform: [{ scale: pressed ? 0.96 : 1 }, { translateY: pressed ? 2 : 0 }] }
            ] as StyleProp<ViewStyle>}
          >
            <Text style={styles.buttonText}>Find a ride now</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10,
    },

    title: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 40,
        color: '#8C4E4E',
    },

    dropdownContainer: {
        width: '60%',
        marginTop: 40,
        position: 'relative',
        zIndex: 1000,
    },

    dropdownInput: {
        width: '100%',
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#DB9C9C',
        borderWidth: 1,
        borderColor: '#D58484',
        padding: 10,
        textAlign: 'left',
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#FFEBEB',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
            },
        }),
    },

    dropdownText: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#DB9C9C',
    },

    dropdownPlaceholder: {
        color: '#DB9C9C80',
    },

    dropdownOptions: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#D58484',
        borderTopWidth: 0,
        zIndex: 1001,
        ...Platform.select({
            ios: {
                shadowColor: '#FFEBEB',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
            },
        }),
    },

    dropdownOption: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F7E6E6',
    },

    dropdownOptionText: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#DB9C9C',
    },

    textInput: {
        width: '60%',
        marginTop: 40,
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 18,
        color: '#DB9C9C',
        borderWidth: 1,
        borderColor: '#D58484',
        padding: 10,
        textAlign: 'left',
        backgroundColor: '#FFFFFF',
        ...Platform.select({
            ios: {
                shadowColor: '#FFEBEB',
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
            },
        }),
    },

    button: {
        marginTop: 20,
        marginBottom: 100,
        width: '80%',
        backgroundColor: '#F7E6E6',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        ...Platform.select({
            ios: {
                shadowColor: '#000000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 2,
            },
        }),
    },

    buttonText: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#DB9C9C',
    },
});

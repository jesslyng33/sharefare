import React, { useState } from "react";
import { StyleSheet, View, Text, TextInput, Pressable, Platform } from "react-native";
import { sendOTP, verifyOTP } from '../authentication/auth';

export default function LoginScreen() {
    const [phoneNumber, setPhoneNumber] = useState('');

    const handleLogin = async () => {
        try {
            await sendOTP(phoneNumber);
        } catch (error) {
            console.error('Error sending OTP:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>welcome!</Text>
            <Text style={styles.subtitle}>please login to continue!</Text>
            <TextInput
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                placeholder="phone number"
                placeholderTextColor="#DB9C9C80"
                style={styles.textInput}
            />
            <Pressable onPress={handleLogin} style={styles.button}>
                <Text style={styles.buttonText}>sign up / sign in</Text>
            </Pressable>
        </View>
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

    subtitle: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#B79090',
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

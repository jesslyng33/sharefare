import * as React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

export default function HomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>welcome, aaron!</Text>
            <Button title="sign up / sign in"></Button>
            <Text style={styles.subtitle}>ride now or schedule a ride below!</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'center',
        alignItems: 'center',
    },

    title: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 32,
        color: '#8C4E4E',
    },

    subtitle: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 12,
        color: '#B79090',
    },
});
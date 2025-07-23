import * as React from "react";
import { StyleSheet, View, Text, Button } from "react-native";

export default function WelcomeScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>welcome!</Text>
            <Button title="answer a few questions to get started!"></Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },

    title: {
        fontFamily: 'SplineSans-Bold',
        fontWeight: 'bold',
        fontSize: 32,
        color: '#8C4E4E',
    },
});

import React, { useState } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";

export default function FindingRideScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <View style={styles.container}>
          <Text style={styles.title}>finding a ride for you...</Text>
        </View>
    </SafeAreaView>
  )
}

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
      padding: 25,
  },
});
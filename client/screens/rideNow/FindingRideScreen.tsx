import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, View, Text } from "react-native";
import { supabase } from '../../supabase.js';

export default function FindingRideScreen({ route }) {
  const { rideRequestId } = route.params;

  useEffect(() => {
    const channel = supabase
      .channel('ride-matching')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'ride_now_requests',
          filter: `id=eq.${rideRequestId}`,
        },
        (payload) => {
          console.log('Ride request updated!!!');
          // if (payload.new.matched) {
          //   navigation.replace('MatchedRide', {
          //     groupId: payload.new.group_id,
          //   });
          // }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [rideRequestId]);

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
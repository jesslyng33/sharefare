import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Profile Header */}
        <View style={styles.profileContainer}>
          <Image
            source={require('../assets/jess.png')}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.profileButton}>
            <Text style={styles.profileName}>Jesslyn Gunadi</Text>
            <Text style={styles.viewProfile}>View profile</Text>
          </TouchableOpacity>
        </View>

        {/* Settings List */}
        <View style={styles.settingsBox}>
          {[
            'Account Management',
            'Profile Visibility',
            'Notifications',
            'Past Rides',
            'Privacy and Data',
            'Reports and Violations Center',
          ].map((item, index) => (
            <TouchableOpacity key={index} style={styles.settingItem}>
              <Text style={styles.settingText}>{item}</Text>
              <View style={styles.chevron} />
            </TouchableOpacity>
          ))}
        </View>

        {/* Log Out */}
        <TouchableOpacity style={styles.logoutButton}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'white',
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  profileContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    marginRight: 15,
  },
  profileButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#db9090',
    padding: 10,
    borderRadius: 20,
  },
  profileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  viewProfile: {
    fontSize: 14,
    color: 'gray',
  },
  settingsBox: {
    borderWidth: 1,
    borderColor: '#db9090',
    borderRadius: 15,
    paddingVertical: 10,
  },
  settingItem: {
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomColor: '#eee',
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 15,
    fontWeight: '600',
  },
  chevron: {
    width: 10,
    height: 10,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderColor: '#a88',
    transform: [{ rotate: '-45deg' }], // right arrow
    marginLeft: 10,
  },
  logoutButton: {
    backgroundColor: '#f1f1f1',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  logoutText: {
    fontWeight: 'bold',
  },
});

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const StudentDashboard = () => {
  const navigation = useNavigation();

  const handleLogout = async () => {
    await AsyncStorage.removeItem('token'); // Clear stored token
    navigation.navigate('Login'); // Navigate back to login
  };

  return (
    <View style={styles.container}>
      <Button
        title="View Enrolled Classes"
        onPress={() => navigation.navigate('ClassScreen')}
      />
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
});

export default StudentDashboard;

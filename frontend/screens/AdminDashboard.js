import React from 'react';
import { View, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AdminDashboard = ({ navigation }) => {
  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('token');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  };

  const goToManageStudents = () => {
    navigation.navigate('ManageStudents');
  };

  const goToManageClasses = () => {
    navigation.navigate('ManageClasses');
  };

  return (
    <View style={styles.container}>
      <Button title="Manage Students" onPress={goToManageStudents} />
      <Button title="Manage Classes" onPress={goToManageClasses} />
      <Button title="Logout" onPress={handleLogout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 15, // Adds space between buttons
  },
});

export default AdminDashboard;

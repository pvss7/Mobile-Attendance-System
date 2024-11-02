import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';

const LoginScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async () => {
    console.log('Login pressed');
    try {
      const response = await axios.post(`${CONFIG.BASE_URL}/api/auth/login`, {
        id,
        password,
      });

      const { token, redirectTo, id: userId } = response.data;

      // Store token and user ID in AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('userId', userId);

      // Log the user ID for debugging
      console.log('User ID:', userId);

      // Navigate based on redirectTo value
      if (redirectTo === '/admin/dashboard') {
        navigation.navigate('AdminDashboard');
      } else {
        navigation.navigate('StudentDashboard');
      }
    } catch (error) {
      console.error('Login error:', error); // Log error for debugging
      setError('Login failed. Please check your credentials.');
    }
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // Navigate to register screen
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="ID"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <View style={styles.registerButtonContainer}>
        <Button title="Register" onPress={handleRegister} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginBottom: 12,
    textAlign: 'center',
  },
  registerButtonContainer: {
    marginTop: 20, // Add margin here to space out from the login button
  },
});

export default LoginScreen;

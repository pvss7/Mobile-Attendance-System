import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Text } from 'react-native';
import axios from 'axios';
import CONFIG from '../config';

const RegisterScreen = ({ navigation }) => {
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [section, setSection] = useState('');
  const [year, setYear] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      await axios.post(`${CONFIG.BASE_URL}/api/auth/register`, {
        id,
        name,
        section,
        year,
        password,
      });
      navigation.navigate('Login'); // Navigate to login screen after registration
    } catch (error) {
      setError('Registration failed.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
      <TextInput
        placeholder="ID"
        value={id}
        onChangeText={setId}
        style={styles.input}
      />
      <TextInput
        placeholder="Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
      <TextInput
        placeholder="Section"
        value={section}
        onChangeText={setSection}
        style={styles.input}
      />
      <TextInput
        placeholder="Year"
        value={year}
        onChangeText={setYear}
        keyboardType="numeric"
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
      <Button title="Register" onPress={handleRegister} />
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
});

export default RegisterScreen;

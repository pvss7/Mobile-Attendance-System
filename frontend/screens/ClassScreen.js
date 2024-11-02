import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';

const EnrolledClasses = () => {
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchEnrolledClasses = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');
      const studentId = await AsyncStorage.getItem('userId'); // Corrected to use 'userId'
      console.log('Token:', token);
      console.log('Student ID:', studentId);
      if (!token || !studentId) {
        setError('User authentication failed.');
        return;
      }

      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/students/${studentId}`,
        {
          headers: { Authorization: token },
        }
      );

      setEnrolledClasses(response.data.enrolledClasses);
    } catch (error) {
      setError('Failed to fetch enrolled classes.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnrolledClasses();
  }, []);

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Enrolled Classes</Text>
      {enrolledClasses.length > 0 ? (
        <FlatList
          data={enrolledClasses}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <View style={styles.classItem}>
              <Text style={styles.className}>{item.name}</Text>
            </View>
          )}
        />
      ) : (
        <Text>No enrolled classes available.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  classItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
  className: { fontSize: 16 },
  loader: { flex: 1, justifyContent: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { color: 'red', fontSize: 16 },
});

export default EnrolledClasses;

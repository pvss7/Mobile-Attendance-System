import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';

const StudentDetails = ({ route }) => {
  const { studentId } = route.params; // Use id as expected by the API
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);

  const fetchStudentDetails = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(
        `${CONFIG.BASE_URL}/api/students/${studentId}`, // Using id directly here
        {
          headers: { Authorization: `${token}` },
        }
      );
      setStudent(response.data);
    } catch (err) {
      setError('Failed to fetch student details');
      console.error('Failed to fetch student details:', err);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  if (!student) return <Text>Loading student details...</Text>;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Student Details</Text>
      <Text>Name: {student.name}</Text>
      <Text>Section: {student.section}</Text>
      <Text>Year: {student.year}</Text>

      <Text style={styles.subTitle}>Enrolled Classes:</Text>
      {student.enrolledClasses.length > 0 ? (
        <FlatList
          data={student.enrolledClasses}
          keyExtractor={(item) => item._id} // Ensure each class has a unique _id
          renderItem={({ item }) => (
            <View style={styles.classItem}>
              <Text>{item.name}</Text>
              <Text>
                Time: {item.startTime} - {item.endTime}
              </Text>
            </View>
          )}
        />
      ) : (
        <Text>No enrolled classes</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 10 },
  subTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  classItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc' },
});

export default StudentDetails;

// ManageStudents.js

import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet, Modal } from 'react-native';
import axios from 'axios';
import CONFIG from '../config'; // Adjust the path according to your file structure
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageStudents = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [classes, setClasses] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);

  const fetchStudents = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${CONFIG.BASE_URL}/api/students`, {
        headers: { Authorization: `${token}` }, // No 'Bearer'
      });
      setStudents(response.data);
    } catch (err) {
      setError('Failed to fetch students');
      console.error('Failed to fetch students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchClasses = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get(`${CONFIG.BASE_URL}/api/classes`, {
        headers: { Authorization: `${token}` }, // No 'Bearer'
      });
      setClasses(response.data);
    } catch (err) {
      console.error('Failed to fetch classes:', err);
    }
  };

  const handleAddClass = async (classId) => {
    try {
      const student = students.find(
        (student) => student._id === selectedStudentId
      ); // Find selected student
      if (student.enrolledClasses.includes(classId)) {
        alert('Student is already enrolled in this class'); // Alert if already enrolled
        return;
      }

      const token = await AsyncStorage.getItem('token');
      await axios.post(
        `${CONFIG.BASE_URL}/api/enrollment/enroll`,
        { studentId: selectedStudentId, classId },
        { headers: { Authorization: `${token}` } } // No 'Bearer'
      );
      setModalVisible(false);
      fetchStudents(); // Refresh the student list
    } catch (err) {
      if (err.response) {
        console.error('Failed to enroll student in class:', err.response.data);
        alert(`Error: ${err.response.data.message}`);
      } else {
        console.error('Failed to enroll student in class:', err);
        alert('Failed to enroll student in class');
      }
    }
  };

  const renderClassItem = ({ item }) => (
    <View style={styles.classItem}>
      <Text>{item.name}</Text>
      <Button title="Enroll" onPress={() => handleAddClass(item._id)} />
    </View>
  );

  const renderStudentItem = ({ item }) => (
    <View style={styles.studentItem}>
      <Text>{item.name}</Text>
      <Button
        title="View Details"
        onPress={() =>
          navigation.navigate('StudentDetails', { studentId: item._id })
        }
      />
      <Button
        title="Add Class"
        onPress={() => {
          setSelectedStudentId(item._id);
          fetchClasses();
          setModalVisible(true);
        }}
      />
    </View>
  );

  useEffect(() => {
    fetchStudents();
  }, []);

  if (loading) return <Text>Loading...</Text>;
  if (error) return <Text>{error}</Text>;

  return (
    <View>
      <FlatList
        data={students}
        keyExtractor={(item) => item._id}
        renderItem={renderStudentItem}
      />

      <Modal visible={modalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Select Class to Enroll</Text>
          <FlatList
            data={classes}
            keyExtractor={(item) => item._id}
            renderItem={renderClassItem}
          />
          <Button title="Close" onPress={() => setModalVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  studentItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  classItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
});

export default ManageStudents;

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import CONFIG from '../config';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ManageClasses = () => {
  const navigation = useNavigation();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error state

  // Fetch classes from the API
  const fetchClasses = async () => {
    setLoading(true); // Start loading
    setError(null); // Reset error state

    try {
      const token = await AsyncStorage.getItem('token');

      if (!token) {
        console.error('No token found');
        setError('User is not authenticated.');
        return;
      }

      const response = await fetch(`${CONFIG.BASE_URL}/api/classes`, {
        method: 'GET',
        headers: {
          Authorization: token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch classes');
      }

      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error('Failed to fetch classes:', error);
      setError(error.message); // Set error message
    } finally {
      setLoading(false); // End loading
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  // Helper function to display the day schedules
  const renderDaySchedules = (schedule) => {
    return schedule.map((day) => (
      <Text key={day.day}>
        {day.day}: {day.startTime} - {day.endTime}
      </Text>
    ));
  };

  // Render each class item
  const renderClassItem = ({ item }) => (
    <View style={styles.classItem}>
      <Text style={styles.classTitle}>{item.name}</Text>
      <Text style={styles.classDays}>Schedule:</Text>
      {renderDaySchedules(item.schedule)}
      <Button
        title="Edit"
        onPress={() => navigation.navigate('EditClass', { classData: item })} // Pass entire class object
      />
    </View>
  );

  if (loading) {
    return (
      <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />
    ); // Loading indicator
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    ); // Error message
  }

  if (classes.length === 0) {
    return (
      <View style={styles.container}>
        <Text>No classes available.</Text> {/* Empty state message */}
        <Button
          title="Add New Class"
          onPress={() => navigation.navigate('AddClass')}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={classes}
        renderItem={renderClassItem}
        keyExtractor={(item) => item._id}
      />
      <Button
        title="Add New Class"
        onPress={() => navigation.navigate('AddClass')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  classItem: {
    padding: 10,
    marginVertical: 5,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
  },
  classTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  classDays: {
    marginTop: 5,
    fontWeight: '600',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
  },
});

export default ManageClasses;

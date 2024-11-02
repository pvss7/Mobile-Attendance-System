import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Button,
  TextInput,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CONFIG from '../config';

const daysOfWeek = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const EditClass = ({ navigation, route }) => {
  const { classData } = route.params; // Pass class data from navigation
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState({});
  const [showPicker, setShowPicker] = useState({
    show: false,
    day: null,
    type: null,
  });
  const [selectedDays, setSelectedDays] = useState([]);

  useEffect(() => {
    console.log('Received class data:', classData); // Log classData
    if (classData) {
      setName(classData.name);
      const initialSchedule = classData.schedule.reduce((acc, curr) => {
        const [hoursStart, minutesStart] = curr.startTime.split(/:|\s+/);
        const [hoursEnd, minutesEnd] = curr.endTime.split(/:|\s+/);

        const startHour =
          curr.startTime.includes('pm') && hoursStart !== '12'
            ? parseInt(hoursStart) + 12
            : parseInt(hoursStart);
        const endHour =
          curr.endTime.includes('pm') && hoursEnd !== '12'
            ? parseInt(hoursEnd) + 12
            : parseInt(hoursEnd);

        acc[curr.day] = {
          startTime: new Date(1970, 0, 1, startHour, minutesStart),
          endTime: new Date(1970, 0, 1, endHour, minutesEnd),
        };

        console.log(`Initial Schedule for ${curr.day}:`, acc[curr.day]); // Log each day's schedule
        return acc;
      }, {});

      setSchedule(initialSchedule);
      setSelectedDays(classData.schedule.map((item) => item.day)); // Set selected days from classData
    } else {
      Alert.alert('Error', 'No class data found');
      navigation.navigate('ManageClasses'); // or some other safe screen
    }
  }, [classData]);

  const handleDaySelect = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
    if (!schedule[day]) {
      setSchedule((prev) => ({
        ...prev,
        [day]: { startTime: new Date(), endTime: new Date() },
      }));
    }
  };

  const handleTimeChange = (day, type, selectedTime) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [type]: selectedTime },
    }));
    setShowPicker({ show: false, day: null, type: null });
  };

  const handleEditClass = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      const formattedSchedule = selectedDays.map((day) => ({
        day,
        startTime: schedule[day]?.startTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
        endTime: schedule[day]?.endTime.toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      }));

      const response = await axios.put(
        `${CONFIG.BASE_URL}/api/classes/${classData._id}`,
        {
          name,
          schedule: formattedSchedule,
        },
        {
          headers: { Authorization: token },
        }
      );

      Alert.alert('Success', 'Class updated successfully');
      navigation.navigate('ManageClasses');
    } catch (error) {
      console.error('Failed to update class:', error);
      Alert.alert('Error', 'Failed to update class');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Edit Class</Text>
      <TextInput
        placeholder="Class Name"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />

      <Text style={styles.dayTitle}>Select Days:</Text>
      {daysOfWeek.map((day) => (
        <TouchableOpacity
          key={day}
          onPress={() => handleDaySelect(day)}
          style={styles.dayContainer}
        >
          <Text style={styles.checkbox}>
            {selectedDays.includes(day) ? '☑' : '☐'} {day}
          </Text>
        </TouchableOpacity>
      ))}

      {selectedDays.map((day) => (
        <View key={day} style={styles.scheduleContainer}>
          <Text style={styles.dayTitle}>{day}</Text>
          <Button
            title={`Select Start Time for ${day}`}
            onPress={() =>
              setShowPicker({ show: true, day, type: 'startTime' })
            }
          />
          <Text>{`Selected Start Time: ${
            schedule[day]?.startTime?.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }) || 'Not set'
          }`}</Text>

          <Button
            title={`Select End Time for ${day}`}
            onPress={() => setShowPicker({ show: true, day, type: 'endTime' })}
          />
          <Text>{`Selected End Time: ${
            schedule[day]?.endTime?.toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }) || 'Not set'
          }`}</Text>
        </View>
      ))}

      {showPicker.show && (
        <DateTimePicker
          value={
            new Date(
              showPicker.type === 'startTime'
                ? schedule[showPicker.day]?.startTime
                : schedule[showPicker.day]?.endTime
            )
          }
          mode="time"
          display="default"
          onChange={(event, selectedTime) => {
            if (selectedTime) {
              handleTimeChange(showPicker.day, showPicker.type, selectedTime);
            }
          }}
        />
      )}

      <View style={styles.buttonContainer}>
        <Button title="Update Class" onPress={handleEditClass} />
        <View style={styles.buttonGap} />
        <Button
          title="Cancel"
          onPress={() => navigation.navigate('ManageClasses')}
          color="red"
        />
      </View>
      <View style={styles.extraSpace} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  contentContainer: {
    paddingBottom: 100,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 12,
    padding: 8,
  },
  dayTitle: {
    fontSize: 18,
    marginVertical: 10,
  },
  dayContainer: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 5,
  },
  checkbox: {
    fontSize: 16,
  },
  scheduleContainer: {
    marginVertical: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonGap: {
    height: 10,
  },
  extraSpace: {
    height: 50,
  },
});

export default EditClass;

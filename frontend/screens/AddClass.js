import React, { useState } from 'react';
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

const AddClass = ({ navigation }) => {
  const [name, setName] = useState('');
  const [schedule, setSchedule] = useState({});
  const [showPicker, setShowPicker] = useState({
    show: false,
    day: null,
    type: null,
  });
  const [selectedDays, setSelectedDays] = useState([]);

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

  const handleAddClass = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      // Filter the schedule to include only selected days
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

      const response = await axios.post(
        `${CONFIG.BASE_URL}/api/classes`,
        {
          name,
          schedule: formattedSchedule,
        },
        {
          headers: { Authorization: token },
        }
      );

      Alert.alert('Success', 'Class added successfully');
      navigation.navigate('ManageClasses');
    } catch (error) {
      console.error('Failed to add class:', error);
      Alert.alert('Error', 'Failed to add class');
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <Text style={styles.title}>Add Class</Text>
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
        <Button title="Add Class" onPress={handleAddClass} />
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
    height: 100,
  },
});

export default AddClass;

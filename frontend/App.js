import 'react-native-gesture-handler';
import { gestureHandlerRootHOC } from 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StudentProvider } from './context/StudentContext'; // Import the context

import LoginScreen from './screens/LoginScreen';
import AdminDashboard from './screens/AdminDashboard';
import ManageClasses from './screens/ManageClasses';
import ManageStudents from './screens/ManageStudents';
import StudentDashboard from './screens/StudentDashboard';
import ClassScreen from './screens/ClassScreen';
import StudentDetails from './screens/StudentDetails';
import RegisterScreen from './screens/RegisterScreen'; // Add RegisterScreen
import AddClass from './screens/AddClass';
import EditClass from './screens/editClass';

const Stack = createStackNavigator();

const App = () => {
  return (
    <StudentProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen name="AdminDashboard" component={AdminDashboard} />
          <Stack.Screen name="ManageClasses" component={ManageClasses} />
          <Stack.Screen name="ManageStudents" component={ManageStudents} />
          <Stack.Screen name="StudentDashboard" component={StudentDashboard} />
          <Stack.Screen name="ClassScreen" component={ClassScreen} />
          <Stack.Screen name="StudentDetails" component={StudentDetails} />
          <Stack.Screen name="AddClass" component={AddClass} />
          <Stack.Screen name="EditClass" component={EditClass} />
        </Stack.Navigator>
      </NavigationContainer>
    </StudentProvider>
  );
};
export default gestureHandlerRootHOC(App);

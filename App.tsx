import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import Register_BasicDetails_1 from './screens/stack/Register_BasicDetails_1';
import Register_PhysicalData_2 from './screens/stack/Register_PhysicalData_2';
import Register_ActivityLevel_3 from './screens/stack/Register_ActivityLevel_3';


const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();


export default function App() {
  return (
      <NavigationContainer>
            <Stack.Navigator initialRouteName="Register_BasicDetails_1">
                <Stack.Screen name="Register_BasicDetails_1" component={Register_BasicDetails_1} />
                <Stack.Screen name="Register_PhysicalData_2" component={Register_PhysicalData_2} />
                <Stack.Screen name="Register_ActivityLevel_3" component={Register_ActivityLevel_3} />
            </Stack.Navigator>
      </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});


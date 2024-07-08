import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import React from 'react';
import Onboarding from './screens/client/OnBoarding';
import Register from './screens/stack/Register';
import Gallery from './screens/client/Gallery';
import DailyCalories from './screens/client/DailyCalories';
import DailyGeminiChat from './screens/client/DailyGeminiChat';
import HomePage from './screens/client/HomePage';

const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

export default function App() {
  return (
      <NavigationContainer>
            <Stack.Navigator initialRouteName="OnBoarding" >
                <Stack.Screen name="OnBoarding" component={Onboarding} options={{ headerShown: false }}/>
                <Stack.Screen name="HomePage" component={HomePage} />
                <Stack.Screen name="DailyCalories" component={DailyCalories}/>
                <Stack.Screen name="Register" component={Register} options={{ headerTitle: 'Basic Details'
                  // , headerLeft: () => null, gestureEnabled: false
                  }}/>
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


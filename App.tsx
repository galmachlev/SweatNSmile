import React, { useState } from 'react';
import { StyleSheet, View, Button, Modal, TouchableOpacity, Text } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons'; // Assuming you're using Expo for icons
import Onboarding from './screens/client/OnBoarding';
import Register from './screens/stack/Register';
import Gallery from './screens/client/Gallery';
import Profile from './screens/client/Profile';
import AllMenusTable from './screens/client/AllMenusTable';
import DailyCalories from './screens/client/DailyCalories';
import HomeScreen from './screens/client/HomeScreen';
import DailyWeight from './screens/client/DailyWeight';
import DailyMenu from './screens/client/DailyMenu';
import HomeStore from './screens/client/HomeStore';

type RootStackParamList = {
  OnBoarding: undefined;
  HomePage: undefined;
  DailyCalories: undefined;
  Register: undefined;
  Gallery: undefined;
  Profile: undefined;
  AllMenusTable: undefined;
  HomeStore: undefined;
  // Add other screens as needed
};

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const menuItems = [
  { name: 'Gallery', icon: 'images', routeName: 'Gallery' },
  { name: 'Store', icon: 'cart', routeName: 'HomeStore' }, // Assuming Store screen exists
  { name: 'All Menus', icon: 'list', routeName: 'AllMenusTable' }, // Assuming AllMenusTable screen exists
  { name: 'Profile', icon: 'person', routeName: 'Profile' }, // Assuming Profile screen exists
];

type MoreMenuProps = {
  visible: boolean;
  onClose: () => void;
};

function MoreMenu({ visible, onClose }: MoreMenuProps) {
  const navigation = useNavigation<any>(); // Use 'any' as a temporary fix

  const navigateToScreen = (routeName: keyof RootStackParamList) => {
    onClose(); // Close the menu first
    navigation.navigate(routeName); // Navigate to the specified route
  };

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => navigateToScreen(item.routeName as keyof RootStackParamList)}>
              <Ionicons name={item.icon as any} size={24} color="white" style={styles.menuIcon} />
              <Text style={styles.menuText}>{item.name}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.menuItem} onPress={onClose}>
            <Ionicons name="close" size={24} color="white" style={styles.menuIcon} />
            <Text style={styles.menuText}>Close</Text>
          </TouchableOpacity>
          <View style={styles.chatBubble} />
        </View>
      </View>
    </Modal>
  );
}

function MoreScreen() {
  return null;
}

function TabNavigator() {
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  return (
    <>
      <MoreMenu visible={moreMenuVisible} onClose={() => setMoreMenuVisible(false)} />
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Weight') {
              iconName = 'fitness';
            } else if (route.name === 'Menu') {
              iconName = 'restaurant';
            } else if (route.name === 'More') {
              iconName = 'ellipsis-horizontal';
            }

            return <Ionicons name={iconName as any} size={28} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
          tabBarStyle: {
            backgroundColor: '#9AB28B',
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            borderTopWidth: 0,
            height: 85,
            paddingBottom: 20,
            paddingTop: 10,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            marginBottom: 2, // Adjust as needed for spacing between icon and label
          },
          tabBarIconStyle: {
            marginBottom: 2, // Adjust as needed for spacing between icon and label
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Weight" component={DailyWeight} />
        <Tab.Screen name="Menu" component={DailyMenu} />
        <Tab.Screen
          name="More"
          component={MoreScreen}
          listeners={{
            tabPress: e => {
              e.preventDefault();
              setMoreMenuVisible(true);
            },
          }}
        />
      </Tab.Navigator>
    </>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="OnBoarding">
        <Stack.Screen name="OnBoarding" component={Onboarding} options={{ headerShown: false }} />
        <Stack.Screen name="HomePage" component={TabNavigator} options={{ headerShown: false }} />
        <Stack.Screen name="DailyCalories" component={DailyCalories} />
        <Stack.Screen name="Register" component={Register} options={{ headerTitle: 'Basic Details',
            // headerLeft: () => null, gestureEnabled: false
          }}
        />
        <Stack.Screen name="Gallery" component={Gallery} />
        <Stack.Screen name="Profile" component={Profile} />
        <Stack.Screen name="AllMenusTable" component={AllMenusTable} />
        <Stack.Screen name="HomeStore" component={HomeStore} />

        {/* Add other stack screens here for Profile, Store, AllMenusTable if needed */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#9AB28B',
    paddingHorizontal: 40,
    paddingVertical: 25,
    borderRadius: 30,
    alignSelf: 'flex-end', // Center the container horizontally
    maxWidth: '90%', // Adjust the width as needed
    position: 'absolute',
    bottom: 90,
    right: 20,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    justifyContent: 'flex-start', // Center items horizontally
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    color: 'white',
    fontSize: 16,
  },
  chatBubble: {
    // position: 'absolute',
    // width: 0,
    // height: 0,
    // borderStyle: 'solid',
    // borderTopWidth: 0,
    // borderRightWidth: 20,
    // borderBottomWidth: 20,
    // borderLeftWidth: 20,
    // borderRightColor: 'transparent',
    // borderLeftColor: 'transparent',
    // right: 20,
    // bottom: -5,
  },
});

import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Onboarding from './screens/client/OnBoarding';
import Register from './screens/stack/Register';
import Gallery from './screens/client/Gallery';
import Profile from './screens/client/Profile';
import DailyCalories from './screens/client/DailyCalories';
import HomeScreen from './screens/client/HomeScreen';
import DailyWeight from './screens/client/DailyWeight';
import DailyMenu from './screens/client/DailyMenu';
import { RootStackParamList } from './types/navigationTypes'; // Adjust the import path as needed
import Login from './screens/stack/Login';
import { UserProvider } from './context/UserContext';
import StoreComingSoonScreen from './screens/client/StoreComingSoon';
import HealthyRecipesScreen from './screens/client/recipes/HealthyRecipesScreen';
import GeminiRecipes from './screens/client/recipes/GeminiRecipes';
import RecipeCategoryScreen from './screens/client/recipes/RecipeCategoryScreen';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from '@apollo/client';
import AdminPage from './screens/admin/HomeAdmin';
import AddUser from './screens/admin/AddUser';
import UserTable from './screens/admin/UserTable';
import HomeAdmin from './screens/admin/HomeAdmin';

const client = new ApolloClient({
  uri: 'https://oneonta.stepzen.net/api/belligerent-waterbuffalo/__graphql',
  cache: new InMemoryCache(),
  headers: {
    Authorization:
      'apikey oneonta::stepzen.io+1000::f1fd564cbba026853eeedfbb05322edfe26263d2973848915d962dd16878e937',
  },
});

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator<RootStackParamList>();

const menuItems = [
  { name: 'Gallery', icon: 'images', routeName: 'Gallery' },
  { name: 'Store', icon: 'cart', routeName: 'StoreComingSoonScreen' },
  { name: 'Recpies', icon: 'nutrition', routeName: 'HealthyRecipesScreen' },
];

type MoreMenuProps = {
  visible: boolean;
  onClose: () => void;
};

function MoreMenu({ visible, onClose }: MoreMenuProps) {
  const navigation = useNavigation<any>();
  const [animation] = useState(new Animated.Value(visible ? 1 : 0));

  React.useEffect(() => {
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const navigateToScreen = (routeName: keyof RootStackParamList) => {
    onClose();
    navigation.navigate(routeName);
  };

  const translateY = animation.interpolate({
    inputRange: [0, 1],
    outputRange: [300, 0],
  });

  return (
    <Animated.View 
      style={[
        styles.moreMenuContainer,
        {
          transform: [{ translateY }],
          opacity: animation,
        }
      ]}
    >
      {menuItems.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]}
          onPress={() => navigateToScreen(item.routeName as keyof RootStackParamList)}
        >
          <Ionicons name={item.icon as any} size={24} color="#9AB28B" style={styles.menuIcon} />
          <Text style={styles.menuText}>{item.name}</Text>
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

const PlusButton = ({ onPress, isOpen }: { onPress: () => void; isOpen: boolean }) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.plusButtonContainer}>
      <Ionicons name={isOpen ? "close" : "menu"} size={30} color="#9AB28B" />
    </TouchableOpacity>
  );
};

function TabNavigator() {
  const [moreMenuVisible, setMoreMenuVisible] = useState(false);

  const toggleMoreMenu = () => {
    setMoreMenuVisible(!moreMenuVisible);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#white' }}>
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
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Ionicons name={iconName as any} size={28} color={color} />;
          },
          tabBarActiveTintColor: 'white',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)',
          tabBarStyle: {
            backgroundColor: '#9AB28B',
            borderRadius: 50,
            bottom: 25,
            marginHorizontal: 15,
            height: 75,
            paddingBottom: 10,
            paddingTop: 20,
            justifyContent: 'center',
          },
          tabBarLabelPosition: 'below-icon', // טקסט מתחת לאייקון
          tabBarLabelStyle: {
            fontSize: 12,            
          },
          tabBarIconStyle: {
            paddingHorizontal: 10, // מרווח בין האייקונים
            marginLeft: route.name === 'More' ? 35 : 0, // מרווח מיוחד לאייקון "More"
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Weight" component={DailyWeight} />
        <Tab.Screen 
          name="More" 
          component={HomeScreen}
          options={{ 
            tabBarButton: () => (
              <PlusButton onPress={toggleMoreMenu} isOpen={moreMenuVisible} />
            ) 
          }} 
        />
        <Tab.Screen name="Menu" component={DailyMenu}  options={{ headerTitle: 'Daily menu' }} />
        <Tab.Screen name="Profile" component={Profile} />
      </Tab.Navigator>
      <MoreMenu visible={moreMenuVisible} onClose={() => setMoreMenuVisible(false)} />
    </View>
  );
}

export default function App() {
  return (
    <ApolloProvider client={client}>
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator initialRouteName="OnBoarding">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="OnBoarding" component={Onboarding} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="DailyCalories" component={DailyCalories} />
          <Stack.Screen name="Register" component={Register} options={{ headerTitle: 'Basic Details' }} />
          <Stack.Screen name="Gallery" component={Gallery} />
          <Stack.Screen name="DailyMenu" component={DailyMenu} />
          <Stack.Screen name="DailyWeight" component={DailyWeight} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="HealthyRecipesScreen" component={HealthyRecipesScreen}  options={{ headerTitle: '' }}/>
          <Stack.Screen name="HomeStore" component={HomeScreen} />
          <Stack.Screen name="StoreComingSoonScreen" component={StoreComingSoonScreen} />
          <Stack.Screen name="GeminiRecipes" component={GeminiRecipes} options={{ headerTitle: '' }}/>
          <Stack.Screen name="RecipeCategoryScreen" component={RecipeCategoryScreen} options={{ headerTitle: '' }}/>
          <Stack.Screen name="HomeAdmin" component={HomeAdmin} options={{ headerTitle: 'HomeAdmin' }} />
          <Stack.Screen name="AddUser" component={AddUser} options={{ headerTitle: 'AddUser' }}/>
          <Stack.Screen name="UserTable" component={UserTable} options={{ headerTitle: 'UserTable' }}/>
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
    </ApolloProvider>
  );
}

const styles = StyleSheet.create({
  moreMenuContainer: {
    position: 'absolute',
    bottom: 140,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderRadius: 20,
    paddingVertical: 20,
    marginHorizontal: 20,
    paddingHorizontal: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 14,
  },
  menuItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(154, 178, 139, 0.3)',
  },
  menuIcon: {
    marginRight: 10,
  },
  menuText: {
    color: '#5F6063',
    fontSize: 16,
    marginLeft: 10,
  },
  plusButtonContainer: {
    position: 'absolute',
    bottom: 30,
    left: '50%',
    marginLeft: -35,
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#ffffff',
    borderColor: '#9AB28B',
    borderWidth: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

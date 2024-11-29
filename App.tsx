import React, { useState } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Animated, LogBox } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import Onboarding from './screens/client/OnBoarding';
import Register from './screens/stack/Register';
import Gallery from './screens/client/Gallery';
import Profile from './screens/client/Profile';
import HomeScreen from './screens/client/HomeScreen';
import DailyMenu from './screens/client/Menus/DailyMenu';
import { RootStackParamList } from './types/navigationTypes';
import Login from './screens/stack/Login';
import { UserProvider } from './context/UserContext';
import HealthyRecipesScreen from './screens/client/recipes/HealthyRecipesScreen';
import GeminiRecipes from './screens/client/recipes/GeminiRecipes';
import RecipeCategoryScreen from './screens/client/recipes/RecipeCategoryScreen';
import AddUser from './screens/admin/AddUser';
import UserTable from './screens/admin/UserTable';
import HomeAdmin from './screens/admin/HomeAdmin';
import UserWeights from './screens/admin/UserWeights';
import DailyDashboard from './screens/client/DailyDashboard';
import AdminEditUser from './screens/admin/AdminEditUser';
import WeeklyChallenge from './screens/client/Challenges/WeeklyChallenge';
import ChallengeDetails from './screens/client/Challenges/ChallengeDetails';
import { PaperProvider } from 'react-native-paper';
import StoreScreen from './screens/client/StoreScreen';
import AllMenusTable from './screens/client/Menus/AllMenusTable';

// התעלמות מהודעות לוג ספציפיות
LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews', // התעלמות מהתראה על רשימות וירטואליות בתוך ScrollViews רגיל
  'Warning: Encountered two children with the same key', // התעלמות מהתראה על מפתח כפול
  'Bridgeless mode is enabled', // התעלמות מהודעת Bridgeless mode
  'JavaScript logs will be removed from Metro in React Native 0.77', // התעלמות מהודעה על הסרת יומני ג'אווהסקריפט
  '[expo-av]: Video component from `expo-av` is deprecated in favor of `expo-video`' // התעלמות מהודעה על רכיב וידאו מ-`expo-av`
]);


const Tab = createBottomTabNavigator(); // יצירת טאב נוויגטור
const Stack = createStackNavigator<RootStackParamList>(); // יצירת סטאק נוויגטור

const menuItems = [ // פרטי התפריט של ה-"More"
  { name: 'Gallery', icon: 'images', routeName: 'Gallery' },
  { name: 'Store', icon: 'cart', routeName: 'Store' },
  { name: 'Recipes', icon: 'nutrition', routeName: 'HealthyRecipesScreen' },
];

type MoreMenuProps = { // הגדרת סוג המאפיינים של ה-MoreMenu
  visible: boolean; // אם התפריט גלוי או לא
  onClose: () => void; // פונקציה לסגור את התפריט
};

// פונקציה המייצרת את התפריט הקטן עם אפשרויות שונות
function MoreMenu({ visible, onClose }: MoreMenuProps) {
  const navigation = useNavigation<any>(); // שימוש בניווט
  const [animation] = useState(new Animated.Value(visible ? 1 : 0)); // הגדרת אנימציה

  React.useEffect(() => { // אפקט של אנימציה כשהתפריט משנה את מצב ה-Visible
    Animated.timing(animation, {
      toValue: visible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [visible]);

  const navigateToScreen = (routeName: keyof RootStackParamList) => { // פונקציה לנווט בין המסכים
    onClose(); // סגירת התפריט הקטן
    navigation.navigate(routeName); // ניווט למסך המבוקש
  };

  const translateY = animation.interpolate({ // הגדרת אנימציה של תזוזה
    inputRange: [0, 1],
    outputRange: [300, 0], // מסלול תזוזה
  });

  return ( 
    <Animated.View 
      style={[
        styles.moreMenuContainer, // סגנון התפריט הקטן
        {
          transform: [{ translateY }],
          opacity: animation, // שינוי שקיפות בהתאמה לאנימציה
        }
      ]}
    >
      {menuItems.map((item, index) => ( // יצירת כל פריט בתפריט
        <TouchableOpacity
          key={index} // שימוש במפתח ייחודי
          style={[styles.menuItem, index !== menuItems.length - 1 && styles.menuItemBorder]} // סגנון עבור כל פריט
          onPress={() => navigateToScreen(item.routeName as keyof RootStackParamList)} // ניווט למסך המתאים
        >
          <Ionicons name={item.icon as any} size={24} color="#9AB28B" style={styles.menuIcon} />{/* אייקון של הפריט */}
          <Text style={styles.menuText}>{item.name}</Text>{/* שם הפריט */}
        </TouchableOpacity>
      ))}
    </Animated.View>
  );
}

const PlusButton = ({ onPress, isOpen }: { onPress: () => void; isOpen: boolean }) => { // כפתור ה-"המבורגר" המפנה למצב פתוח וסגור
  return (
    <TouchableOpacity onPress={onPress} style={styles.plusButtonContainer}>
      <Ionicons name={isOpen ? "close" : "menu"} size={30} color="#9AB28B" />{/* שינוי האייקון לפי מצב הכפתור */}
    </TouchableOpacity>
  );
};

// טאב נוויגטור – ניווט בין מסכים שונים עם אייקונים
function TabNavigator() {
  const [moreMenuVisible, setMoreMenuVisible] = useState(false); // מצב של התפריט הקטן

  const toggleMoreMenu = () => { // פונקציה להדלקה/כיבוי של התפריט הקטן
    setMoreMenuVisible(!moreMenuVisible);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#white' }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color }) => { // הגדרת אייקונים עבור הטאבים
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Dashboard') {
              iconName = 'fitness';
            } else if (route.name === 'Menu') {
              iconName = 'restaurant';
            } else if (route.name === 'Profile') {
              iconName = 'person';
            }

            return <Ionicons name={iconName as any} size={30} color={color} />;
          },
          tabBarActiveTintColor: 'white', // צבע האייקון ברגע שעומדים עליו
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.7)', // צבע האייקון ברגע שלא עומדים עליו
          tabBarStyle: { // סגנון בר הטאב
            backgroundColor: '#9AB28B', // צבע הרקע של ה-TabBar
            borderRadius: 50, // עיגול הפינות
            bottom: 25,
            marginHorizontal: 15,
            height: 75,
            paddingBottom: 10,
            paddingTop: 10,
            justifyContent: 'center', // מרכז את התוכן
            // אפקט תלת-ממדי עם צללים
            shadowColor: '#000', // צבע הצל
            shadowOffset: { width: 0, height: 10 }, // מיקום הצל
            shadowOpacity: 0.25, // שקיפות הצל
            shadowRadius: 5, // רדיוס הצל
            elevation: 5, // אפקט הצל ב-iOS
            borderWidth: 1, // מסביב לבר
            borderColor: '#8F9A77', // צבע הגבול
          },
          tabBarLabelPosition: 'below-icon', // טקסט מתחת לאייקון
          tabBarLabelStyle: {
            fontSize: 12,            
          },
          tabBarIconStyle: {
            paddingHorizontal: 0, // מרווח בין האייקונים
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Dashboard" component={DailyDashboard} options={{ headerTitle: 'Daily Progress' }}/>
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
  <PaperProvider>
    <NavigationContainer>
      <UserProvider>
        <Stack.Navigator initialRouteName="OnBoarding">
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="OnBoarding" component={Onboarding} options={{ headerShown: false }} />
          <Stack.Screen name="HomeScreen" component={TabNavigator} options={{ headerShown: false }} />
          <Stack.Screen name="Register" component={Register} options={{ headerTitle: 'Basic Details' }} />
          <Stack.Screen name="Gallery" component={Gallery} />
          <Stack.Screen name="AllMenusTable" component={AllMenusTable} />
          <Stack.Screen name="DailyDashboard" component={DailyDashboard} options={{ headerTitle: 'Daily Progress' }} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="HealthyRecipesScreen" component={HealthyRecipesScreen}  options={{ headerTitle: '' }}/>
          <Stack.Screen name="HomeStore" component={HomeScreen} />
          <Stack.Screen name="Store" component={StoreScreen} />
          <Stack.Screen name="GeminiRecipes" component={GeminiRecipes} options={{ headerTitle: '' }}/>
          <Stack.Screen name="RecipeCategoryScreen" component={RecipeCategoryScreen} options={{ headerTitle: '' }}/>
          <Stack.Screen name="HomeAdmin" component={HomeAdmin} options={{ headerTitle: 'HomeAdmin' }} />
          <Stack.Screen name="AddUser" component={AddUser} options={{ headerTitle: 'AddUser' }}/>
          <Stack.Screen name="UserTable" component={UserTable} options={{ headerTitle: 'UserTable' }}/>
          <Stack.Screen name="UserWeights" component={UserWeights} options={{ headerTitle: 'UserWeights' }}/>
          <Stack.Screen name="AdminEditUser" component={AdminEditUser} options={{ headerTitle: 'AdminEditUser' }}/>
          <Stack.Screen name="WeeklyChallenge" component={WeeklyChallenge} options={{ headerTitle: 'WeeklyChallenge' }}/>
          <Stack.Screen name="ChallengeDetails" component={ChallengeDetails} options={{ headerTitle: 'ChallengeDetails' }}/>
        </Stack.Navigator>
      </UserProvider>
    </NavigationContainer>
  </PaperProvider>
  );
}

// סטיילים
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

import React, { createContext, useContext, ReactNode, useState } from 'react';
import { Alert } from 'react-native';
import { useNavigation, NavigationProp } from '@react-navigation/native';
import { User } from '../types/user';

// Define the RootStackParamList type for navigation
type RootStackParamList = {
    OnBoarding: undefined;
    HomeScreen: undefined;
    DailyCalories: undefined;
    Register: undefined;
    Gallery: undefined;
    Profile: undefined;
    AllMenusTable: undefined;
    HomeStore: undefined;
    Login: undefined;
    HomeAdmin: undefined;
};

// Define the context type
type UserContextType = {
    login: (email: string, password: string) => Promise<void>;
    currentUser: User | null;
    users: User[]; // Add users array to store the fetched users
    fetchUsers: () => Promise<void>; // Add function to fetch users
    deleteUser: (email: string) => Promise<void>; // Add function to delete user
    profileImage: string | null; // Add the profile image property
    updateProfileImage: (imageUri: string) => void; // Add function to update profile image
    calculateDailyCalories: (
        gender: string, height: string, currentWeight: string,
        goalWeight: string, activityLevel: string
    ) => Result | null; // Update the daily calorie calculation function
};

// Define the Result type
interface Result {
    BMR: number;
    TDEE: number;
    DailyCalorieDeficit: number;
    RecommendedDailyCalories: number;
}

// Create the UserContext
const UserContext = createContext<UserContextType | undefined>(undefined);

// Create a custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};

// Define the props for the UserProvider
type UserProviderProps = {
    children: ReactNode;
};

// Create the UserProvider component
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const navigation = useNavigation<NavigationProp<RootStackParamList>>();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[]>([]); // Add state for storing users

    // Login function
    const login = async (email: string, password: string) => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in both fields.');
            return;
        }

        // Basic email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Error', 'Invalid email address.');
            return;
        }

        // Password validation
        if (password.length < 6) {
            Alert.alert('Error', 'Password must be at least 6 characters long');
            return;
        }

        try {
            // Check if the login is for the admin
            if (email === 'admin@gmail.com' && password === 'admin1234321!') {
                navigation.navigate('HomeAdmin');
                return;
            }

            // Proceed with normal user login
            let res = await fetch('https://database-s-smile.onrender.com/api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (res.ok) {
                let data = await res.json();
                setCurrentUser(data.user);
                Alert.alert('Success', 'Login successful.');
                navigation.navigate('HomeScreen');
            } else {
                Alert.alert('Error', 'Invalid email or password.');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'An error occurred while logging in. Please try again.');
        }
    };

    // Fetch users from the API
    const fetchUsers = async () => {
        try {
            let res = await fetch('https://database-s-smile.onrender.com/api/users/');
            if (res.ok) {
                let data = await res.json();
                setUsers(data); // Store users in the state
            } else {
                console.error('Failed to fetch users');
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    const defaultProfileImage = require('../Images/profile_img.jpg');
    const [profileImage, setProfileImage] = useState(defaultProfileImage);

    const updateProfileImage = (imageUri: string) => {
        setProfileImage(imageUri);
    };

    // Delete user function
    const deleteUser = async (email: string) => {
        try {
            let res = await fetch('https://database-s-smile.onrender.com/api/users/delete', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            if (res.ok) {
                // Fetch the updated list of users after successful deletion
                await fetchUsers(); // Re-fetch users from the backend to get the updated data
                Alert.alert('Success', 'User deleted successfully.');
            } else {
                const errorResponse = await res.json();
                throw new Error(errorResponse.message || 'Failed to delete user');
            }
        } catch (error) {
            console.error('Error deleting user:', error);
            Alert.alert('Error', 'An error occurred while deleting the user. Please try again.');
        }
    };

    // Calculate BMR (assuming a default age of 30)
    const calculateBMR = (gender: string, height: number, weight: number): number => {
        if (gender.toLowerCase() === 'male') {
            return 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * 30); // Assuming age 30
        } else if (gender.toLowerCase() === 'female') {
            return 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * 30); // Assuming age 30
        } else {
            return 0;
        }
    };

    // Calculate TDEE (Total Daily Energy Expenditure)
    const calculateTDEE = (bmr: number, activityLevel: string): number => {
        const activityMultipliers: Record<string, number> = {
            'notVeryActive': 1.2,         // Equivalent to sedentary
            'lightlyActive': 1.375,       // Equivalent to light
            'moderatelyActive': 1.55,     // Equivalent to moderate
            'active': 1.725,              // Equivalent to active
            'veryActive': 1.9             // Equivalent to very active
        };

        // Default to 'notVeryActive' if activityLevel is not recognized
        return bmr * (activityMultipliers[activityLevel] || 1.2);
    };

    // Calculate daily calorie deficit without goal date
    const calculateDailyCalorieDeficit = (currentWeight: number, goalWeight: number): number => {
        const totalWeightLossNeeded = currentWeight - goalWeight; // in kg
        const weeklyWeightLoss = 0.5; // Assume the user wants to lose 0.5 kg per week
        const caloriesPerKg = 7700; // 1 kg of fat = 7700 calories
        const weeklyCalorieDeficit = weeklyWeightLoss * caloriesPerKg; // Calorie deficit per week
        const dailyCalorieDeficit = weeklyCalorieDeficit / 7; // Convert weekly deficit to daily
        return dailyCalorieDeficit;
    };

    // Function to calculate daily calories
    const calculateDailyCalories = (
        gender: string,
        height: string,
        currentWeight: string,
        goalWeight: string,
        activityLevel: string
    ): Result | null => {
        const bmr = calculateBMR(gender, parseFloat(height), parseFloat(currentWeight));
        const tdee = calculateTDEE(bmr, activityLevel);
        const dailyCalorieDeficit = calculateDailyCalorieDeficit(parseFloat(currentWeight), parseFloat(goalWeight));
        const recommendedDailyCalories = Math.round(tdee - dailyCalorieDeficit);

        return {
            BMR: bmr,
            TDEE: tdee,
            DailyCalorieDeficit: dailyCalorieDeficit,
            RecommendedDailyCalories: recommendedDailyCalories,
        };
    };

    return (
        <UserContext.Provider value={{
            login, currentUser, users, fetchUsers, deleteUser,
            profileImage, updateProfileImage, calculateDailyCalories
        }}>
            {children}
        </UserContext.Provider>
    );
};

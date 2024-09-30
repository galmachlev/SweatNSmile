/*
 * This component creates a context for user login and register.
 * It uses the useNavigation hook to get the navigation object.
 * It also exports a UserProvider component that wraps the UserContext.Provider component.
 * The UserProvider component receives children as a prop and renders them.
 * The UserProvider component also exports a useUser hook that returns the login and currentUser states and functions.
 * The login function is used to login the user and the currentUser state is used to store the user's information.
 */

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
    login: (email: string, password: string) => Promise<void>
    currentUser: User | null
};

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
            Alert.alert('Error', 'Password must be at least 6 characters long.');
            return;
        }
    
        try {
            // Check if the login is for the admin
            if (email === 'admin@gmail.com' && password === 'admin1234321!') {
                Alert.alert('Success', 'Welcome Admin!');
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
    

    return (
        <UserContext.Provider value={{ login, currentUser }}>
            {children}
        </UserContext.Provider>
    );
};






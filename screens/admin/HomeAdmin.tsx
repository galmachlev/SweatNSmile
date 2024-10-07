import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigationTypes'; 

type AdminPageNavigationProp = StackNavigationProp<RootStackParamList, 'HomeAdmin'>;

export default function AdminPage() {
  // Use the typed navigation prop
  const navigation = useNavigation<AdminPageNavigationProp>();

  const handleAddUser = () => {
    // Navigate to AddUser component
    navigation.navigate('AddUser');
  };

  const handleViewUsers = () => {
    // Navigate to UserTable component
    navigation.navigate('UserTable');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Admin Dashboard</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAddUser}>
          <Text style={styles.buttonText}>Add User</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleViewUsers}>
          <Text style={styles.buttonText}>View All Users</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
  },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#333',
    textAlign: 'center',
  },
  buttonContainer: {
    marginVertical: 15,
    width: '80%',
  },
  button: {
    backgroundColor: '#3E6613', // צבע ירוק
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    elevation: 3, // השפעת צל
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});

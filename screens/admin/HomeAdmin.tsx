import { View, Text, Button, StyleSheet } from 'react-native';
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
        <Button title="Add User" onPress={handleAddUser} />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="View All Users" onPress={handleViewUsers} />
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
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  buttonContainer: {
    marginVertical: 10,
    width: '80%',
  },
});

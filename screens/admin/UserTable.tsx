import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';

export default function UserTable() {
  const { users, fetchUsers, deleteUser } = useUser();
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      await fetchUsers();
      setLoading(false);
    };

    loadUsers();
  }, []);

  const handleDeletePress = (firstName: string, lastName: string, email: string) => {
    Alert.alert(
      'Delete User',
      `Are you sure you want to delete ${firstName} ${lastName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => deleteUser(email), style: 'destructive' },
      ],
      { cancelable: true }
    );
  };

  const handleEditPress = (user: any) => {
    navigation.navigate('AdminEditUser', { user });
  };

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.userRow}>
      <Text style={styles.userText}>{item.firstName}</Text>
      <Text style={styles.userText}>{item.lastName}</Text>
      <Text style={styles.userText}>{item.email}</Text>
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(item)}>
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress(item.firstName, item.lastName, item.email)}>
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Users List</Text>
      <View style={styles.tableHeader}>
        <Text style={styles.headerText}>First Name</Text>
        <Text style={styles.headerText}>Last Name</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>Actions</Text>
      </View>
      <FlatList data={users} renderItem={renderUser} keyExtractor={(item) => item.email} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E6613',
    marginBottom: 20,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    backgroundColor: '#9AB28B',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold', 
    color: '#3E6613',
    flex: 1,
    textAlign: 'center',
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#3E6613',
  },
  userText: {
    fontSize: 14,
    color: '#3E6613',
    flex: 1,
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

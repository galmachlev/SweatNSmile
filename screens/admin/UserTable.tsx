import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useUser } from '../../context/UserContext';
import Icon from 'react-native-vector-icons/MaterialIcons';

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
      <Image source={{ uri: item.profileImageUrl }} style={styles.profileImage} />
      <Text style={styles.userText}>{item.email}</Text>
      <Text style={styles.userText}>{item.firstName}</Text>
      <Text style={styles.userText}>{item.lastName}</Text>
      <View style={styles.actionButtons}>
      <TouchableOpacity style={styles.editButton} onPress={() => handleEditPress(item)}>
            <Icon name="edit" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeletePress(item.firstName, item.lastName, item.email)}>
            <Icon name="delete" size={20} color="#fff" />
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
        <Text style={styles.headerText}>Profile Img</Text>
        <Text style={styles.headerText}>Email</Text>
        <Text style={styles.headerText}>First Name</Text>
        <Text style={styles.headerText}>Last Name</Text>
        <Text style={styles.headerText}>Actions</Text>
        </View>
      <FlatList data={users} renderItem={renderUser} keyExtractor={(item) => item.email} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center', // למרכז את התוכן
    alignItems: 'center',     // למרכז את התוכן
    padding: 20,
    backgroundColor: '#f0f4f7',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E6613',
    marginVertical: 30,
    textAlign: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#9AB28B',
    borderRadius: 8,
    marginBottom: 10,
    width: '100%',
  },
  headerText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#3E6613',
    textAlign: 'center',
    flex: 1,
    borderRightWidth: 1,
    borderRightColor: '#3E6613', // קו אנכי בין העמודות
    paddingVertical: 5,
  },
  userRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingRight: 10,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1.2,
    borderBottomColor: '#3E6613',
    width: '100%',
  },
  actionsHeader: {
    width: '20%', // או אפשרות נוספת לרוחב אוטומטי
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
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
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#FF6347',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

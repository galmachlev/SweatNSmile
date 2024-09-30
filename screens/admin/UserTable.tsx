import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';

export default function UserTable() {
  const { users, fetchUsers } = useUser(); 
  const [loading, setLoading] = useState<boolean>(true); 

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      await fetchUsers(); 
      setLoading(false);
    };

    loadUsers(); 
  }, []);

  const renderUser = ({ item }: { item: any }) => (
    <View style={styles.userRow}>
      <Text style={styles.userText}>{item.firstName}</Text>
      <Text style={styles.userText}>{item.lastName}</Text>
      <Text style={styles.userText}>{item.email}</Text>
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
      </View>
      <FlatList
        data={users}
        renderItem={renderUser}
        keyExtractor={(item) => item.user_id} 
      />
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
});

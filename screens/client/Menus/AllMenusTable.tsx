import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Modal, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';

const AllMenusTable = () => {
  const { currentUser } = useUser();
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fetch user menus from the backend
  const fetchUserMenus = async () => {
    if (!currentUser?.email) return;
    setLoading(true);
    setError('');
    try {
      let response = await fetch(`https://database-s-smile.onrender.com/api/users/menus/${currentUser.email}`);
      if (response.ok) {
        let data = await response.json();
        setMenus(data);
      } else {
        setError('Failed to fetch menus.');
      }
    } catch (err) {
      setError('An error occurred while fetching menus.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserMenus();
  }, [currentUser]);

  const handleViewDetails = (menu) => {
    setSelectedMenu(menu);
    setShowModal(true);
  };

  const renderMenuItem = ({ item }) => (
    <View style={styles.menuItem}>
      <Text style={styles.dateText}>{new Date(item.date).toLocaleDateString()}</Text>
      <TouchableOpacity style={styles.detailsButton} onPress={() => handleViewDetails(item)}>
        <Text style={styles.detailsButtonText}>View Details</Text>
        <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
      </TouchableOpacity>
    </View>
  );

    // Function to get the border color based on the meal type
    const getBorderColor = (mealType: string): string => {
      const colors: Record<string, string> = {
        Breakfast: '#FFCE76',
        Lunch: '#F8D675',
        Dinner: '#FDE598',
        Extras: '#E8A54B',
      };
      return colors[mealType] || '#FBF783';
  };

  return (
    <View style={styles.container}>
      <Text style={styles.headerText}>All Your Menus</Text>
      {loading && <ActivityIndicator size="large" color="#3E6613" />}
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {!loading && menus.length === 0 ? <Text style={styles.noMenusText}>No menus found.</Text> : null}
      <FlatList
        data={menus}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.menuId}
        contentContainerStyle={styles.listContainer}
      />
      <Modal visible={showModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <ScrollView>
              <Text style={styles.modalTitle}>Menu Details</Text>

              {selectedMenu && (
                <View>
                  {Object.keys(selectedMenu.meals).map((mealType) => (
                    <View key={mealType} style={[styles.mealSection, { borderColor: getBorderColor(mealType) }]}>
                      <Text style={styles.mealTitle}>{mealType}</Text>
                      {Object.keys(selectedMenu.meals[mealType]).length > 0 ? (
                        Object.entries(selectedMenu.meals[mealType]).map(([category, item]) => (
                          <View key={item.id} style={styles.itemDetails}>
                            <Text style={styles.itemName}>{item.name}</Text>
                            <Text style={styles.itemInfo}>Quantity: {item.quantity}g | Calories: {item.calories} | {"\n"}Protein: {item.protein}g | Fat: {item.fat}g | Carbs: {item.carbs}g</Text>
                          </View>
                        ))
                      ) : (
                        <Text style={styles.noItemsText}>No items added.</Text>
                      )}
                    </View>
                  ))}
                </View>
              )}

              {/* Creation date and time */}
              {selectedMenu && (
                <>
                <Text style={styles.menuDateLabel}>Created at:</Text>
                <Text style={styles.menuDateText}>
                  {new Date(selectedMenu.date).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </Text>
                </>
              )}

              <TouchableOpacity onPress={() => setShowModal(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F9FAFE',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E6613',
    marginBottom: 20,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  dateText: {
    fontSize: 16,
    color: '#696B6D',
  },
  menuDateText: {
    fontSize: 14,
    color: '#3E6613', // צבע ירוק כהה שמותאם לצבעים באפליקציה
    textAlign: 'center',
    marginBottom: 15,
    lineHeight: 20, // להוסיף ריווח בין השורות
  },
  menuDateLabel: {
    marginTop: 20,
    fontSize: 14,
    color: '#3E6613', // צבע ירוק כהה שמותאם לצבעים באפליקציה
    textAlign: 'center',
    fontWeight: 'bold',
  },  
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3E6613',
    padding: 10,
    borderRadius: 5,
  },
  detailsButtonText: {
    color: '#FFF',
    marginRight: 5,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  noMenusText: {
    textAlign: 'center',
    color: '#696B6D',
  },
  listContainer: {
    paddingBottom: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    maxHeight: '80%',
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  mealDetailsContainer: {
    marginBottom: 20,
  },
  mealSection: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 15,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
    borderLeftWidth: 25,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  mealTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#3E6613',
  },
  itemDetails: {
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemInfo: {
    fontSize: 14,
    color: '#696B6D',
  },
  noItemsText: {
    fontSize: 14,
    color: '#696B6D',
    fontStyle: 'italic',
  },
  closeButton: {
    backgroundColor: '#3E6613',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  closeButtonText: {
    color: '#FFF',
    fontWeight: 'bold',
  },
});

export default AllMenusTable;

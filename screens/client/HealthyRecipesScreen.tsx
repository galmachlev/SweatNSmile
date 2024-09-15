import React from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const recipes = [
  { id: '1', title: 'Quinoa Salad', image: require('../../Images/quinoa-salad.jpg') },
  { id: '2', title: 'Chicken Stir-Fry', image: require('../../Images/chicken-salad.jpg') },
  { id: '3', title: 'Avocado Smoothie', image: require('../../Images/green-salad.jpg') },
  { id: '4', title: 'Quinoa Salad', image: require('../../Images/quinoa-salad.jpg') },
  { id: '5', title: 'Chicken Stir-Fry', image: require('../../Images/chicken-salad.jpg') },
  { id: '6', title: 'Avocado Smoothie', image: require('../../Images/green-salad.jpg') },
  { id: '7', title: 'Quinoa Salad', image: require('../../Images/quinoa-salad.jpg') },
  { id: '8', title: 'Chicken Stir-Fry', image: require('../../Images/chicken-salad.jpg') },
  { id: '9', title: 'Avocado Smoothie', image: require('../../Images/green-salad.jpg') },
  // Add more recipes here
];

const RecipeItem = ({ title, image }: { title: string; image: any }) => (
  <View style={styles.recipeItem}>
    <Image source={image} style={styles.recipeImage} />
    <Text style={styles.recipeTitle}>{title}</Text>
  </View>
);

const HealthyRecipesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Healthy Recipes</Text>
      <FlatList
        data={recipes}
        renderItem={({ item }) => <RecipeItem title={item.title} image={item.image}  />}
        keyExtractor={item => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  recipeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  recipeTitle: {
    fontSize: 18,
    color: '#333',
  },
});

export default HealthyRecipesScreen;

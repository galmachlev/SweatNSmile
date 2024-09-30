/*
 * This component is a placeholder for the store feature.
 * It displays a blinking text and a logo image.
 * The blinking animation is done using the `Animated` API.
 */

import React, { useEffect, useRef } from 'react';
import { StyleSheet, View, Text, Animated, Image } from 'react-native';

const StoreComingSoonScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Define the blinking animation for both text and image
    const blinkAnimation = Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 1500,
        useNativeDriver: true,
      }),
    ]);

    // Repeat the blinking animation indefinitely
    Animated.loop(blinkAnimation).start();
  }, [fadeAnim]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../../Images/comingsoon.png')} // Add a relevant image or icon
        style={[styles.image, { opacity: fadeAnim }]}
      />
      <Text style={styles.subText}>We're working hard to bring you something great!</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f4f8', // Light background color
    padding: 20,
  },
  image: {
    width: 250,
    height: 250,
    marginBottom: 20,
    resizeMode: 'contain', // Ensure the image scales correctly
  },
  subText: {
    fontSize: 20,
    color: '#7F8C8D', // Lighter text color for subtitle
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingVertical: 50,
  },
});

export default StoreComingSoonScreen;

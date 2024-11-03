import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ScrollView, Dimensions } from 'react-native';
import { useUser } from '../../../context/UserContext';
import * as Progress from 'react-native-progress';
import { useNavigation } from '@react-navigation/native';

type ChallengeOption = {
  goalType: 'workouts' | 'sleep' | 'activeDays' | 'trySomethingNew';
  label: string;
  description: string;
  image: any;
};

const challengeOptions: ChallengeOption[] = [
  { goalType: 'workouts', label: '3 Workouts', description: 'Complete 3 workouts per week.', image: require('../../../Images/run.png') },
  { goalType: 'sleep', label: 'Sleep Hours', description: 'Sleep X hours each night.', image: require('../../../Images/Sleep.png') },
  { goalType: 'activeDays', label: 'Active Days', description: 'Be active every day this week.', image: require('../../../Images/kik.jpg') },
  { goalType: 'trySomethingNew', label: 'Try new activity', description: 'Try a new activity this week.', image: require('../../../Images/lifting.jpg') },
];

const WeeklyChallenge = () => {
  const { currentUser, updateUserDetails } = useUser();
  const [isChoosingNewChallenge, setIsChoosingNewChallenge] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    const today = new Date();
    // If there's an expired challenge, clear it
    if (currentUser?.weeklyGoals?.[0]?.endDate && new Date(currentUser.weeklyGoals[0].endDate) < today) {
      updateUserDetails(currentUser.email, { weeklyGoals: [] });
      setIsChoosingNewChallenge(true);
    } else {
      // If there's an active challenge, navigate directly to ChallengeDetails
      if (currentUser?.weeklyGoals?.length) {
        navigation.navigate('ChallengeDetails', { goalType: currentUser.weeklyGoals[0].goalType });
      } else {
        setIsChoosingNewChallenge(true);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (!isChoosingNewChallenge) {
      // Automatically navigate back to challenges when active challenge is displayed
      setTimeout(() => {
        setIsChoosingNewChallenge(true);
      }, 0);
    }
  }, [isChoosingNewChallenge]);

  const selectChallenge = (goalType: ChallengeOption['goalType'], targetValue: number) => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const newWeeklyGoal = {
      goalType,
      targetValue,
      progressValue: 0,
      startDate: new Date(),
      endDate,
      isCompleted: false,
    };

    updateUserDetails(currentUser.email, { weeklyGoals: [newWeeklyGoal] });
    setIsChoosingNewChallenge(false);
    navigation.navigate('ChallengeDetails', { goalType });
  };

  const renderChallengeOptions = () => (
    <View>
      <Text style={styles.header}>Choose Your Weekly Challenge</Text>
      <Text style={styles.description}>
        Pick a challenge to motivate yourself this week. Whether it's fitness, sleep, or something new, stay active and reach your goals!
      </Text>

      <View style={styles.challengeGrid}>
        {challengeOptions.map((option) => (
          <TouchableOpacity
            key={option.goalType}
            style={styles.challengeCardWrapper}
            onPress={() => {
              const targetValue = option.goalType === 'workouts' ? 3 : 7;
              selectChallenge(option.goalType, targetValue);
            }}
            activeOpacity={0.9}
          >
            <View style={styles.challengeCard}>
              <Image source={option.image} style={styles.challengeImage} />
              <Text style={styles.challengeLabel}>{option.label}</Text>
              <Text style={styles.challengeDescription}>{option.description}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const renderActiveChallenge = () => {
    const activeChallenge = currentUser?.weeklyGoals?.[0];
    if (!activeChallenge) return null;

    const progress = activeChallenge.progressValue / activeChallenge.targetValue;

    return (
      <View style={styles.activeChallengeContainer}>
        <Text style={styles.changeChallengeButton}>going back to challenges...</Text>
      </View>
    );
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {isChoosingNewChallenge ? renderChallengeOptions() : renderActiveChallenge()}
    </ScrollView>
  );
};

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#3E6613',
    marginBottom: 10,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#6B8E23',
    textAlign: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  challengeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-evenly',
  },
  challengeCardWrapper: {
    width: screenWidth * 0.42,
    marginVertical: 10,
    marginHorizontal: 5,
    borderRadius: 15,
    overflow: 'hidden',
  },
  challengeCard: {
    width: '100%',
    maxHeight: screenWidth * 0.6,
    padding: 10,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 7,
    backgroundColor: '#9AB28B',
    paddingBottom: 20,
  },
  challengeImage: {
    width: '100%',
    height: '70%',
    borderRadius: 10,

  },
  challengeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
    textAlign: 'center',
    marginTop: 5,
  },
  challengeDescription: {
    fontSize: 12,
    color: '#F0F0F0',
    textAlign: 'center',
    marginTop: 5,
  },
  activeChallengeContainer: {
    padding: 20,
    backgroundColor: '#9AB28B',
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  changeChallengeButton: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
});

export default WeeklyChallenge;

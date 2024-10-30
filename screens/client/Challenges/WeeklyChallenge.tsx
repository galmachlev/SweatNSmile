import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useUser } from '../../../context/UserContext';
import * as Progress from 'react-native-progress';

type ChallengeOption = {
  goalType: 'workouts' | 'sleep' | 'activeDays' | 'trySomethingNew';
  label: string;
  description: string;
};

const challengeOptions: ChallengeOption[] = [
  { goalType: 'workouts', label: 'Workouts per week', description: 'Complete X workouts per week.' },
  { goalType: 'sleep', label: 'Sleep Hours', description: 'Sleep X hours each night.' },
  { goalType: 'activeDays', label: 'Active Days', description: 'Be active every day this week.' },
  { goalType: 'trySomethingNew', label: 'Try Something New', description: 'Try a new activity this week.' },
];

export default function WeeklyChallenge() {
  const { currentUser, updateUserDetails } = useUser();
  const [isChoosingNewChallenge, setIsChoosingNewChallenge] = useState(false);

  useEffect(() => {
    const today = new Date();
    if (currentUser?.weeklyGoals?.[0]?.endDate && new Date(currentUser.weeklyGoals[0].endDate) < today) {
      updateUserDetails(currentUser.email, { weeklyGoals: [] });
      setIsChoosingNewChallenge(true);
    } else {
      setIsChoosingNewChallenge(!currentUser?.weeklyGoals?.length);
    }
  }, [currentUser]);

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
  };

  const addWorkout = () => {
    const updatedWeeklyGoals = currentUser?.weeklyGoals?.map((goal) => {
      if (goal.goalType === 'workouts') {
        const newProgress = goal.progressValue + 1;
        const isCompleted = newProgress >= goal.targetValue;
        return { ...goal, progressValue: newProgress, isCompleted };
      }
      return goal;
    });

    updateUserDetails(currentUser.email, { weeklyGoals: updatedWeeklyGoals });
  };

  const changeChallenge = () => {
    Alert.alert(
      'Change Challenge',
      'Are you sure you want to change your current weekly challenge?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Yes', onPress: () => setIsChoosingNewChallenge(true) },
      ],
      { cancelable: true }
    );
  };

  const renderChallengeOptions = () => (
    <View>
      <Text style={styles.header}>Choose Your Weekly Challenge</Text>
      {challengeOptions.map((option) => (
        <TouchableOpacity
          key={option.goalType}
          style={styles.challengeOption}
          onPress={() => {
            const targetValue = option.goalType === 'workouts' ? 3 : 7; // Example values
            selectChallenge(option.goalType, targetValue);
          }}
        >
          <Text style={styles.optionLabel}>{option.label}</Text>
          <Text style={styles.optionDescription}>{option.description}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderActiveChallenge = () => {
    const activeChallenge = currentUser?.weeklyGoals?.[0];
    if (!activeChallenge) return null;

    const progress = activeChallenge.progressValue / activeChallenge.targetValue;

    const getChallengeStyles = () => {
      switch (activeChallenge.goalType) {
        case 'workouts':
          return {
            container: styles.workoutContainer,
            header: 'Complete Your Workouts',
            description: `Complete ${activeChallenge.targetValue} workouts this week.`,
          };
        case 'sleep':
          return {
            container: styles.sleepContainer,
            header: 'Track Your Sleep',
            description: `Sleep ${activeChallenge.targetValue} hours each night.`,
          };
        case 'activeDays':
          return {
            container: styles.activeDaysContainer,
            header: 'Be Active Daily',
            description: `Stay active every day this week.`,
          };
        case 'tryNew':
          return {
            container: styles.tryNewContainer,
            header: 'Try Something New',
            description: `Try a new activity this week.`,
          };
        default:
          return {};
      }
    };

    const { container, header, description } = getChallengeStyles();

    return (
      <View style={[styles.baseContainer, container]}>
        <Text style={styles.header}>{header}</Text>
        <Text style={styles.challengeText}>{description}</Text>

        <Text style={styles.progressText}>
          Progress: {activeChallenge.progressValue} / {activeChallenge.targetValue}
        </Text>

        {/* Progress Bar */}
        <Progress.Bar
          progress={progress}
          width={null}
          height={10}
          color="#4CAF50"
          unfilledColor="#C8E6C9"
          borderRadius={5}
          style={styles.progressBar}
        />

        {activeChallenge.goalType === 'workouts' && !activeChallenge.isCompleted && (
          <TouchableOpacity style={styles.logWorkoutButton} onPress={addWorkout}>
            <Text style={styles.buttonText}>Log Workout</Text>
          </TouchableOpacity>
        )}

        {activeChallenge.isCompleted && <Text style={styles.completedText}>Challenge Completed!</Text>}

        {/* "Change Challenge" Button */}
        <View style={styles.changeChallengeContainer}>
          <Text style={styles.changeChallengeText}>Don't want this challenge anymore?</Text>
          <TouchableOpacity onPress={changeChallenge}>
            <Text style={styles.changeChallengeButton}>Change Weekly Challenge</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {isChoosingNewChallenge ? renderChallengeOptions() : renderActiveChallenge()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#3E6613',
    marginBottom: 15,
  },
  challengeOption: {
    padding: 15,
    backgroundColor: '#9AB28B',
    borderRadius: 10,
    marginBottom: 10,
  },
  optionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#3E6613',
  },
  optionDescription: {
    fontSize: 14,
    color: '#3E6613',
  },
  baseContainer: {
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
  },
  workoutContainer: {
    backgroundColor: '#D1C4E9',
  },
  sleepContainer: {
    backgroundColor: '#B3E5FC',
  },
  activeDaysContainer: {
    backgroundColor: '#C8E6C9',
  },
  tryNewContainer: {
    backgroundColor: '#FFCDD2',
  },
  challengeText: {
    fontSize: 18,
    color: '#3E6613',
    textAlign: 'center',
    marginBottom: 10,
  },
  progressText: {
    fontSize: 16,
    color: '#3E6613',
  },
  progressBar: {
    marginTop: 10,
    width: '80%',
  },
  logWorkoutButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  completedText: {
    fontSize: 18,
    color: '#4CAF50',
    marginTop: 20,
    fontWeight: 'bold',
  },
  changeChallengeContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  changeChallengeText: {
    fontSize: 14,
    color: '#3E6613',
    marginBottom: 5,
  },
  changeChallengeButton: {
    color: '#FF6347',
    fontWeight: 'bold',
  },
});

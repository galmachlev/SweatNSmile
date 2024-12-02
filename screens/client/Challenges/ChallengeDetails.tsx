import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground, Dimensions, ScrollView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import { useUser } from '../../../context/UserContext';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Card, Title, Paragraph, Menu } from 'react-native-paper';
import * as Progress from 'react-native-progress';
import Icon from 'react-native-vector-icons/Ionicons';

//אופציות של אימונים 
const workoutTypes = [
  'Strength Training',
  'Cardio',
  'HIIT (High-Intensity Interval Training)',
  'Yoga',
  'Pilates',
  'CrossFit',
  'Bodyweight Training',
  'Dance (e.g., Zumba)',
  'Circuit Training',
  'Martial Arts',
  'Other',
];

// ימי השבוע למעקב אחר פעילות יומית
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// רשימת פעילויות חדשות שהמשתמש יכול לבחור לנסות
const activities = [
  { name: 'Zumba', description: 'A fun and energetic dance workout to lively music.', icon: 'musical-notes' },
  { name: 'Kickboxing', description: 'A high-energy workout involving punches and kicks.', icon: 'fitness' },
  { name: 'Swimming', description: 'A refreshing, full-body workout that’s easy on the joints.', icon: 'water' },
  { name: 'Rock Climbing', description: 'A challenging activity to build strength and endurance.', icon: 'trail-sign' },
  { name: 'Yoga', description: 'A relaxing way to improve flexibility and mindfulness.', icon: 'leaf' },
  { name: 'Cycling', description: 'A great cardio workout that can be done outdoors or at the gym.', icon: 'bicycle' },
  { name: 'Hiking', description: 'Enjoy the outdoors while getting a workout by exploring nature.', icon: 'walk' },
  { name: 'Dancing', description: 'An enjoyable way to stay fit and learn new moves.', icon: 'people-circle' },
  { name: 'Pilates', description: 'Focuses on core strength and flexibility.', icon: 'body' },
  { name: 'Running', description: 'A simple but effective way to improve cardiovascular fitness.', icon: 'walk' },
];

// הרכיב הראשי של המסך שמציג את פרטי האתגר
const ChallengeDetails = ({ route }) => {
  const { currentUser, updateUserDetails } = useUser();
  const { goalType } = route.params;
  const navigation = useNavigation();
  const challenge = currentUser?.weeklyGoals?.find((goal) => goal.goalType === goalType);

  const [selectedWorkoutType, setSelectedWorkoutType] = useState('');
  const [otherWorkout, setOtherWorkout] = useState('');
  const [dailySleep, setDailySleep] = useState('');
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [isMarkedAsTried, setIsMarkedAsTried] = useState(false);

  if (!challenge) {
    return <Text style={styles.errorText}>Loading challenge...</Text>;
  }

  // פונקציה להחלפת אתגר (עם אזהרה על איבוד התקדמות)
  const handleSwitchChallenge = () => {
    Alert.alert(
      "Switch Challenge",
      "Are you sure you want to switch challenges? This will erase your current challenge progress.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Yes, switch challenge",
          onPress: () => navigation.navigate('WeeklyChallenge'),
        },
      ]
    );
  };

    // פונקציה לסימון יום פעילות
  const handleDayToggle = (dayIndex) => {
    const updatedDays = [...(challenge.activeDays || Array(7).fill(false))];
    updatedDays[dayIndex] = !updatedDays[dayIndex];
    const progressValue = updatedDays.filter(Boolean).length;

      // עדכון רשימת האתגרים עם השינויים
    const updatedWeeklyGoals = currentUser.weeklyGoals.map((goal) =>
      goal.goalType === goalType
        ? { ...goal, activeDays: updatedDays, progressValue }
        : goal
    );

    updateUserDetails(currentUser.email, { weeklyGoals: updatedWeeklyGoals });
  };

  // פונקציה לשליחת סוג האימון הנבחר
  const handleWorkoutSubmit = () => {
    const workoutEntry = {
      date: new Date(),
      type: selectedWorkoutType === 'Other' ? otherWorkout : selectedWorkoutType,
    };

    const updatedWeeklyGoals = currentUser.weeklyGoals.map((goal) =>
      goal.goalType === goalType
        ? {
            ...goal,
            progressValue: goal.progressValue + 1,
            workoutEntries: [...(goal.workoutEntries || []), workoutEntry],
          }
        : goal
    );

    updateUserDetails(currentUser.email, { weeklyGoals: updatedWeeklyGoals });
    setSelectedWorkoutType('');
    setOtherWorkout('');
  };


  // פונקציה להזנת שעות השינה
  const handleSleepInput = () => {
    const newSleepEntry = { date: new Date(), hours: parseFloat(dailySleep) };
    const updatedWeeklyGoals = currentUser.weeklyGoals.map((goal) =>
      goal.goalType === goalType
        ? {
            ...goal,
            progressValue: goal.progressValue + newSleepEntry.hours,
            sleepEntries: [...(goal.sleepEntries || []), newSleepEntry],
          }
        : goal
    );

    updateUserDetails(currentUser.email, { weeklyGoals: updatedWeeklyGoals });
    setDailySleep('');
    Keyboard.dismiss();
  };

    // פונקציה לבחירת פעילות לניסיון חדש
  const handleActivitySelect = (activity) => {
    setSelectedActivity(activity);
  };

    // סימון הפעילות כבוצעה
  const handleMarkAsTried = () => {
    const updatedWeeklyGoals = currentUser.weeklyGoals.map((goal) =>
      goal.goalType === goalType ? { ...goal, isCompleted: true } : goal
    );

    updateUserDetails(currentUser.email, { weeklyGoals: updatedWeeklyGoals });
    setIsMarkedAsTried(true);
  };

    // שליחת משוב על פעילות
  const handleFeedbackSubmit = () => {
    Alert.alert("Thank you for your feedback!");
    setFeedback('');
    Keyboard.dismiss();
  };

    // פונקציות לרינדור התוכן לפי סוג האתגר
  const renderWorkoutContent = () => (
    <>
      <Paragraph style={styles.description}>
        Complete {challenge.targetValue} workouts this week. You're almost there, keep it up!
      </Paragraph>

      <View style={styles.horizontalContainer}>
        <Menu
          visible={isMenuVisible}
          onDismiss={() => setIsMenuVisible(false)}
          anchor={
            <Button onPress={() => setIsMenuVisible(true)} mode="outlined" style={styles.dropdownButton}>
              {selectedWorkoutType || 'Select Workout Type'}
            </Button>
          }
        >
          {workoutTypes.map((type, index) => (
            <Menu.Item
              key={index}
              onPress={() => {
                setSelectedWorkoutType(type);
                setIsMenuVisible(false);
              }}
              title={type}
            />
          ))}
        </Menu>

        <Button
          mode="contained"
          onPress={handleWorkoutSubmit}
          disabled={!selectedWorkoutType || (selectedWorkoutType === 'Other' && !otherWorkout)}
          style={[styles.logButton, { flex: 1 }]}
          labelStyle={{ color: 'white' }}
        >
          Submit
        </Button>
      </View>

      {selectedWorkoutType === 'Other' && (
        <TextInput
          mode="outlined"
          label="Specify Workout"
          value={otherWorkout}
          onChangeText={setOtherWorkout}
          style={styles.input}
        />
      )}

      <Card style={styles.logContainer}>
        <Card.Content>
          <Title style={styles.logTitle}>Workout Log</Title>
          <ScrollView>
            {challenge.workoutEntries?.map((entry, index) => (
              <Paragraph key={index} style={styles.logText}>
                {new Date(entry.date).toLocaleDateString()}: {entry.type}
              </Paragraph>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </>
  );

  // אתגר שינה
  const renderSleepContent = () => (
    <>
      <Paragraph style={styles.description}>
        Aim to sleep {challenge.targetValue} hours each night. Track your sleep hours for this week!
      </Paragraph>
      <View style={styles.horizontalContainer}>
        <TextInput
          mode="outlined"
          label="Hours slept last night"
          keyboardType="numeric"
          value={dailySleep}
          onChangeText={setDailySleep}
          style={styles.input}
        />
        <Button
          mode="contained"
          onPress={handleSleepInput}
          style={[styles.logButton, { flex: 0.5 }]}
          labelStyle={{ color: 'white' }}
        >
          Submit
        </Button>
      </View>
      <Card style={styles.logContainer}>
        <Card.Content>
          <Title style={styles.logTitle}>Sleep Log</Title>
          <ScrollView>
            {challenge.sleepEntries?.map((entry, index) => (
              <Paragraph key={index} style={styles.logText}>
                {new Date(entry.date).toLocaleDateString()}: {entry.hours} hours
              </Paragraph>
            ))}
          </ScrollView>
        </Card.Content>
      </Card>
    </>
  );

  // ימים פעילים
  const renderActiveDaysContent = () => (
    <>
      <Paragraph style={styles.description}>
        Stay active every day this week! Mark each active day to track your progress.
      </Paragraph>
      <View style={styles.weekContainer}>
        {daysOfWeek.map((day, index) => (
          <DayCheckbox
            key={index}
            day={day}
            isActive={challenge.activeDays?.[index]}
            onToggle={() => handleDayToggle(index)}
          />
        ))}
      </View>
    </>
  );

  // אתגר נסה משהו חדש
  const renderTrySomethingNewContent = () => (
    <>
      <Paragraph style={styles.description}>
        Try something new this week! Whether it's zumba, kickboxing, or another activity, have fun and stay motivated!
      </Paragraph>

      {!isMarkedAsTried ? (
        <>
          <ScrollView horizontal style={styles.activityContainer}>
            {activities.map((activity, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.activityButton,
                  selectedActivity === activity && styles.selectedActivityButton,
                ]}
                onPress={() => handleActivitySelect(activity)}
              >
                <Icon name={activity.icon} size={24} color={selectedActivity === activity ? '#FFF' : '#4CAF50'} />
                <Text style={selectedActivity === activity ? styles.selectedActivityText : styles.activityText}>
                  {activity.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {selectedActivity && (
            <>
              <Text style={styles.activityDescription}>
                {selectedActivity.description}
              </Text>
              <Button
                mode="contained"
                onPress={handleMarkAsTried}
                style={styles.primaryButton}
                labelStyle={{ color: 'white' }}
              >
                Mark as Tried
              </Button>
            </>
          )}
        </>
      ) : (
        <>
          <View style={styles.completedMessageContainer}>
            <Text style={styles.completedText}>Activity Completed! Great job!</Text>
          </View>
          <TextInput
            mode="outlined"
            label="How was your experience?"
            value={feedback}
            onChangeText={setFeedback}
            style={styles.feedbackInput}
            placeholder="Share a quick feedback"
            onBlur={() => Keyboard.dismiss()}
          />
          <Button mode="contained" onPress={handleFeedbackSubmit} style={styles.primaryButton}>
            Submit Feedback
          </Button>
        </>
      )}
    </>
  );

  
  const renderChallengeContent = () => {
    switch (goalType) {
      case 'workouts':
        return renderWorkoutContent();
      case 'sleep':
        return renderSleepContent();
      case 'activeDays':
        return renderActiveDaysContent();
      case 'trySomethingNew':
        return renderTrySomethingNewContent();
      default:
        return null;
    }
  };

  return (
    <ImageBackground
      source={
        goalType === 'sleep'
          ? require('../../../Images/Sleep.png')
          : goalType === 'activeDays'
          ? require('../../../Images/kik.jpg')
          : goalType === 'trySomethingNew'
          ? require('../../../Images/lifting.jpg')
          : require('../../../Images/run.png')
      }
      style={styles.background}
      imageStyle={{ opacity: 0.7 }}
    >
      <View style={styles.container}>
        <Text style={styles.header}>
          {goalType === 'workouts' && 'Complete 3 workouts this week'}
          {goalType === 'sleep' && 'Your Weekly Sleep Challenge'}
          {goalType === 'activeDays' && 'Your Weekly Active Days Challenge'}
          {goalType === 'trySomethingNew' && 'Try a new activity this week!'}
        </Text>

        {(goalType === 'workouts' || goalType === 'sleep') && (
          <Progress.Circle
            size={150}
            progress={challenge.progressValue / challenge.targetValue}
            showsText
            thickness={10}
            color="#4CAF50"
            unfilledColor="#C8E6C9"
            borderWidth={0}
            style={styles.progressCircle}
          />
        )}

        <Text style={styles.progressText}>
          Progress: {challenge.progressValue} / {challenge.targetValue}
        </Text>

        {renderChallengeContent()}

        <Button
          mode="outlined"
          onPress={handleSwitchChallenge}
          style={styles.backButton}
        >
          I want to switch challenge
        </Button>
      </View>
    </ImageBackground>
  );
};

const DayCheckbox = ({ day, isActive, onToggle }) => (
  <TouchableOpacity onPress={onToggle} style={[styles.dayCheckbox, isActive && styles.activeDay]}>
    <Text style={styles.dayText}>{day}</Text>
  </TouchableOpacity>
);

const screenWidth = Dimensions.get('window').width;

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  description: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 20,
  },
  progressCircle: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  horizontalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: screenWidth * 0.8,
    marginBottom: 20,
  },
  dropdownButton: {
    flex: 1,
    marginRight: 10,
    borderColor: '#FFF',
    borderWidth: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  logButton: {
    backgroundColor: '#4CAF50',
    flex: 1,
    borderRadius: 5,
  },
  input: {
    flex: 1,
    marginRight: 10,
    backgroundColor: '#FFF',
  },
  logContainer: {
    width: screenWidth * 0.8,
    maxHeight: 200,
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 10,
    marginVertical: 10,
  },
  logTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#4CAF50',
    textAlign: 'center',
    marginBottom: 5,
  },
  logText: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  weekContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: screenWidth * 0.8,
    marginBottom: 20,
  },
  dayCheckbox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  activeDay: {
    backgroundColor: '#4CAF50',
  },
  dayText: {
    color: '#FFF',
    fontSize: 14,
  },
  primaryButton: {
    backgroundColor: '#4CAF50',
    width: screenWidth * 0.6,
    marginBottom: 20,
    color: '#FFF',
  },
  activityContainer: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  activityButton: {
    backgroundColor: '#FFF',
    padding: 10,
    borderRadius: 20,
    marginHorizontal: 5,
    borderWidth: 3,
    borderColor: '#4CAF50',
    alignItems: 'center',
    width: screenWidth * 0.40,
    height: 150,
  },
  selectedActivityButton: {
    backgroundColor: '#4CAF50',
  },
  activityText: {
    color: '#4CAF50',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  selectedActivityText: {
    color: '#FFF',
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  activityDescription: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
    marginVertical: 10,
    paddingHorizontal: 20,
  },
  feedbackInput: {
    width: screenWidth * 0.8,
    marginVertical: 10,
    backgroundColor: '#FFF',
  },
  completedMessageContainer: {
    marginBottom: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4CAF50',
    borderRadius: 10,
  },
  completedText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: 'bold',
  },
  backButton: {
    borderColor: '#4CAF50',
    borderWidth: 1,
    width: screenWidth * 0.6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginTop: 20,
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ChallengeDetails;

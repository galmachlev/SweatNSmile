// import React, { useEffect, useState } from 'react';
// import { View, StyleSheet, ActivityIndicator, Alert } from 'react-native';
// import { GiftedChat, IMessage } from 'react-native-gifted-chat';
// import axios from 'axios';
// import axiosRetry from 'axios-retry';

// const DailyFact: React.FC = () => {
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const [loading, setLoading] = useState<boolean>(true);
//   const OPENAI_API_KEY = "sk-proj-f09oE2vrxyPbmWLzLFdZT3BlbkFJbwZDGa7xpvCHlZmt3UWZ";

//   useEffect(() => {
//     const fetchDailyFact = async () => {
//       // הגדרת התצורה של retry-axios
//       axiosRetry(axios, {
//         retries: 3, // מספר הניסיונות מחדש
//         retryDelay: (retryCount: number) => retryCount * 2000, // זמן ההשהיה בין הניסיונות מחדש (2 שניות)
//         retryCondition: (error: any) => axiosRetry.isNetworkOrIdempotentRequestError(error), // תנאי לנסיון מחדש
//       });

//       try {
//         const response = await axios.post(
//           'https://api.openai.com/v1/chat/completions',
//           {
//             model: 'gpt-3.5-turbo',
//             messages: [
//               { role: 'system', content: 'You are a helpful assistant.' },
//               { role: 'user', content: 'Provide a fact about food that is up to 25 words long.' },
//             ],
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${OPENAI_API_KEY}`,
//               'Content-Type': 'application/json',
//             },
//           }
//         );

//         const assistantMessage = response.data.choices[0].message.content;

//         setMessages([
//           {
//             _id: 1,
//             text: assistantMessage,
//             createdAt: new Date(),
//             user: {
//               _id: 2,
//               name: 'ChatGPT',
//               avatar: 'https://placeimg.com/140/140/any',
//             },
//           },
//         ]);
//       } catch (error) {
//         console.error('Error fetching daily fact:', error);
//         Alert.alert('Error', 'Failed to fetch daily fact. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDailyFact();
//   }, []);

//   return (
//     <View style={styles.container}>
//       {loading ? (
//         <ActivityIndicator size="large" color="#0000ff" />
//       ) : (
//         <GiftedChat
//           messages={messages}
//           user={{ _id: 1 }}
//         />
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#f9f9f9',
//   },
// });

// export default DailyFact;

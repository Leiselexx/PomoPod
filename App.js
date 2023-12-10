import { StatusBar } from 'expo-status-bar';
import { StyleSheet, ImageBackground, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen.js';
import HomeScreen from './HomeScreen.js';
import NotesScreen from './NotesScreen.js';
import Sidebar from './Sidebar'; // Import the Sidebar component



const Stack = createStackNavigator();

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time with setTimeout
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000); // Adjust the time as needed

    // Clear the timer if the component is unmounted
    return () => clearTimeout(timer);
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoadingScreen" headerMode="none">
        {isLoading ? (
          <Stack.Screen name="LoadingScreen" component={LoadingScreen} />
        ) : (
          <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="HomeScreen" component={HomeScreen} />
          <Stack.Screen name="NotesScreen" component={NotesScreen} /> 
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const LoadingScreen = () => {
  return (
    <ImageBackground
      source={require('./background5.jpg')}
      style={styles.container}
    >
      <Image source={require('./whale.png')} style={styles.whale} />
      <StatusBar style="auto" />
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: 'cover',
  },
  whale: {
    width: 200,
    resizeMode: 'contain',
    alignSelf: 'center',
  },
});
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation hook



const LoginScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation(); // Use the useNavigation hook to get the navigation prop


  const handleLogin = () => {
    const tempUsername = 'gale'; // Temporary username
    const tempPassword = 'ey'; // Temporary password

    // Check if the entered username and password match the temporary credentials
    if (username === tempUsername && password === tempPassword) {
        console.log('EYYYYYY');
        navigation.navigate('HomeScreen');
      // Navigate to the home page or any other screen
      //navigation.navigate('HomeScreen'); // Replace 'HomeScreen' with the actual name of your home screen
    } else {
      // Display an error message or handle the failed login attempt
      console.log('Invalid credentials');
    }
  };

  return (
    <View style={styles.container}>
        <View style = {styles.circle}>
      <Image source= {require('./whale.png')} style={styles.whale}/>
      </View>
      <Text style={styles.title}>LOG IN</Text>
      <StatusBar style="auto" />
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => setPassword(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E0F0FF'
  },
  title: {
    fontSize: 50,
    marginBottom: 16,
    marginTop: 10,
    color: '#517191'
  },
  whale: {
    width: 150,
    resizeMode: 'contain',
  },
  input: {
    width: '80%',
    height: 40,
    borderColor: '#72AEEA',
    borderWidth: 2,
    marginBottom: 16,
    paddingHorizontal: 10,
    borderRadius: 10
  },
  button: {
    backgroundColor: '#72AEEA',
    padding: 10,
    borderRadius: 20,
    width: 100
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center'
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: '#72AEEA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    borderStyle: 'dashed',
    
  }
});

export default LoginScreen;
/* Ellipse 1 */

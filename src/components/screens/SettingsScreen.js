import React from 'react'
import {
  TouchableOpacity,
  TouchableWithoutFeedback,
  StyleSheet,
  Text,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  View,
  Alert
} from 'react-native'

import {
  Container,
  Item,
  Input
} from 'native-base'

import { Ionicons } from '@expo/vector-icons';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'
import Feather from '@expo/vector-icons/Feather';

export default class SettingsScreen extends React.Component {
  state = {
    password1: '',
    password2: '',
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  // Change user password for the app
  changePassword = async () => {
    const { password1, password2 } = this.state
    await Auth.currentAuthenticatedUser()
      .then(user => {
        return Auth.changePassword(user, password1, password2)
      })
      .then(data => console.log('Password changed successfully', data))
      .catch(err => {
        if (!err.message) {
          console.log('Error changing password: ', err)
          Alert.alert('Error changing password: ', err)
        } else {
          console.log('Error changing password: ', err.message)
          Alert.alert('Error changing password: ', err.message)
        }
      })
  }
  // Sign out from the app
  signOutAlert = async () => {
    await Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out from the app?',
      [
        { text: 'Cancel', onPress: () => console.log('Canceled'), style: 'cancel' },
        { text: 'OK', onPress: () => this.signOut() },
      ],
      { cancelable: false }
    )
  }
  signOut = async () => {
    await Auth.signOut()
      .then(() => {
        console.log('Sign out complete')
        this.props.navigation.navigate('Authloading')
      })
      .catch(err => console.log('Error while signing out!', err))
  }
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>
          <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
            <View style={styles.container}>
              {/*Infos*/}
              <Container style={styles.infoContainer}>
                <View style={styles.container}>
                  <View style={{ borderRadius: 4, marginBottom: 20 }}>
                    <Text style={{ fontSize: 21 }}>Change your password</Text>
                  </View>
                  {/* Old password */}
                  <Item style={styles.itemStyle}>
                    <Feather style={styles.iconStyle} name="lock" />
                    <Input
                      style={styles.input}
                      placeholder='Old password'
                      placeholderTextColor='#adb4bc'
                      returnKeyType='next'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                      onChangeText={value => this.onChangeText('password1', value)}
                    />
                  </Item>
                  {/* New password */}
                  <Item style={styles.itemStyle}>
                    <Feather style={styles.iconStyle} name="lock" />
                    <Input
                      style={styles.input}
                      placeholder='New password'
                      placeholderTextColor='#adb4bc'
                      returnKeyType='go'
                      autoCapitalize='none'
                      autoCorrect={false}
                      secureTextEntry={true}
                      ref='SecondInput'
                      onChangeText={value => this.onChangeText('password2', value)}
                    />
                  </Item>
                  <TouchableOpacity
                    onPress={this.changePassword}
                    style={styles.buttonStyle}>
                    <Text style={styles.buttonTextStyle}>
                      Submit
                    </Text>
                  </TouchableOpacity>
                  <View
                    style={styles.signOutButton} />
                  <TouchableOpacity
                    style={[styles.signOutButtonStyle, { flexDirection: 'row', justifyContent: 'center' }]}
                    onPress={this.signOutAlert}>
                    <Ionicons
                      name="md-power"
                      style={{ color: '#666', marginRight: 10, fontSize: 24 }}
                    />
                    <Text style={styles.signOutButtonTextStyle}>
                      Sign out
                    </Text>
                  </TouchableOpacity>
                </View>
              </Container>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#666',
  },
  infoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 600,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
    backgroundColor: '#fff',
  },
  itemStyle: {
    marginTop: 20,
  },
  iconStyle: {
    color: '#666',
    fontSize: 24,
    marginRight: 15
  },
  buttonStyle: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#1F28CF',
    borderRadius: 99,
    marginTop: 25
  },
  signOutButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40
  },
  signOutButtonStyle: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 99,
  },
  signOutButtonTextStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#666'
  },
  buttonTextStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff'
  },
  textStyle: {
    fontWeight: '700',
    fontSize: 14,
    padding: 10,
    color: '#fff'
  },
})

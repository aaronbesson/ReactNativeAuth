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
  Alert,
  Animated
} from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import {
  Container,
  Item,
  Input
} from 'native-base'

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

// Load the app logo
const logo = require('../images/logo.png')

export default class ForgetPasswordScreen extends React.Component {
  state = {
    username: '',
    authCode: '',
    newPassword: '',
    fadeIn: new Animated.Value(0),  // Initial value for opacity: 0
    fadeOut: new Animated.Value(1),  // Initial value for opacity: 1
    isHidden: false
  }
  componentDidMount() {
    this.fadeIn()
  }
  fadeIn() {
    Animated.timing(
      this.state.fadeIn,
      {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true
      }
    ).start()
    this.setState({ isHidden: true })
  }
  fadeOut() {
    Animated.timing(
      this.state.fadeOut,
      {
        toValue: 0,
        duration: 1000,
        useNativeDriver: true
      }
    ).start()
    this.setState({ isHidden: false })
  }
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  // Request a new password
  async forgotPassword() {
    const { username } = this.state
    await Auth.forgotPassword(username)
      .then(data => console.log('New code sent', data))
      .catch(err => {
        if (!err.message) {
          console.log('Error while setting up the new password: ', err)
          Alert.alert('Error while setting up the new password: ', err)
        } else {
          console.log('Error while setting up the new password: ', err.message)
          Alert.alert('Error while setting up the new password: ', err.message)
        }
      })
  }
  // Upon confirmation redirect the user to the Sign In page
  async forgotPasswordSubmit() {
    const { username, authCode, newPassword } = this.state
    await Auth.forgotPasswordSubmit(username, authCode, newPassword)
      .then(() => {
        this.props.navigation.navigate('SignIn')
        console.log('the New password submitted successfully')
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error while confirming the new password: ', err)
          Alert.alert('Error while confirming the new password: ', err)
        } else {
          console.log('Error while confirming the new password: ', err.message)
          Alert.alert('Error while confirming the new password: ', err.message)
        }
      })
  }
  render() {
    let { fadeOut, fadeIn, isHidden } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar />
        <KeyboardAvoidingView
          style={{ flex: 1, padding: 20, }}
          behavior='padding'
          enabled
          keyboardVerticalOffset={23}>
          <TouchableWithoutFeedback style={{ flex: 1, }} onPress={Keyboard.dismiss}>
            <View style={{ flex: 1 }}>
              {/* Infos */}
              {/* Username */}
              <Item style={styles.itemStyle}>
                <Ionicons name="ios-person" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder='Username'
                  placeholderTextColor='#adb4bc'
                  keyboardType={'email-address'}
                  returnKeyType='go'
                  autoCapitalize='none'
                  autoCorrect={false}
                  onChangeText={value => this.onChangeText('username', value)}
                  onFocus={this.fadeOut.bind(this)}
                  onEndEditing={this.fadeIn.bind(this)}
                />
              </Item>
              <TouchableOpacity
                onPress={() => this.forgotPassword()}
                style={styles.buttonStyle}>
                <Text style={styles.buttonText}>
                  Send Code
                    </Text>
              </TouchableOpacity>
              {/* the New password section  */}
              <Item style={styles.itemStyle}>
                <Ionicons name="ios-lock" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder='New password'
                  placeholderTextColor='#adb4bc'
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={true}
                  onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                  onChangeText={value => this.onChangeText('newPassword', value)}
                  onFocus={this.fadeOut.bind(this)}
                  onEndEditing={this.fadeIn.bind(this)}
                />
              </Item>
              {/* Code confirmation section  */}
              <Item style={styles.itemStyle}>
                <Ionicons name="md-apps" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder='Confirmation code'
                  placeholderTextColor='#adb4bc'
                  keyboardType={'numeric'}
                  returnKeyType='done'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={false}
                  ref='SecondInput'
                  onChangeText={value => this.onChangeText('authCode', value)}
                  onFocus={this.fadeOut.bind(this)}
                  onEndEditing={this.fadeIn.bind(this)}
                />
              </Item>
              <TouchableOpacity
                onPress={() => this.forgotPasswordSubmit()}
                style={styles.buttonStyle}>
                <Text style={styles.buttonText}>
                  Confirm the new password
                    </Text>
              </TouchableOpacity>

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
    flexDirection: 'column'
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#646464',
  },
  itemStyle: {
    marginBottom: 10,
  },
  iconStyle: {
    color: '#666',
    fontSize: 28,
    marginRight: 15
  },
  buttonStyle: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#1F28CF',
    borderRadius: 99,
  },
  greyButtonStyle: {
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 10,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#cecece',
    borderRadius: 99,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    padding: 10,
    color: "#fff",
  },
  textStyle: {
    padding: 5,
    fontSize: 14,
    color: '#646464',
    fontWeight: 'bold'
  },
  countryStyle: {
    flex: 1,
    backgroundColor: '#5059ae',
    borderTopColor: '#211f',
    borderTopWidth: 1,
    padding: 12,
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#b44666',
  },
  leftButton: {
    width: '50%',
    alignItems: 'center'
  },
  rightButton: {
    width: '50%',
    alignItems: 'center'
  }
})

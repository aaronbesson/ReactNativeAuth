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
  Image,
  View,
  Alert,
  Modal,
  Platform,
  FlatList,
  ScrollView,
  Animated,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import {
  Container,
  Item,
  Input
} from 'native-base'

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

// Import data for countries
import data from '../countriesData'
import Feather from '@expo/vector-icons/Feather';

// Load the app logo
const logo = require('../images/logo.png')

// Default render of country flag
const defaultFlag = data.filter(
  obj => obj.name === 'Trinidad and Tobago'
)[0].flag

// Default render of country code
const defaultCode = data.filter(
  obj => obj.name === 'Trinidad and Tobago'
)[0].dial_code

export default class SignUpScreen extends React.Component {
  state = {
    username: '',
    password: '',
    email: '',
    phoneNumber: '',
    fadeIn: new Animated.Value(0),  // Initial value for opacity: 0
    fadeOut: new Animated.Value(1),  // Initial value for opacity: 1
    isHidden: false,
    flag: defaultFlag,
    modalVisible: false,
    authCode: '',
  }
  // Get user input
  onChangeText(key, value) {
    this.setState({
      [key]: value
    })
  }
  // Methods for logo animation
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
  // Functions for Phone Input
  showModal() {
    this.setState({ modalVisible: true })
    // console.log('Shown')
  }
  hideModal() {
    this.setState({ modalVisible: false })
    // refocus on phone Input after selecting country and/or closing Modal
    this.refs.FourthInput._root.focus()
    // console.log('Hidden')
  }
  async getCountry(country) {
    const countryData = await data
    try {
      const countryCode = await countryData.filter(
        obj => obj.name === country
      )[0].dial_code
      const countryFlag = await countryData.filter(
        obj => obj.name === country
      )[0].flag
      // Set data from user choice of country
      this.setState({ phoneNumber: countryCode, flag: countryFlag })
      await this.hideModal()
    }
    catch (err) {
      console.log(err)
    }
  }
  // Sign up user with AWS Amplify Auth
  async signUp() {
    const { username, password, email, phoneNumber } = this.state
    // rename variable to conform with Amplify Auth field phone attribute
    const phone_number = phoneNumber
    await Auth.signUp({
      username,
      password,
      attributes: { email, phone_number }
    })
      .then(() => {
        console.log('sign up successful!')
        Alert.alert('Enter the confirmation code you received.')
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when signing up: ', err)
          Alert.alert('Error when signing up: ', err)
        } else {
          console.log('Error when signing up: ', err.message)
          Alert.alert('Error when signing up: ', err.message)
        }
      })
  }
  // Confirm users and redirect them to the SignIn page
  async confirmSignUp() {
    const { username, authCode } = this.state
    await Auth.confirmSignUp(username, authCode)
      .then(() => {
        this.props.navigation.navigate('SignIn')
        console.log('Confirm sign up successful')
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when entering confirmation code: ', err)
          Alert.alert('Error when entering confirmation code: ', err)
        } else {
          console.log('Error when entering confirmation code: ', err.message)
          Alert.alert('Error when entering confirmation code: ', err.message)
        }
      })
  }
  // Resend code if not received already
  async resendSignUp() {
    const { username } = this.state
    await Auth.resendSignUp(username)
      .then(() => console.log('Confirmation code resent successfully'))
      .catch(err => {
        if (!err.message) {
          console.log('Error requesting new confirmation code: ', err)
          Alert.alert('Error requesting new confirmation code: ', err)
        } else {
          console.log('Error requesting new confirmation code: ', err.message)
          Alert.alert('Error requesting new confirmation code: ', err.message)
        }
      })
  }
  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    let { fadeOut, fadeIn, isHidden, flag } = this.state
    const countryData = data
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar />
        <KeyboardAvoidingView style={styles.container} behavior='padding' enabled>

          <ScrollView style={{ flex: 1, paddingTop: 0, }} onPress={Keyboard.dismiss}>

            <View style={{ alignItems: 'center', marginBottom: 20 }}>
              <Image source={require('../../../assets/images/amplify.jpg')} />
              <Text style={{ fontSize: 21 }}>Create Account with Amplify</Text>
            </View>



            <View style={{ flex: 1, paddingHorizontal: 20, }}>
              {/* username section  */}
              <Item style={styles.itemStyle}>
                <Feather name="user" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder='Username'
                  placeholderTextColor='#adb4bc'
                  keyboardType={'email-address'}
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  onSubmitEditing={(event) => { this.refs.SecondInput._root.focus() }}
                  onChangeText={value => this.onChangeText('username', value)}
                  onFocus={() => this.fadeOut()}
                  onEndEditing={() => this.fadeIn()}
                />
              </Item>
              {/*  password section  */}
              <Item style={styles.itemStyle}>
                <Feather name="lock" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder='Password'
                  placeholderTextColor='#adb4bc'
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={true}
                  // ref={c => this.SecondInput = c}
                  ref='SecondInput'
                  onSubmitEditing={(event) => { this.refs.ThirdInput._root.focus() }}
                  onChangeText={value => this.onChangeText('password', value)}
                  onFocus={() => this.fadeOut()}
                  onEndEditing={() => this.fadeIn()}
                />
              </Item>
              {/* email section */}
              <Item style={styles.itemStyle}>
                <Feather name="mail" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder='Email'
                  placeholderTextColor='#adb4bc'
                  keyboardType={'email-address'}
                  returnKeyType='next'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={false}
                  ref='ThirdInput'
                  onSubmitEditing={(event) => { this.refs.FourthInput._root.focus() }}
                  onChangeText={value => this.onChangeText('email', value)}
                  onFocus={() => this.fadeOut()}
                  onEndEditing={() => this.fadeIn()}
                />
              </Item>
              {/* phone section  */}
              <Item style={styles.itemStyle}>
                <Feather name="phone" style={styles.iconStyle} />
                {/* country flag */}
                <TouchableOpacity
                  onPress={() => this.showModal()}
                ><Text style={{ fontSize: 32 }}>{flag}</Text></TouchableOpacity>
                {/* open modal */}
                <Ionicons
                  name="md-arrow-dropdown"
                  style={[styles.iconStyle, { marginLeft: 5 }]}

                />
                <Input
                  style={styles.input}
                  placeholder='+18685555555'
                  placeholderTextColor='#adb4bc'
                  keyboardType={'phone-pad'}
                  returnKeyType='done'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={false}
                  ref='FourthInput'
                  value={this.state.phoneNumber}
                  onChangeText={(val) => {
                    if (this.state.phoneNumber === '') {
                      // render UK phone code by default when Modal is not open
                      this.onChangeText('phoneNumber', defaultCode + val)
                    } else {
                      // render country code based on users choice with Modal
                      this.onChangeText('phoneNumber', val)
                    }
                  }
                  }
                  onFocus={() => this.fadeOut()}
                  onEndEditing={() => this.fadeIn()}
                />
                {/* Modal for country code and flag */}
                <Modal
                  animationType="slide" // fade
                  transparent={false}
                  visible={this.state.modalVisible}>
                  <View style={{ flex: 1, }}>
                    <View style={{ flex: 15, paddingTop: 40, paddingHorizontal: 10, backgroundColor: '#fff' }}>
                      <FlatList
                        data={countryData}
                        keyExtractor={(item, index) => index.toString()}
                        renderItem={
                          ({ item }) =>
                            <TouchableWithoutFeedback
                              onPress={() => this.getCountry(item.name)}>
                              <View
                                style={
                                  [
                                    styles.countryStyle,
                                    {
                                      flexDirection: 'row',
                                      alignItems: 'center',
                                      justifyContent: 'space-between'
                                    }
                                  ]
                                }>
                                <Text style={{ fontSize: 45 }}>
                                  {item.flag}
                                </Text>
                                <Text style={{ fontSize: 20, color: '#666' }}>
                                  {item.name} ({item.dial_code})
                                    </Text>
                              </View>
                            </TouchableWithoutFeedback>
                        }
                      />
                    </View>
                    <TouchableOpacity
                      onPress={() => this.hideModal()}
                      style={styles.closeButtonStyle}>
                      <Text style={styles.textStyle}>
                        Close
                          </Text>
                    </TouchableOpacity>
                  </View>
                </Modal>
              </Item>

              {/* End of phone input */}


              <TouchableOpacity
                onPress={() => this.signUp()}
                style={styles.buttonStyle}>
                <Text style={styles.buttonText}>
                  Sign Up
                    </Text>
              </TouchableOpacity>
              {/* code confirmation section  */}
              <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
              />
              <Item style={styles.itemStyle}>
                <Feather name="grid" style={styles.iconStyle} />
                <Input
                  style={styles.input}
                  placeholder='Confirmation code'
                  placeholderTextColor='#adb4bc'
                  keyboardType={'numeric'}
                  returnKeyType='done'
                  autoCapitalize='none'
                  autoCorrect={false}
                  secureTextEntry={false}
                  onChangeText={value => this.onChangeText('authCode', value)}
                  onFocus={() => this.fadeOut()}
                  onEndEditing={() => this.fadeIn()}
                />
              </Item>

              <TouchableOpacity
                onPress={() => this.confirmSignUp()}
                style={styles.buttonStyle}>
                <Text style={styles.buttonText}>
                  Confirm Sign Up
                    </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.resendSignUp()}
                style={styles.greyButtonStyle}>
                <Text style={styles.buttonText}>
                  Resend Activation Code
                    </Text>
              </TouchableOpacity>
              <View style={{ flexDirection: 'row', marginBottom: 30 }}>
                <TouchableOpacity
                  onPress={() => this.handleRoute('Welcome')}
                  style={styles.leftButton}>
                  <Text style={styles.textStyle}>Already Registered?</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this.handleRoute('ForgetPassword')}
                  style={styles.rightButton}>
                  <Text style={styles.textStyle}>Forgot password?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    backgroundColor: '#fff',
    justifyContent: 'center',
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
    color: '#666',
    fontWeight: 'bold'
  },
  countryStyle: {
    flex: 1,
    backgroundColor: '#fff',
    borderTopColor: '#ccc',
    borderTopWidth: 1,
    padding: 0,
  },
  closeButtonStyle: {
    flex: 1,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#1F28CF',
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

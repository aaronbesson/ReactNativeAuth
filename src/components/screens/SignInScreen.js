import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  StatusBar,
  KeyboardAvoidingView,
  Keyboard,
  Alert,
  Animated,
} from 'react-native'

import { Ionicons } from '@expo/vector-icons';

import {
  Container,
  Item,
  Input,
} from 'native-base'

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'

// Load the app logo
const logo = require('../images/logo.png')

export default class SignInScreen extends React.Component {
  state = {
    username: '',
    password: '',
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(0),
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
        toValue: 1,
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
  // Sign in users with Auth
  async signIn() {
    const { username, password } = this.state
    await Auth.signIn(username, password)
      .then(user => {
        this.setState({ user })
        this.props.navigation.navigate('Authloading')
      })
      .catch(err => {
        if (!err.message) {
          console.log('Error when signing in: ', err)
          Alert.alert('Error when signing in: ', err)
        } else {
          console.log('Error when signing in: ', err.message)
          Alert.alert('Error when signing in: ', err.message)
        }
      })
  }
  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    let { fadeOut, fadeIn, isHidden } = this.state
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar />
        <KeyboardAvoidingView style={{ flex: 1, }} behavior='padding' enabled>
          <View style={styles.container}>
            <Container style={styles.infoContainer}>
              <View style={{ alignItems: 'center' }}>
                <View style={{ alignItems: 'center', marginBottom: 20 }}>
                  <Image source={require('../../../assets/images/firebase.png')} />
                  <Text style={{ fontSize: 21 }}>Firebase Login</Text>
                </View>
                <Item style={styles.itemStyle}>
                  <Ionicons name="ios-person" style={styles.iconStyle} />
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
                <Item style={styles.itemStyle}>
                  <Ionicons style={styles.iconStyle} name="ios-lock" />
                  <Input
                    style={styles.input}
                    placeholder='Password'
                    placeholderTextColor='#adb4bc'
                    returnKeyType='go'
                    autoCapitalize='none'
                    autoCorrect={false}
                    secureTextEntry={true}
                    ref='SecondInput'
                    onChangeText={value => this.onChangeText('password', value)}
                    onFocus={() => this.fadeOut()}
                    onEndEditing={() => this.fadeIn()}
                  />
                </Item>
                <TouchableOpacity
                  onPress={() => this.signIn()}
                  style={styles.buttonStyle}>
                  <Text style={styles.buttonText}>
                    Sign In
                    </Text>
                </TouchableOpacity>
                <View style={{ flexDirection: 'row', marginTop: 20 }}>
                  <TouchableOpacity
                    onPress={() => this.handleRoute('SignUp')}
                    style={styles.leftButton}>
                    <Text style={styles.textStyle}>Register Now</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.handleRoute('ForgetPassword')}
                    style={styles.rightButton}>
                    <Text style={styles.textStyle}>Forget password?</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </Container>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    flexDirection: 'column',
  },
  input: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    color: '#646464',
  },
  itemStyle: {
    marginBottom: 20,
  },
  iconStyle: {
    color: '#666',
    fontSize: 30,
    marginRight: 15
  },
  buttonStyle: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#1F28CF',
    borderRadius: 99,
  },
  buttonText: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff'
  },
  logoContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 400,
    bottom: 180,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
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

import React from 'react'
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  Animated,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native'
import Onboarding from 'react-native-onboarding-swiper';
import SignInScreen from './SignInScreen';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

// AWS Amplify modular import
import Auth from '@aws-amplify/auth'
import { Ionicons } from '@expo/vector-icons';

import {
  Container,
  Item,
  Input,
} from 'native-base'
import Feather from '@expo/vector-icons/Feather';

export default class WelcomeScreen extends React.Component {
  state = {
    modalVisible: false,
    username: '',
    password: '',
    fadeIn: new Animated.Value(0),
    fadeOut: new Animated.Value(0),
    isHidden: false
  };

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

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  handleRoute = async (destination) => {
    await this.props.navigation.navigate(destination)
  }
  render() {
    let { fadeOut, fadeIn, isHidden } = this.state
    return (
      <View style={styles.container}>
        <Modal
          animationType="fade"
          transparent={true}
          overFullScreen
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={styles.modalBk}>
            <View style={styles.modalWindow}>
              <KeyboardAvoidingView style={{ flex: 1, }} behavior='padding' enabled>
                <View style={{ flex: 1 }}>
                  <View style={{ alignItems: 'center' }}>
                    <View style={{ alignItems: 'center', marginBottom: 20 }}>
                      <Image source={require('../../../assets/images/amplify.jpg')} />
                      <Text style={{ fontSize: 21 }}>Login with Amplify</Text>
                    </View>
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
                    <Item style={styles.itemStyle}>
                      <Feather style={styles.iconStyle} name="lock" />
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
                      <Text style={styles.buttonTextStyle}>
                        Sign In
                    </Text>
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'row', position: 'absolute', bottom: -60 }}>
                      <TouchableOpacity
                        onPress={() => this.handleRoute('SignUp') + this.setModalVisible(!this.state.modalVisible)}
                        style={styles.leftButton}>
                        <Text style={styles.textStyle}>Create an account</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => this.handleRoute('ForgetPassword') + this.setModalVisible(!this.state.modalVisible)}
                        style={styles.rightButton}>
                        <Text style={styles.textStyle}>Forgot password?</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </KeyboardAvoidingView>
              <TouchableOpacity
                style={styles.closeModal}
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text>
                  <MaterialCommunityIcons name='close' size={32} color='black' />
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <Onboarding
          bottomBarHighlight={false}
          bottomBarHeight={80}
          showSkip={false}
          onSkip={() => this.handleRoute('Home')}
          onDone={() => this.handleRoute('Home')}
          showNext={false}
          showDone={false}
          allowFontScaling={false}
          titleStyles={{ paddingBottom: 5 }}
          subTitleStyles={{ paddingBottom: 60 }}
          imageContainerStyles={{ paddingBottom: 40 }}
          pages={
            [
              {
                backgroundColor: '#fff',
                image: <Image source={require('../../../assets/images/walk1.png')} />,
                title: 'Welcome',
                subtitle: 'This is a AWS Amplify, Expo and React Native mobile app for iOS and Android',
              },
              {
                backgroundColor: '#fff',
                image: <Image source={require('../../../assets/images/walk3.png')} />,
                title: 'AWS Amplify + Expo = ❤️',
                subtitle: 'Easy to setup authentication, onboarding and navigation',
              },
              {
                backgroundColor: '#fff',
                image: <Image source={require('../../../assets/images/walk2.png')} />,
                title: 'Quick and Easy Setup',
                subtitle: 'A Reat Native boilerplate by Younes Henni and reimagined by Aaron Besson',
              },
            ]}
        />
        <View style={{ alignItems: 'center', paddingHorizontal: 20, marginBottom: 20, }}>
          <TouchableOpacity
            onPress={() => this.setModalVisible(true)}
            style={styles.buttonStyle}>
            <Text style={styles.buttonTextStyle}>Get Started</Text>
          </TouchableOpacity>

        </View>
      </View >
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // #b13366
    justifyContent: 'flex-start',
  },
  modalBk: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255, 0.95)',
    paddingHorizontal: 25,
    justifyContent: 'center'
  },
  modalWindow: {
    backgroundColor: 'white',
    width: '100%', height: 360,
    borderRadius: 15,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    paddingTop: 10,
    elevation: 1,
  },
  closeModal: { position: 'absolute', right: 10, top: 10 },
  buttonStyle: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    width: '100%',
    backgroundColor: '#1F28CF',
    borderRadius: 99,
    margin: 5
  },
  textStyle: {
    fontWeight: '700',
    fontSize: 14,
    padding: 10,
    color: '#666'
  },
  buttonTextStyle: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 10,
    color: '#fff'
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
    fontSize: 24,
    marginRight: 15
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

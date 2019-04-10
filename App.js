import React from 'react';
import { View, TouchableOpacity } from 'react-native'

import {
  createSwitchNavigator,
  createStackNavigator,
  createDrawerNavigator,
  createMaterialTopTabNavigator
} from 'react-navigation'

import { Ionicons } from '@expo/vector-icons';

// Auth stack screen imports
import AuthLoadingScreen from './src/components/screens/AuthLoadingScreen'
import WelcomeScreen from './src/components/screens/WelcomeScreen'
import SignUpScreen from './src/components/screens/SignUpScreen'
import SignInScreen from './src/components/screens/SignInScreen'
import ForgetPasswordScreen from './src/components/screens/ForgetPasswordScreen'

// App stack screen imports
import HomeScreen from './src/components/screens/HomeScreen'
import SettingsScreen from './src/components/screens/SettingsScreen'
import ProfileScreen from './src/components/screens/ProfileScreen'

// Amplify imports and config
import Amplify from '@aws-amplify/core'
import config from './src/aws-exports'
import Feather from '@expo/vector-icons/Feather';
Amplify.configure(config)

// Configurations and options for the AppTabNavigator
const configurations = {
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor }) => (
        <Feather style={{ fontSize: 24, color: tintColor }} name="home" />
      )
    },
  },
  Profile: {
    screen: ProfileScreen,
    navigationOptions: {
      tabBarLabel: 'Profile',
      tabBarIcon: ({ tintColor }) => (
        <Feather style={{ fontSize: 24, color: tintColor }} name="user" />
      )
    }
  },
  Settings: {
    screen: SettingsScreen,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor }) => (
        <Feather style={{ fontSize: 24, color: tintColor }} name="settings" />
      )
    }
  },
}

const options = {
  tabBarPosition: 'bottom',
  swipeEnabled: false,
  animationEnabled: false,
  navigationOptions: {
    tabBarVisible: true
  },
  tabBarOptions: {
    showLabel: false,
    activeTintColor: '#1F28CF',
    inactiveTintColor: '#666',
    style: {
      backgroundColor: '#fff',
      paddingBottom: 10
    },
    labelStyle: {
      fontSize: 12,
      fontWeight: 'bold',
      marginBottom: 12,
      marginTop: 12,
    },
    indicatorStyle: {
      height: 8,
      backgroundColor: '#1F28CF'
    },
    showIcon: true,
  }
}

// Bottom App tabs
const AppTabNavigator = createMaterialTopTabNavigator(configurations, options)

// Making the common header title dynamic in AppTabNavigator
AppTabNavigator.navigationOptions = ({ navigation }) => {
  let { routeName } = navigation.state.routes[navigation.state.index]
  let headerTitle = routeName
  return {
    headerTitle,
  }
}

const AppStackNavigator = createStackNavigator({
  Header: {
    screen: AppTabNavigator,
    // Set the header icon
    navigationOptions: ({ navigation }) => ({
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff'
      },
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.toggleDrawer()}>
          <View style={{ paddingHorizontal: 10 }}>
            <Ionicons size={24} name="md-menu" />
          </View>
        </TouchableOpacity>
      )
    })
  }
})

// App stack for the drawer
const AppDrawerNavigator = createDrawerNavigator({
  Sidebar: AppStackNavigator, // defined above
  Home: HomeScreen,
  Profile: ProfileScreen,
  Settings: SettingsScreen
})

// Auth stack
const AuthStackNavigator = createStackNavigator({
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: () => ({
      title: `Welcome to Amplify`, // for the header screen
      headerBackTitle: 'Back',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        display: 'none',
      },
    }),
  },
  SignUp: {
    screen: SignUpScreen,
    navigationOptions: () => ({
      title: null,
      headerBackTitle: 'Back',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        // display: 'none',
      },
    }),
  },
  SignIn: {
    screen: SignInScreen,
    navigationOptions: () => ({
      title: `Log in to your account`,
      headerBackTitle: 'Back',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        // display: 'none',
      },
    }),
  },
  ForgetPassword: {
    screen: ForgetPasswordScreen,
    navigationOptions: () => ({
      title: `Create a new password`,
      headerBackTitle: 'Back',
      headerStyle: {
        borderBottomWidth: 0,
        backgroundColor: '#fff',
        // display: 'none',
      },
    }),
  },
})

export default createSwitchNavigator({
  Authloading: AuthLoadingScreen,
  Auth: AuthStackNavigator, // the Auth stack
  App: AppDrawerNavigator, // the App stack
})


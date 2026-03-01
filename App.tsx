import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { supabase } from './lib/supabase'
import LoginScreen from './src/screens/LoginScreen'
import HomeScreen from './src/screens/HomeScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'
import Ionicons from '@expo/vector-icons/Ionicons'
import Feather from '@expo/vector-icons/Feather'

import { useFonts } from 'expo-font'
import DetailScreen from './src/screens/DetailScreen'
import ScheduleScreen from './src/screens/ScheduleScreen'
import VehiclesScreen from './src/screens/VehiclesScreen'
import VehicleFormScreen from './src/screens/VehicleFormScreen'
import { PaperProvider, Provider } from 'react-native-paper'
import AddCarSuccessScreen from './src/screens/AddCarStepsScreens/AddCarSuccessScreen'
import CreateRentalListingScreen from './src/screens/CreateRentalListingScreens/CreateRentalListingScreen'
import RentalListingSuccessScreen from './src/screens/CreateRentalListingScreens/RentalListingSuccessScreen'
import RentingScreen from './src/screens/RentingScreen'
import MessageScreen from './src/screens/MessageScreen'
const Tab = createBottomTabNavigator()
const Stack = createNativeStackNavigator()

export default function App() {
  const [user, setUser] = useState<any | null>(null)

  useEffect(() => {
    supabase.auth.getSession().then((r) => {
      if (r.data?.session?.user) setUser(r.data.session.user)
    })
  }, [])

  const [fontsLoaded] = useFonts({
    MyHeaderFontRegular: require('./assets/fonts/Montserrat-Regular.ttf'),
    MyHeaderFontBold: require('./assets/fonts/Montserrat-SemiBold.ttf'),
    MySubHeaderFontSemiBold: require('./assets/fonts/Inter-SemiBold.ttf'),
    MyRegularFont: require('./assets/fonts/Roboto-Regular.ttf'),
    MyRegularBodFont: require('./assets/fonts/Roboto-SemiBold.ttf'),
  })

  if (!fontsLoaded) return null

  if (!user) return <LoginScreen onLogin={setUser} />

  const MyTabs = () => (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#192f6a',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: {
          position: 'absolute',
          bottom: 30,
          left: 16,
          right: 16,
          backgroundColor: '#FFFFFF',
          borderRadius: 22,
          height: 65,
          borderTopWidth: 0,
          marginInline: 20,

          elevation: 8,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.08,
          shadowRadius: 12,
        },
      }}
    >
      <Tab.Screen
        name="Explore"
        component={HomeScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="search" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Renting"
        component={RentingScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Vehicles"
        component={VehiclesScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="car-sport-outline" size={size} color={color} />
          ),
        }}
      />

      <Tab.Screen
        name="Inbox"
        component={MessageScreen}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Feather name="message-circle" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  )

  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Tabs" component={MyTabs} />
          <Stack.Screen name="Details" component={DetailScreen} />
          <Stack.Screen name="VehicleForm" component={VehicleFormScreen} />
          <Stack.Screen
            name="AddCarSuccess"
            component={AddCarSuccessScreen}
            options={{
              gestureEnabled: false,
            }}
          />
          <Stack.Screen
            name="CreateRentalListing"
            component={CreateRentalListingScreen}
          />
          <Stack.Screen
            name="RentalListingSuccessScreen"
            component={RentalListingSuccessScreen}
            options={{
              gestureEnabled: false,
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  )
}

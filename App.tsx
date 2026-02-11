import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { supabase } from './lib/supabase'
import LoginScreen from './src/screens/LoginScreen'
import HomeScreen from './src/screens/HomeScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Feather from '@expo/vector-icons/Feather';

import { useFonts } from 'expo-font'
import DetailScreen from './src/screens/DetailScreen'
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
  MyRegularBodFont: require('./assets/fonts/Roboto-SemiBold.ttf')
});

  if (!fontsLoaded) return null; 

  if (!user) return <LoginScreen onLogin={setUser} />


  const MyTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false, tabBarActiveTintColor: "#192f6a" }}>
        <Tab.Screen name="Home" component={HomeScreen} options={{tabBarIcon: ({ color, size }) => (
          <Feather name="home" size={size} color={color} />
        ),
        }}/>
        <Tab.Screen
          name="Profile"
          children={() => (
            <ProfileScreen
              user={user}
              onSignOut={async () => {
                await supabase.auth.signOut()
                setUser(null)
              }}
            />
          )}
          options={{ tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account-circle-outline" size={size} color={color} />
          )}}
        />
      </Tab.Navigator>
  )

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{headerShown: false}}>
        <Stack.Screen name="Tabs" component={MyTabs} />
        <Stack.Screen name="Details" component={DetailScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  item: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
})
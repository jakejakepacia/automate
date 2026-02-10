import { useEffect, useState } from 'react'
import { StyleSheet } from 'react-native'
import { supabase } from './lib/supabase'
import LoginScreen from './src/screens/LoginScreen'
import HomeScreen from './src/screens/HomeScreen'
import ProfileScreen from './src/screens/ProfileScreen'
import { NavigationContainer } from '@react-navigation/native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'

import { useFonts } from 'expo-font'
const Tab = createBottomTabNavigator()

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

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Home" component={HomeScreen} />
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
        />
      </Tab.Navigator>
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
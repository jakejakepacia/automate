import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Image, TouchableOpacity, TextInput } from 'react-native'
import { supabase } from '../../lib/supabase'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { User } from '../types/user';
import Octicons from '@expo/vector-icons/Octicons';
import promo1 from '../../assets/promotions/promo-1.png';
import promo2 from '../../assets/promotions/promo-2.png';
import { Dimensions } from 'react-native';
import { fetchCars } from '../services/fetchCars';
import CarCard from '../components/carCard';

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [searchText, setSearchText] = useState('');
  const [cars, setCars] = useState([])

  const placeholders = [
    'Where are you going today?',
    'Search for available cars',
    'What car you need today?',
    'Discover new car listed!'
  ];

  
  const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % placeholders.length);
    }, 5000); 

    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  useEffect(() => {
    fetchUserInfo()
  }, [])

   useEffect(() => {
    // Wrap async function inside useEffect
    const loadCars = async () => {
      try {
        const data = await fetchCars();
        setCars(data);
        console.log(data)
      } catch (error) {
        console.error("Error fetching cars:", error);
      }
    };

    loadCars();
  }, []); 
 

async function fetchUserInfo() {
  try {
    setRefreshing(true)

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      console.error('No authenticated user')
      return
    }

    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) {
      console.error('Error fetching user info:', error.message)
    } else {
       setUserInfo(data) 
    }
  } finally {
    setRefreshing(false)
  }
}


  return (
    <SafeAreaView>
        <ScrollView>
              <View style={styles.header}>
                  
                      <View>
                        <Text style={{ fontFamily: 'MyHeaderFontBold', fontSize: 30 }}>Hi, {userInfo?.name}</Text>
                        <Text style={{ fontFamily: 'MySubHeaderFontSemiBold',  fontSize: 12, color: "gray"}}>Need car for today?</Text>
                      </View>
                      <TouchableOpacity style={{marginLeft: "auto"}}>
                            <Image
                        source={{
                          uri:
                            userInfo?.image ??
                            "https://picsum.photos/200/120?random=",
                        }}
                        style={styles.serviceImage}
                      />
                      </TouchableOpacity>
                 
              </View>
                 <TextInput
        value={searchText}
        onChangeText={setSearchText}
        placeholder={placeholders[currentIndex]}
        placeholderTextColor="#999"
        style={styles.input}
      />
      <ScrollView horizontal
      showsHorizontalScrollIndicator={false}
      style={{gap: 20, marginTop: 20}}
      >
                        <Image source={promo1} style={{ width: width, height: width * 0.56 }}
  resizeMode="stretch"/>
      <Image source={promo2} style={{ width: width, height: width * 0.56 }}
  resizeMode="stretch"/>
      </ScrollView>

<View style={{gap: 5, marginTop: 20, padding: 20}}>
  <View style={{flexDirection:"row"}}>
    <Text style={{fontFamily: 'MySubHeaderFontSemiBold'}}>For Rent</Text>
    <Text style={{fontFamily: 'MyRegularFont', marginLeft: "auto", color: "blue"}}>View More ></Text>
  </View>
  
  {cars.map((car) => (
      <CarCard car={car}/>
      ))}
</View>

<View style={{gap: 5, marginTop: 20, padding: 20}}>
  <View style={{flexDirection:"row"}}>
    <Text style={{fontFamily: 'MySubHeaderFontSemiBold'}}>For Sale</Text>
    <Text style={{fontFamily: 'MyRegularFont', marginLeft: "auto", color: "blue"}}>View More ></Text>
  </View>
  
  {cars.map((car) => (
      <CarCard car={car}/>
      ))}
</View>
        
        
        </ScrollView>
    </SafeAreaView>
   

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 24,
  },
  header: {
    flexDirection: "row",
    gap: 24,
    alignContent: "center",
    alignItems: "center",
    padding: 20
  },
  cardContainer: {
    padding: 16,
  },
  serviceImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
  },
    input: {
    fontFamily: 'Inter-Regular', // use your loaded font
    fontSize: 16,
    backgroundColor: '#f2f2f2', // light grey
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    shadowColor: '#000', // iOS shadow
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10
  },
});
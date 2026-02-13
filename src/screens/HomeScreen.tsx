import React, { useEffect, useState } from 'react'
import { View, Text, FlatList, StyleSheet, RefreshControl, ScrollView, Image, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native'
import { supabase } from '../../lib/supabase'
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import type { User } from '../types/user';
import { LinearGradient } from "expo-linear-gradient";
import Octicons from '@expo/vector-icons/Octicons';
import promo1 from '../../assets/promotions/promo-1.png';
import promo2 from '../../assets/promotions/promo-2.png';
import { Dimensions } from 'react-native';
import { fetchCars } from '../services/fetchCars';
import CarCard from '../components/carCard';
import { absoluteFill } from 'react-native/types_generated/Libraries/StyleSheet/StyleSheetExports';
import { event } from 'react-native/types_generated/Libraries/Animated/AnimatedExports';
import GradientButton from '../components/GradientButton';
import { Colors } from '../constants/colors';
import { fetchUserInfo } from '../services/api';

const { width } = Dimensions.get("window");

export default function HomeScreen({ navigation }) {
  const [refreshing, setRefreshing] = useState(false)
  const [userInfo, setUserInfo] = useState<User | null>(null)
  const [searchText, setSearchText] = useState('');
  const [cars, setCars] = useState([])
  const insents = useSafeAreaInsets();
  const [parentHeight, setParentHeight] = useState(0);
  const [activeButton, setActiveButton] = useState("forRent")
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

  useEffect(() =>  {
    loadUserInfo();
  }, [])

   useEffect(() => {
    // Wrap async function inside useEffect

    loadCars();
  }, []); 

    const loadUserInfo = async () =>{
      try{
        setRefreshing(true)
        const data = await fetchUserInfo();
        setUserInfo(data)
      }catch (error){
        console.error("Error fetching user info", error)
      }finally{
        setRefreshing(false)
      }
    }

    const loadCars = async () => {
      try {
        setRefreshing(true)
        const data = await fetchCars();
        setCars(data);
      } catch (error) {
        console.error("Error fetching cars:", error);
      } finally{
            setRefreshing(false)
      }
    };
 
  function forRentBtnPressed () {
     setActiveButton("forRent")
      loadCars()
      
  }



  return (
       <ScrollView>
           <LinearGradient
      colors={["#4c669f", "#3b5998", "#192f6a"]} // gradient colors
      style={styles.container}
    >
 <View style={[styles.header, {marginTop: insents.top}]}
 onLayout={(event) => {
  setParentHeight(event.nativeEvent.layout.height)
 }}>
                        <View>
                        <Text style={{ fontFamily: 'MyHeaderFontBold', fontSize: 30, color: "white" }}>Hi, {userInfo?.name}</Text>
                        <Text style={{ fontFamily: 'MySubHeaderFontSemiBold',  fontSize: 12, color: "white"}}>Need car for today?</Text>
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
    </LinearGradient>
            
            <View style={{padding: 20}}>
 <ScrollView horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.promoContainer}
      >
                        <Image source={promo1} style={styles.promoImg}
  resizeMode="stretch"/>
      <Image source={promo2} style={styles.promoImg}
  resizeMode="stretch"/>
      </ScrollView>
             </View>
     
     <View style={{flexDirection: "row", paddingInline: 20, gap:20}}>
      <TouchableOpacity style={[styles.button, {backgroundColor: activeButton === "forRent" ? Colors.primary : "gray"}]}
       onPress={() => forRentBtnPressed() }>
      <Text style={styles.buttonText}>For rent</Text>
      </TouchableOpacity>

        <TouchableOpacity style={[styles.button, {backgroundColor: activeButton === "forSale" ? Colors.primary : "gray"}]} 
       onPress={() => setActiveButton("forSale")}>
      <Text style={styles.buttonText}>For sale</Text>
      </TouchableOpacity>
     </View>
     {refreshing && 
     <ActivityIndicator />

     }
      {activeButton === "forRent" &&
      <View style={{gap: 5, padding: 20}}>
       {cars.map((item) => (
        <TouchableOpacity key={item.id} onPress={() => navigation.navigate("Details", { car: item })}>
          <CarCard car={item}/>
        </TouchableOpacity>
            
            ))}
      </View>
      }

      {activeButton === "forSale" &&
      <View style={{alignContent: "center", justifyContent:"center", alignItems:"center", flex: 1, marginTop: 100}}>
        <Text>Coming Soon!</Text>
        </View>}



        
        </ScrollView>
   

  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    paddingBottom: 80
  },
  header: {
    flexDirection: "row",
    gap: 24,
    alignContent: "center",
    alignItems: "center",
    padding: 20,
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
  promoContainer: {
      zIndex: 10,
      marginTop: -90,
      borderRadius: 10
  },
  promoImg: {
    width: width,
    height: width * 0.56 ,
    resizeMode: "contain"
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText:{
    color: Colors.white,
    fontSize: 14,
    fontFamily: 'MyRegularFont'
  }
});
import { useEffect, useState } from "react";
import { fetchOwnedCars  } from "../services/api";
import { ScrollView, View, TouchableOpacity, StyleSheet } from "react-native";
import CarCard from "../components/carCard";
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from "../constants/colors";

export default function OwnedCarsScreen({ navigation }){
    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

   useEffect(() => {
          loadOwnedCars();
      }, []);

     async function loadOwnedCars(){
            try{
                setLoading(true);
                setError(null);
                const result = await fetchOwnedCars();
                setCars(result)
            }catch (error){
                console.error("error fetching owned cars: ", error)
            }
    }

    return (
        <ScrollView style={{flex: 1,}}>
            <View style={{ gap: 5, padding:5 }}>
                          {cars.map((item) => (
                           <TouchableOpacity key={item.id} onPress={() => navigation.navigate("Details", { car: item })}>
                             <CarCard car={item}/>
                           </TouchableOpacity>
                               
                               ))}

               
            </View>
             <View style={style.addButton}>
                    <Ionicons name="add-circle-sharp" size={80} color={Colors.primary} />
                </View>
        </ScrollView>
    )
}

const style = StyleSheet.create({
    addButton: {
        position: "absolute",  
        bottom: 0,
        right: 0  
    }
})
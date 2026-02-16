import { View, Text, ScrollView, StyleSheet} from "react-native"
import { TextInput } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import NavigationBar from "../components/NavigationBar"
import { Colors } from "../constants/colors"

export default function VehicleFormScreen( { navigation } ){
    return(
        <SafeAreaView >
            <NavigationBar title={"Add"}
            navigation={navigation}/>
            <ScrollView >
                <View style={styles.container}>
               
     <TextInput
        label="Make"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>

             <TextInput
        label="Model"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>
        
             <TextInput
        label="Year"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>
             <TextInput
        label="Color"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>

             <TextInput
        label="Plate number"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>

             <TextInput
        label="Category"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>

             <TextInput
        label="Transmission"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>

             <TextInput
        label="Fuel Type"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>

             <TextInput
        label="Seats"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}/>
                </View>
            </ScrollView>
      
        </SafeAreaView>
       
    )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
})

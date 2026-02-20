import { Text, View } from "react-native";
import { TextInput } from "react-native-paper";
import { Colors } from "../../constants/colors";
export default function Step1Screen({ formData, setFormData }){
    return(
            <View style={{gap: 10}}>

            <View>
            <Text style={{fontFamily: 'MyHeaderFontBold', fontSize: 20}}>       Step 1: Basic Information </Text>
            <Text style={{fontFamily: 'MyHeaderFontRegular', fontSize: 16}}>Enter the basic information exactly as it appears on the vehicle registration.</Text>
            </View>
              
                 <TextInput
        label="Make"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}
        value={formData.make}
        onChangeText={((text) => 
        setFormData({ ...formData, make: text}))}/>

             <TextInput
        label="Model"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}
         value={formData.model}
        onChangeText={((text) => 
        setFormData({ ...formData, model: text}))}/>
        
             <TextInput
        label="Year"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}
         value={formData.year}
        onChangeText={((text) => 
        setFormData({ ...formData, year: text}))}/>
             <TextInput
        label="Color"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}
         value={formData.color}
        onChangeText={((text) => 
        setFormData({ ...formData, color: text}))}/>

             <TextInput
        label="Plate number"
        mode="outlined"
        outlineColor={Colors.primary} 
        activeOutlineColor={Colors.primary}
         value={formData.plate_nubmer}
        onChangeText={((text) => 
        setFormData({ ...formData, plate_number: text}))}/>
            </View>
    )
}
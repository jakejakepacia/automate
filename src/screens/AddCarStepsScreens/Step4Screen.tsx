import { StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { TextInput } from "react-native-paper";
import { Colors } from "../../constants/colors";
import EvilIcons from '@expo/vector-icons/EvilIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import ImageGrid from "../../components/ImageGrid";

export default function Step4Screen(){
    const requestPermissions = async () => {
  const cameraPermission = await ImagePicker.requestCameraPermissionsAsync();
  const mediaPermission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (
    cameraPermission.status !== 'granted' ||
    mediaPermission.status !== 'granted'
  ) {
    alert('Permission required to access camera and photos');
    return false;
  }

  return true;
};

const openCamera = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  console.log("images " , images.length)
   if (images.length === 6){
    alert("Only upload maximum 6 images")
    return
  }


  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    quality: 0.8,
  });

 if (!result.canceled) {
  const newImages = result.assets.map(asset => asset.uri);
  setImages(prev => [...prev, ...newImages]);
}

};

const openGallery = async () => {
  const hasPermission = await requestPermissions();
  if (!hasPermission) return;

  if (images.length === 6){
    alert("Only upload maximum 6 images")
    return
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: true,
    quality: 0.8,
  });

 if (!result.canceled) {
  const newImages = result.assets.map(asset => asset.uri);
  setImages(prev => [...prev, ...newImages]);
}

};

const [images, setImages] = useState<string[]>([]);


    return(
        
        <View style={{gap: 20}}>

           
            
            <View>
            <Text style={{fontFamily: 'MyHeaderFontBold', fontSize: 20}}>Step 4: Upload Images </Text>
            <Text style={{fontFamily: 'MyHeaderFontRegular', fontSize: 16}}>Add clear photos from different angles. Listings with atleast 3 photos get more bookings.</Text>
            <Text>({images.length} / 6)</Text>
            </View>
                   
              <View>
              <ImageGrid images={images} 
                        setImages={setImages}/>
              </View>

               <View style={{flexDirection : "row", gap: 10}}>
                <TouchableOpacity style={styles.options} onPress={openCamera}>
                 <EvilIcons name="camera" size={60} color="black" />
                 <Text>Open Camera</Text>
                </TouchableOpacity>
                 <TouchableOpacity style={styles.options} onPress={openGallery}>
                 <MaterialIcons name="photo-library" size={60} color="black" />
                 <Text>Open Library</Text>
                </TouchableOpacity>
       
            </View>
           
        </View>
    )
}

const styles = StyleSheet.create({
    options: {
        alignContent: "center",
        alignItems: "center",
        justifyContent: "center",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 10,
        padding: 5,
        width: 100
    }
})
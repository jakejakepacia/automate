import { View, Text, ScrollView, StyleSheet, Animated, Dimensions } from "react-native"
import { Button, TextInput, ProgressBar } from "react-native-paper"
import { SafeAreaView } from "react-native-safe-area-context"
import NavigationBar from "../components/NavigationBar"
import { Colors } from "../constants/colors"
import { useState, useEffect, useRef } from "react"
import { addCar, uploadCarImage } from "../services/api"
import Step1Screen from "./AddCarStepsScreens/Step1Screen"
import Step2Screen from "./AddCarStepsScreens/Step2Screen"
import Step3Screen
 from "./AddCarStepsScreens/Step3Screen"
import Step4Screen from "./AddCarStepsScreens/Step4Screen"

 
const screenWidth = Dimensions.get("window").width;

export default function VehicleFormScreen( { navigation } ){
     const totalSteps = 4;
     const [step, setStep] = useState(1);
     const progress = step / totalSteps
     const animatedValue = useRef(new Animated.Value(0)).current;
       useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [progress]);

    const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth - 72 - 70], // padding + approx text width
  });
  const [carImages, setCarImages] = useState<string[]>([])
  const [formData, setFormData] = useState({
  // Step 1
  make: '',
  model: '',
  year: '',
  color: '',
  plate_number: '',

  // Step 2
  category: '',
  transmission: '',
  fuel_type: '',
  seats: 0,

  // Step 3
  city: '',
  province: '',
  pickup_location: '',
  latitude: 0,
  longitude: 0,
});
    const stepFields = {
      1: ['make', 'model', 'year', 'color', 'plate_number'],
      2: ['category', 'transmission', 'fuel_type', 'seats'],
      3: ['city', 'province', 'pickup_location'],
    };

    const validateStep = (currentStep: number) => {
    const fields = stepFields[currentStep];
  
    if(!fields){
      return true
    }

    return fields.every((field) => {
    const value = formData[field];
    return value !== '' && value !== null && value !== 0;
  });
};



    const handleAddBtn = async () => {
        const isValid = validateStep(step);
          
          if (!isValid) {
             alert("Please fill in all required fields.");
             return;
          }
       
          if (step < totalSteps) {
              setStep(step + 1);
            
          } else {
            console.log("try to add")
            submitNewCarForm();
          }

     }

     const handlePrevBtn = () => {
        if(step === 1){
          return
        }

        setStep(step - 1)
     }

     async function submitNewCarForm(){
       
          const result = await addCar(formData); 

          if (result){
               console.log("added car : ", result)
               //upload images, 
               console.log("first image uri ",carImages[0])
                const result = await uploadCarImage(carImages[0])

               //get url image from supabase using path
              //add data to car_images table
          }
     }

    return(
        <SafeAreaView style={{ flex: 1 }}>
          <NavigationBar title={"Add New Car"} navigation={navigation} />

             <View style={{ flex: 1 }}>

              
              <ScrollView contentContainerStyle={{ padding: 16 }}>
      
         
                    {step === 1 && <Step1Screen formData={formData} setFormData={setFormData}  />}
                    {step === 2 && <Step2Screen formData={formData} setFormData={setFormData}  />}
                    {step === 3 && <Step3Screen formData={formData} setFormData={setFormData} />}
                    {step ===4 &&  <Step4Screen images={carImages} setImages={setCarImages} />}

              </ScrollView>
              
            <View
                style={{
                  padding: 16,
                  gap: 8,
                  backgroundColor: "white",
                  borderRadius: 20,
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.15,
                  shadowRadius: 6,
                  elevation: 5,
                }}>
                  <View>
                           <ProgressBar
                                progress={progress}
                                style={{ height: 20, borderRadius: 10, marginVertical: 10, }} />

                      <Animated.View
                            style={[
                            styles.textContainer,
                            {
                              transform: [{ translateX }],
                            },]}>
                          <Text style={styles.text}>{`Step ${step} of ${totalSteps}`}</Text>
                      </Animated.View>
                  </View>
                  <View style={{flexDirection: "row"}}>
                     <Button
                        mode="contained"
                        onPress={handlePrevBtn}
                        buttonColor="transparent"
                        textColor={Colors.primary}
                        disabled={step === 1}>Prev</Button>
                      <Button
                        mode="contained"
                        onPress={handleAddBtn}
                        style={{flex: 1}}>{step <= 3 ? "Next" : "Done"}</Button>
                  </View>
            
            </View>

  </View>
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
    textContainer: {
    position: "absolute",
    top: 10,
    left: 0,
    width: 80, // approximate width of the text
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontWeight: "bold",
    fontSize: 12,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
})

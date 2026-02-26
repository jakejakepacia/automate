import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native'
import { Button, TextInput, ProgressBar } from 'react-native-paper'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import NavigationBar from '../components/NavigationBar'
import { Colors } from '../constants/colors'
import { useState, useEffect, useRef } from 'react'
import { addCar, uploadCarImage, addCarImage } from '../services/api'
import BasicCarInfoScreen from './AddCarStepsScreens/BasicCarInfoScreen'
import CarSpecsScreen from './AddCarStepsScreens/CarSpecsScreen'
import Step3Screen from './AddCarStepsScreens/Step3Screen'
import UploadCarImages from './AddCarStepsScreens/UploadCarImages'

const screenWidth = Dimensions.get('window').width

export default function VehicleFormScreen({ navigation }) {
  const totalSteps = 3
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const progress = step / totalSteps
  const insents = useSafeAreaInsets()

  const animatedValue = useRef(new Animated.Value(0)).current
  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration: 400,
      useNativeDriver: false,
    }).start()
  }, [progress])

  const translateX = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, screenWidth - 72 - 70], // padding + approx text width
  })
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
  })

  const stepFields = {
    1: ['make', 'model', 'year', 'color', 'plate_number'],
    2: ['category', 'transmission', 'fuel_type', 'seats'],
    4: ['city', 'province', 'pickup_location'],
  }

  const isValidYear = (year) => {
    const currentYear = new Date().getFullYear()

    // Check if it's exactly 4 digits
    if (!/^\d{4}$/.test(year)) {
      return false
    }

    const numericYear = parseInt(year, 10)

    // Adjust range if needed
    if (numericYear < 1900 || numericYear > currentYear) {
      return false
    }

    return true
  }

  const validateStep = (currentStep: number) => {
    const fields = stepFields[currentStep]

    switch (currentStep) {
      case 1:
        if (!isValidYear(formData.year)) {
          alert('Please enter valid year')

          return false
        }

        break
      case 3:
        console.log(carImages.length)
        console.log('step', currentStep)
        if (carImages.length === 0) {
          alert('Please upload atleast 1 image')

          return false
        }

        break

      default:
        console.log('try')
    }

    if (!fields) {
      return true
    }

    //Check if all fields are not empty
    return fields.every((field) => {
      const value = formData[field]
      const isValid = value !== '' && value !== null && value !== 0

      if (!isValid) {
        alert('Please enter all values')
      }

      return isValid
    })
  }

  const handleAddBtn = async () => {
    const isValid = validateStep(step)

    if (!isValid) {
      return
    }

    if (step < totalSteps) {
      setStep(step + 1)
    } else {
      submitNewCarForm()
    }
  }

  const handlePrevBtn = () => {
    if (step === 1) {
      return
    }

    setStep(step - 1)
  }

  const uploadAllImages = async (carId) => {
    try {
      const paths = await Promise.all(
        carImages.map((image) => uploadCarImage(image)),
      )

      // Insert each image to database
      await Promise.all(
        paths.map((path) =>
          addCarImage({
            car_id: carId,
            image_url: path.path,
          }),
        ),
      )
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  async function submitNewCarForm() {
    setIsLoading(true)
    const result = await addCar(formData)

    if (result) {
      const car_id = result[0].id
      uploadAllImages(car_id)
      navigation.navigate('AddCarSuccess', {
        car_id: car_id,
      })
    }

    setIsLoading(false)
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0} // adjust if you have header
    >
      <View style={{ marginTop: insents.top }}>
        <NavigationBar title={'Add New Car'} navigation={navigation} />
      </View>

      <View style={{ padding: 16, flex: 1 }}>
        {step === 1 && (
          <BasicCarInfoScreen formData={formData} setFormData={setFormData} />
        )}
        {step === 2 && (
          <CarSpecsScreen formData={formData} setFormData={setFormData} />
        )}
        {step === 3 && (
          <UploadCarImages images={carImages} setImages={setCarImages} />
        )}
      </View>

      <View
        style={{
          padding: 16,
          gap: 8,
          backgroundColor: 'white',
          borderRadius: 20,
          shadowColor: '#221e1e',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.55,
          shadowRadius: 6,
          elevation: 5,
        }}
      >
        <View>
          <ProgressBar
            progress={progress}
            style={{ height: 20, borderRadius: 10, marginVertical: 10 }}
          />

          <Animated.View
            style={[
              styles.textContainer,
              {
                transform: [{ translateX }],
              },
            ]}
          >
            <Text style={styles.text}>{`Step ${step} of ${totalSteps}`}</Text>
          </Animated.View>
        </View>
        <View style={{ flexDirection: 'row' }}>
          <Button
            mode="contained"
            onPress={handlePrevBtn}
            buttonColor="transparent"
            textColor={Colors.primary}
            disabled={step === 1}
          >
            Prev
          </Button>

          <TouchableOpacity
            onPress={handleAddBtn}
            style={{
              flex: 1,
              backgroundColor: Colors.primary,
              borderRadius: 10,
              alignContent: 'center',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color={'white'} />
            ) : step < totalSteps ? (
              <Text style={{ color: 'white' }}>Next</Text>
            ) : (
              <Text style={{ color: 'white' }}>Add New Car</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 16,
  },
  error: {
    color: 'red',
    marginBottom: 8,
  },
  textContainer: {
    position: 'absolute',
    top: 10,
    left: 0,
    width: 80, // approximate width of the text
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
})

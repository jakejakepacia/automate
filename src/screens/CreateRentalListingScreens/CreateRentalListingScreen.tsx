import {
  View,
  Text,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableOpacity,
  Dimensions,
} from 'react-native'
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react'
import NavigationBar from '../../components/NavigationBar'
import { ProgressBar } from 'react-native-paper'
import { Colors } from '../../constants/colors'
import CarPricingScreen from './CarPricingScreen'
import { Button } from 'react-native-paper'
import PickupLocationScreen from './PickupLocationScreen'
import ReviewRentalDetailsScreen from './ReviewRentalDetailsScreen'
const screenWidth = Dimensions.get('window').width
export default function CreateRentalListingScreen({ navigation }) {
  const route = useRoute()
  const car_id = route.params?.car_id
  const totalSteps = 3
  const [step, setStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const insents = useSafeAreaInsets()
  const progress = step / totalSteps
  const animatedValue = useRef(new Animated.Value(0)).current
  const [formData, setFormData] = useState({
    // Step 1
    daily: '',
    weekly: '',
    monthly: '',
    with_driver: false,
    driver_price_per_day: 0,

    //Step 2
    city: '',
    province: '',
    pickup_location: '',
    latitude: '',
    longitude: '',
  })

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

  const updateCarPickupLocation = () => {}

  const addCarRentalPricing = () => {}

  const handleNextButton = () => {
    if (step < totalSteps) {
      setStep(step + 1)
    }

    console.log(step)
    if (step === totalSteps) {
      setIsLoading(true)
    }
  }

  const handlePrevButton = () => {
    if (step > 0) {
      setStep(step - 1)
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0} // adjust if you have header
    >
      <View style={{ marginTop: insents.top }}>
        <NavigationBar
          title={'Create Rental Listing'}
          navigation={navigation}
        />
      </View>

      <View style={{ padding: 16, flex: 1 }}>
        {step === 1 && (
          <CarPricingScreen formData={formData} setFormData={setFormData} />
        )}
        {step === 2 && (
          <PickupLocationScreen formData={formData} setFormData={setFormData} />
        )}
        {step === 3 && (
          <ReviewRentalDetailsScreen
            car_id={car_id}
            formData={formData}
            setStep={setStep}
          />
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
            onPress={handlePrevButton}
            buttonColor="transparent"
            textColor={Colors.primary}
            disabled={step === 1}
          >
            Prev
          </Button>

          <TouchableOpacity
            onPress={handleNextButton}
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
              <Text style={{ color: 'white' }}>Confirm</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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

import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Colors } from '../../constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRoute } from '@react-navigation/native'

export default function AddCarSuccessScreen({ navigation }) {
  const route = useRoute()
  const car_id = route.params?.car_id
  console.log('new car id: ,', car_id)
  const navigateToVehicleListPage = () => {
    navigation.navigate('Tabs', {
      screen: 'Vehicles',
      params: { shouldRefresh: true, fromAddCarPage: true },
    })
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <Text style={styles.title}>Success!</Text>
      <View style={styles.container}>
        {/* Illustration at top */}
        <Image
          source={require('../../../assets/success/new-car-success.png')} // replace with your clipart
          style={styles.image}
          resizeMode="contain"
        />

        <View
          style={{
            backgroundColor: '#F4FFE9',
            borderRadius: 18,
            paddingVertical: 20,
            paddingHorizontal: 18,
            alignItems: 'center',

            shadowColor: '#6BCB3D',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.15,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: '600',
              textAlign: 'center',
              color: '#2E2E2E',
            }}
          >
            Your new car has been added!
          </Text>
        </View>

        <View style={styles.stepContainer}>
          <TouchableOpacity
            style={styles.forRentButton}
            onPress={() =>
              navigation.navigate('CreateRentalListing', {
                car_id: car_id,
              })
            }
          >
            <Text style={styles.step}>Create Rental Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.goHomeBtn}
            onPress={navigateToVehicleListPage}
          >
            <Text style={[styles.step, { color: Colors.primary }]}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingInline: 20,
    backgroundColor: ' #F4FFE9',
  },
  image: {
    width: '100%',
    height: 300,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.success,
    textAlign: 'center',
    fontFamily: 'MyHeaderFontBold',
    marginTop: 20,
  },
  stepContainer: {
    paddingHorizontal: 10,
    marginTop: 35,
    width: '100%',
    gap: 20,
  },
  step: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    fontFamily: 'MyRegularFont',
  },
  forRentButton: {
    backgroundColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  goHomeBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 14,
    paddingVertical: 16,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
})

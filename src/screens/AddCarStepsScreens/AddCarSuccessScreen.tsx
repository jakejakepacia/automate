import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native'
import { Colors } from '../../constants/colors'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function AddCarSuccessScreen({ navigation }) {
  const navigateToVehicleListPage = () => {
    navigation.navigate('Tabs', {
      screen: 'Vehicles',
      params: { shouldRefresh: true, fromAddCarPage: true },
    })
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
      <View style={styles.container}>
        {/* Illustration at top */}
        <Image
          source={require('../../../assets/success/booked_success.jpg')} // replace with your clipart
          style={styles.image}
          resizeMode="cover"
        />

        <Text style={styles.title}>New Car Added!</Text>

        <View style={styles.stepContainer}>
          <TouchableOpacity style={styles.forRentButton}>
            <Text style={styles.step}>Create Rental Listing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.goHomeBtn}
            onPress={navigateToVehicleListPage}
          >
            <Text style={[styles.step, { color: Colors.primary }]}>
              Back to Owned Cars
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  image: {
    width: 200,
    height: 300,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: Colors.primary,
    textAlign: 'center',
    fontFamily: 'MyHeaderFontBold',
  },
  stepContainer: {
    paddingHorizontal: 10,
    marginTop: 50,
    width: '100%',
    gap: 20,
  },
  step: {
    fontSize: 14,
    lineHeight: 22,
    color: 'white',
    fontFamily: 'MyRegularFont',
  },
  forRentButton: {
    backgroundColor: Colors.primary,
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
  goHomeBtn: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 10,
    alignContent: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    height: 50,
  },
})

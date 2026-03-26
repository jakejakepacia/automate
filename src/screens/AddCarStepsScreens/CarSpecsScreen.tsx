import {
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from 'react-native'
import { Divider, TextInput } from 'react-native-paper'
import { Colors } from '../../constants/colors'
import CarCategoriesCard from '../../components/CarCategoriesCard'
import { useEffect, useState } from 'react'
import { CarSpecs } from '../../types/car'

export default function CarSpecsScreen({ formData, setFormData }) {
  const [selected, setSelected] = useState<string | null>(null)
  const [transmission, setTransmission] = useState<'automatic' | 'manual'>(
    'automatic',
  )
  const [gasType, setGasType] = useState<'unleaded' | 'diesel'>('unleaded')

  const carCategories: CarSpecs[] = [
    {
      id: 1,
      category: 'sedan',
      seats: 5,
      title: 'Sedan',
      subtitle: '5 seaters (Vios, Mirage, Honda City)',
      image: require('../../../assets/carCategoriesIcons/sedan.png'),
    },
    {
      id: 2,
      category: 'mpv',
      seats: 7,
      title: 'MPV',
      subtitle: '7 seaters (Innova, Xpander, Veloz)',
      image: require('../../../assets/carCategoriesIcons/car.png'),
    },
    {
      id: 3,
      category: 'suv',
      seats: 7,
      title: 'SUV',
      subtitle: '7 seaters (Fortuner, Montero, Terra)',
      image: require('../../../assets/carCategoriesIcons/suv.png'),
    },
    {
      id: 4,
      category: 'van',
      seats: 15,
      title: 'VAN',
      subtitle: '8-15 seaters (HiAce, Staria, Urvan)',
      image: require('../../../assets/carCategoriesIcons/van.png'),
    },
  ]

  useEffect(() => {
    selectGasType('unleaded')
    selectTransimission('automatic')
  }, [])

  const selectCarCategory = (category: string) => {
    setSelected(category)

    var seats = 0
    if (category == 'sedan') {
      seats = 5
    } else if (category == 'mpv') {
      seats = 7
    } else if (category == 'suv') {
      seats = 7
    } else if (category == 'van') {
      seats = 15
    }

    setFormData((prev) => ({
      ...prev,
      category,
      seats,
    }))
  }

  const selectTransimission = (transmission: string) => {
    setTransmission(transmission == 'automatic' ? 'automatic' : 'manual')
    setFormData((prev) => ({
      ...prev,
      transmission,
    }))
  }

  const selectGasType = (fuel_type: string) => {
    setGasType(fuel_type == 'unleaded' ? 'unleaded' : 'diesel')
    setFormData((prev) => ({
      ...prev,
      fuel_type,
    }))

    console.log(formData)
  }
  return (
    <ScrollView style={{ gap: 10 }} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'MyHeaderFontBold', fontSize: 20 }}>
          Step 1: Specifications{' '}
        </Text>
        <Text style={{ fontFamily: 'MyHeaderFontRegular', fontSize: 16 }}>
          Select the correct specifications to help customers find your car
          faster.
        </Text>
      </View>

      <View style={{ gap: 20, marginTop: 20 }}>
        <FlatList
          data={carCategories}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 5, height: 150 }}
          renderItem={({ item }) => (
            <CarCategoriesCard
              image={item.image}
              title={item.title}
              subtitle={item.subtitle}
              selected={selected === item.category}
              onPress={() => selectCarCategory(item.category)}
            />
          )}
        />

        <View style={styles.specsContainer}>
          <View style={styles.otherSpecsContainer}>
            <Text>Transmission</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    flex: 1,
                    backgroundColor:
                      transmission == 'automatic'
                        ? Colors.primary
                        : 'transparent',
                  },
                ]}
                onPress={() => selectTransimission('automatic')}
              >
                <Text
                  style={{
                    color: transmission == 'automatic' ? 'white' : 'black',
                    textAlign: 'center',
                  }}
                >
                  Automatic
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    flex: 1,
                    backgroundColor:
                      transmission == 'manual' ? Colors.primary : 'transparent',
                  },
                ]}
                onPress={() => selectTransimission('manual')}
              >
                <Text
                  style={{
                    color: transmission == 'manual' ? 'white' : 'black',
                    textAlign: 'center',
                  }}
                >
                  Manual
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <Divider />
          <View style={styles.otherSpecsContainer}>
            <Text>Fuel Type</Text>
            <View style={styles.optionsContainer}>
              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    flex: 1,
                    backgroundColor:
                      gasType == 'unleaded' ? Colors.primary : 'transparent',
                  },
                ]}
                onPress={() => selectGasType('unleaded')}
              >
                <Text
                  style={{
                    color: gasType == 'unleaded' ? 'white' : 'black',
                    textAlign: 'center',
                  }}
                >
                  Unleaded
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.option,
                  {
                    flex: 1,
                    backgroundColor:
                      gasType == 'diesel' ? Colors.primary : 'transparent',
                  },
                ]}
                onPress={() => selectGasType('diesel')}
              >
                <Text
                  style={{
                    color: gasType == 'diesel' ? 'white' : 'black',
                    textAlign: 'center',
                  }}
                >
                  Diesel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* <TextInput
          label="Category"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.category}
          onChangeText={(text) => setFormData({ ...formData, category: text })}
        />

        <TextInput
          label="Transmission"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.transmission}
          onChangeText={(text) =>
            setFormData({ ...formData, transmission: text })
          }
        />

        <TextInput
          label="Fuel Type"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.fuel_type}
          onChangeText={(text) => setFormData({ ...formData, fuel_type: text })}
        />

        <TextInput
          label="Seats"
          mode="outlined"
          keyboardType="numeric"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.seats}
          onChangeText={(text) => setFormData({ ...formData, seats: text })}
        /> */}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  specsContainer: {
    flex: 1,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,

    margin: 8,
  },
  otherSpecsContainer: {
    padding: 20,
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  optionsContainer: {
    backgroundColor: 'lightgrey',
    flexDirection: 'row',
    borderRadius: 12,
  },
  option: {
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
})

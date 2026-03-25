import { Text, View, ScrollView, TouchableOpacity, Image } from 'react-native'
import { Divider, TextInput } from 'react-native-paper'
import { Colors } from '../../constants/colors'
import CarCategoriesCard from '../../components/CarCategoriesCard'
import { useState } from 'react'
export default function CarSpecsScreen({ formData, setFormData }) {

  const [selected, setSelected] = useState<string | null>(null);
  return (
    <ScrollView style={{ gap: 10 }} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'MyHeaderFontBold', fontSize: 20 }}>
          Step 2: Specifications{' '}
        </Text>
        <Text style={{ fontFamily: 'MyHeaderFontRegular', fontSize: 16 }}>
          Select the correct specifications to help customers find your car
          faster.
        </Text>
      </View>

      <View style={{ gap: 20, marginTop: 20 }}>
           
           <View style={{ flexDirection: "row" }}>
      <CarCategoriesCard
        image={require("../../../assets/carCategoriesIcons/sedan.png")}
        title="Sedan"
        subtitle="5 seaters (Vios, Mirage, Honda City)"
        selected={selected == "sedan"}
        onPress={() => setSelected("sedan")}
      />

      <CarCategoriesCard
        image={require("../../../assets/carCategoriesIcons/car.png")}
        title="MPV"
        subtitle="7 seaters (Innova, Xpander, Veloz)"
        selected={selected == "mpv"}
        onPress={() => setSelected("mpv")}
      />
    </View>



           <View style={{backgroundColor: "white"}}>
            <View style={{ flexDirection: "row"}}>
  <TouchableOpacity style={{flex: 1}}>
        <Text>Automatic</Text>
      </TouchableOpacity>
       <TouchableOpacity style={{flex: 1}}>
        <Text>Manual</Text>
      </TouchableOpacity>
            </View>
    <Divider />
           <View style={{ flexDirection: "row"}}>
  <TouchableOpacity style={{flex: 1}}>
        <Text>Automatic</Text>
      </TouchableOpacity>
       <TouchableOpacity style={{flex: 1}}>
        <Text>Manual</Text>
      </TouchableOpacity>
            </View>
    </View>
        <TextInput
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
        />
      </View>
    </ScrollView>
  )
}

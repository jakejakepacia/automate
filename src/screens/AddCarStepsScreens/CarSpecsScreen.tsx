import { Text, View, ScrollView } from 'react-native'
import { TextInput } from 'react-native-paper'
import { Colors } from '../../constants/colors'
export default function CarSpecsScreen({ formData, setFormData }) {
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

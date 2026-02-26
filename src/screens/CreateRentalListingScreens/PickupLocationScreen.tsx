import { Text, View, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { TextInput } from 'react-native-paper'
import { Colors } from '../../constants/colors'
import PickupMap from '../../components/pickupMap'
export default function PickupLocationScreen({ formData, setFormData }) {
  return (
    <ScrollView style={{ gap: 10 }} showsVerticalScrollIndicator={false}>
      <View>
        <Text style={{ fontFamily: 'MyHeaderFontBold', fontSize: 20 }}>
          Step 2: Location{' '}
        </Text>
        <Text style={{ fontFamily: 'MyHeaderFontRegular', fontSize: 16 }}>
          Choose where renters can pick up the vehicle. This helps us show your
          car to nearby users.
        </Text>
        <Text>
          Optional extra tip: You can adjust the pin on the map for precise
          location.
        </Text>
      </View>

      <View style={{ gap: 20, marginTop: 20 }}>
        <TextInput
          label="City"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.city}
          onChangeText={(text) => setFormData({ ...formData, city: text })}
        />

        <TextInput
          label="Province"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.province}
          onChangeText={(text) => setFormData({ ...formData, province: text })}
        />

        <TextInput
          label="Pickup address"
          mode="outlined"
          outlineColor={Colors.primary}
          activeOutlineColor={Colors.primary}
          value={formData.pickup_location}
          onChangeText={(text) =>
            setFormData({ ...formData, pickup_location: text })
          }
        />

        <PickupMap formData={formData} setFormData={setFormData} />
      </View>
    </ScrollView>
  )
}

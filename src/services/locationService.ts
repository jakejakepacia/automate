import * as Location from 'expo-location'

export async function getCityProvince(latitude: number, longitude: number) {
  try {
    const [address] = await Location.reverseGeocodeAsync({
      latitude,
      longitude,
    })

    if (address) {
      const city = address.city || address.subregion || ''
      const province = address.region || ''
      return { city, province }
    }
  } catch (error) {
    console.log('Reverse geocode error', error)
  }

  return { city: '', province: '' }
}

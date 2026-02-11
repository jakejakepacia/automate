import { View, Text, Image, StyleSheet } from "react-native";

export default function CarCard({ car }) {
  const thumbnail =
    car.car_images?.find(img => img.is_thumbnail)?.image_url ||
    car.car_images?.[0]?.image_url;

  return (
    <View style={styles.carCard} id={car.id}>
      {/* Car Image */}
      <Image
        source={{ uri: thumbnail }}
        style={styles.carImage}
        resizeMode="contain"
      />

      {/* Info */}
      <View style={styles.infoContainer}>
        <Text style={styles.carTitle}>
          {car.make} {car.model}
        </Text>
        <Text style={styles.carDetails}>
          {car.year} • {car.color} • {car.city}
        </Text>

        <Text style={styles.carPrice}>
          ₱{car.car_pricing?.[0]?.price_per_day} / day
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carCard: {
    backgroundColor: "#fff",
    flexDirection: "row",
    borderRadius: 12,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3, // for Android shadow
  },
  carImage: {
    width: 100,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-between",
  },
  carTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  carDetails: {
    fontSize: 12,
    color: "#666",
    marginBottom: 8,
  },
  carPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E90FF",
  },
});

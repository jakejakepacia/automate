import { View, Text, StyleSheet, Image } from "react-native";
import { Colors } from "../constants/colors";

export default function BookingNextSteps() {
  return (
    <View style={styles.container}>
      {/* Illustration at top */}
      <Image
        source={require("../../assets/success/booked_success.jpg")} // replace with your clipart
        style={styles.image}
        resizeMode="cover"
      />

      <Text style={styles.title}>Booking Requested!</Text>

      <View style={styles.stepContainer}>
        <Text style={{fontFamily: 'MyRegularBodFont', fontSize: 16}} >What's Next?</Text>
        <Text style={styles.step}>1. The owner will contact you and confirm the availability of the vehicle you requested.</Text>
        <Text style={styles.step}>2. The owner can adjust the pricing based on your rental details and will send the final price to your booking request.</Text>
        <Text style={styles.step}>3. You will confirm the final price and sign online rental documents.</Text>
        <Text style={styles.step}>4. You have successfully booked the vehicle!</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 300,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    color: Colors.primary,
    textAlign: "center",
    fontFamily: 'MyHeaderFontBold'
  },
  stepContainer: {
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 50
  },
  step: {
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 22,
    color: "#333",
    fontFamily: 'MyRegularFont'
  },
});

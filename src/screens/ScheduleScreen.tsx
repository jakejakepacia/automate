import React, { useState } from "react";
import {
  View, Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image
} from "react-native";
import { Calendar } from "react-native-calendars";
import { Colors } from "../constants/colors";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import requestSuccessIcon from "../../assets/success/booked_success.jpg"
import BookingNextSteps from "../components/bookingNextSteps";
import { fetchUserInfo, addBooking } from "../services/api";
import { supabase } from "../../lib/supabase";
import { formatPHP } from "../constants/formatPHP";

export default function ScheduleScreen( { car, onClose, onBookingRequested }){
     const [selectedDate, setSelectedDate] = useState("");
    const today = new Date().toISOString().split("T")[0];
     const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
    const [activePricing, setActivePricing] = useState("")
    const [requestedBooking, setRequestedBooking] = useState(false)
    const [confirmBtnText, setConfirmBtnText] = useState("Request Booking")

     const handleConfirm = () => {
    onBookingRequested();
    onClose();  // 👈 close modal
  };

   const getMarkedDates = () => {
    let marked = {};

    if (startDate && !endDate) {
      marked[startDate] = {
        startingDay: true,
        color: "#4CAF50",
        textColor: "white",
      };
    }

    if (startDate && endDate) {
      let current = new Date(startDate);
      let last = new Date(endDate);

      while (current <= last) {
        const dateString = current.toISOString().split("T")[0];

        if (dateString === startDate) {
          marked[dateString] = {
            startingDay: true,
            color: "#4CAF50",
            textColor: "white",
          };
        } else if (dateString === endDate) {
          marked[dateString] = {
            endingDay: true,
            color: "#4CAF50",
            textColor: "white",
          };
        } else {
          marked[dateString] = {
            color: "#A5D6A7",
            textColor: "white",
          };
        }

        current.setDate(current.getDate() + 1);
      }
    }

    return marked;
  };

  const onDayPress = (day) => {
    if (!startDate || (startDate && endDate)) {
      // First click or reset
      setStartDate(day.dateString);
      setEndDate(null);
    } else {
      // Second click
      if (new Date(day.dateString) < new Date(startDate)) {
        setStartDate(day.dateString);
      } else {
        setEndDate(day.dateString);
      }
    }
  };

  const getDayDifference = () => {
  if (!startDate || !endDate) return 0;

  const start = new Date(startDate);
  const end = new Date(endDate);

  const diffTime = end.getTime() - start.getTime();
  const diffDays = diffTime / (1000 * 60 * 60 * 24);
  return diffDays + 1; // +1 if you want inclusive count
};



const calculateTotalWeeks = (days, pricePerDay, pricePerWeek) => {
    
    const weeks = Math.floor(days / 7)
    const remainingDays = days % 7

    const totalPrice =
  weeks * pricePerWeek +
  remainingDays * pricePerDay;
    return totalPrice
}


const calculateTotalPrice = (totalDays, pricePerDay, pricePerWeek, pricePerMonth) => {
  const months = Math.floor(totalDays / 30);
  const remainingAfterMonths = totalDays % 30;

  const weeks = Math.floor(remainingAfterMonths / 7);
  const remainingDays = remainingAfterMonths % 7;
  
  const totalPrice =
    months * pricePerMonth +
    weeks * pricePerWeek +
    remainingDays * pricePerDay;

  return totalPrice;
};

const days = getDayDifference();
const pricing = car?.car_pricing?.[0];

let rentAmount = 0;

if (days < 7) {
  rentAmount = days * pricing?.price_per_day;
} else if (days < 30) {
  rentAmount = calculateTotalWeeks(days, pricing?.price_per_day, pricing?.price_per_week);
} else {
  rentAmount = calculateTotalPrice(
    days,
    pricing?.price_per_day,
    pricing?.price_per_week,
    pricing?.price_per_month
  );
}

const requestBooking = async () => {
  if (!requestedBooking){

    const session = await supabase.auth.getSession();
const userId = session.data?.session?.user.id;

    const newBooking = {
        car_id: car.id,
  renter_id: userId,
  start_date: startDate, // always YYYY-MM-DD
  end_date: endDate,
  total_price: rentAmount,
  initial_price: rentAmount,
    }

    const result = await addBooking(newBooking);

    if (result){
     setConfirmBtnText("Confirm")
      setRequestedBooking(true)
    }
 
  }else{
    handleConfirm()
  }

}



return(
  <View style= {{flex: 1}}>
    <TouchableOpacity style={{position: "absolute",
      right: 20,
      top: 20,
      zIndex: 100
    }}
    onPress={onClose}>
 <FontAwesome name="close" size={30} color="black" />
    </TouchableOpacity>
   
 <ScrollView style= {{padding: 16, flex: 1}}>
  {!requestedBooking && 
  <View>
  <View style={{marginTop: 20, gap: 15}}>
        <Text style={{textAlign: "center"}}>Rental Pricing</Text>
          <View style={{flexDirection: "row", gap: 10}}>
            <View style={[styles.column, styles.priceContainer, activePricing === "perday" ? { backgroundColor : Colors.primary } : {backgroundColor : Colors.gray} ]}>
                <Text style={styles.priceText}>Per day</Text>
                <Text style={styles.priceText}>{formatPHP(car?.car_pricing?.[0].price_per_day)} </Text>
             </View>

             <View style={[styles.column, styles.priceContainer]}>
                <Text style={styles.priceText}>Per week</Text>
                <Text style={styles.priceText}>{formatPHP(car?.car_pricing?.[0].price_per_week) }</Text>
              </View>

            <View style={[styles.column, styles.priceContainer]}>
                <Text style={styles.priceText}>Per Month</Text>
                <Text style={styles.priceText}>{formatPHP(car?.car_pricing?.[0].price_per_month) }</Text>
            </View>
          </View>
      </View>
    <View style={{ flex: 1 }}>
        <Text>{selectedDate}</Text>
        <Calendar
           minDate={today}
         markingType="period"
        onDayPress={onDayPress}
        markedDates={getMarkedDates()}

            theme={{

          todayTextColor: "#FF5722",

          selectedDayBackgroundColor: "#4CAF50",
          selectedDayTextColor: "#ffffff",

          dayTextColor: "#2d4150",
          textDisabledColor: "#d9e1e8",

          arrowColor: Colors.primary,
          monthTextColor: Colors.primary,

          textMonthFontWeight: "bold",
          textDayFontWeight: "500",
          textMonthFontSize: 20,
         }} />

        <View style={{gap: 20}}>
  <View style={styles.infoContainer}>
  <View style={styles.column}>
            <Text style={styles.infoTitle}>Total Days</Text>
            {startDate && endDate && (
        <Text style={styles.info}>
            { getDayDifference()}
        </Text> )}
        { !startDate || !endDate &&
            <Text style={styles.info}>0</Text>
        }
        </View>
  
    <View  style={styles.column}>
    <Text  style={styles.infoTitle}>Area</Text>
    <Text style={styles.info}>{car.province}</Text>
    </View>

 
   
    </View>

<View style={styles.column}>
  <Text style={styles.infoTitle}>Rent Amount</Text>
  <Text style={styles.info}>{formatPHP(rentAmount)}</Text>
  <Text style={styles.infoTitle}>Amount may varies</Text>
</View>

        </View>

       
    </View>
  </View>
   
  }

  {requestedBooking && 
  <View >
  
  
     <View>
      <BookingNextSteps />
    </View>
  </View>
  

  }
 

  
    </ScrollView>

    <TouchableOpacity style={[styles.button,  styles.buttonPosition]} onPress={() => requestBooking()}>
          <Text style={styles.buttonText}>{confirmBtnText}</Text>
        </TouchableOpacity>
  </View>
   
   
      

)
}

const styles = StyleSheet.create({
    infoContainer:{
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignContent: "center",
        marginTop: 50
    },
    infoTitle: {
        fontSize: 14,
    },
    column: {
  flex: 1,              
  alignItems: "center", // center content horizontally
},
    info:{
        textAlign: "center",
        fontSize: 18,
        fontFamily: 'MyHeaderFontBold',
        
        color: Colors.primary,
    },
    priceContainer: {
        backgroundColor: Colors.gray,
        borderRadius: 50,
        paddingVertical: 10
    },
    priceText:{
        color: Colors.secondary,
        fontFamily: 'MySubHeaderFontSemiBold',
        fontSize: 12
    },
     button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.primary,

  },
  buttonText: {
 color:"white",
        fontFamily: 'MySubHeaderFontSemiBold',
        fontSize: 16
  },
  buttonPosition:{
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
  }
})

import { StyleSheet, View, TouchableOpacity, Text} from "react-native"
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Colors } from "../constants/colors";
export default function NavigationBar({ title, navigation }){

    const handleBackNavigation = () => {
        navigation.goBack();
    }

    return (
            <View style={styles.header}>
                <TouchableOpacity onPress={handleBackNavigation} style={styles.iconBtn}>
                    <MaterialIcons name="arrow-back-ios" size={20} color={Colors.black} />
                </TouchableOpacity>
        
        <View style={{ alignItems: "center"}}>
         <Text style={styles.title}>{title}</Text>
        
        </View>
        
                    </View>
    )
}

const styles = StyleSheet.create({
     header: {
        flexDirection: "row",
        paddingHorizontal: 16,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center"
    },
        iconBtn: { padding: 6,
            position: "absolute",
            left: 16
         },
     title: {
        fontFamily: 'MySubHeaderFontSemiBold',
        fontSize: 16,
        textAlign: "center",
        
    },
})
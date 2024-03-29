import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { fontFamily } from "../../../styles/fontStyles";
import ButtonSecondary from "../../common/ButtonSecondary/ButtonSecondary";

const PendingBooking = ({ history, onPress, actionBtn, actionBtnTitle, actionBtn2, actionBtnTitle2 }) => {
  return (
    <Pressable onPress={onPress} style={styles.historyWrapper}>
      <Text style={[fontFamily.poppins500, styles.title]}>
        Booking ID: {history.id}
      </Text>
      <Text style={[fontFamily.poppins500]}>{history.customerName}</Text>
      <Text style={[fontFamily.poppins400]}>{history.address}</Text>
      <View style={styles.dateTime}>
        <Text>{new Date(history.bookingDate).toLocaleDateString()}</Text>
      </View>
      <View style={styles.status}>
        <View style={{width: 15, height: 15, borderRadius: 20, backgroundColor: history.bookingStatus == 'Completed' ? 'green' : (history.bookingStatus == 'Pending' ? 'yellow' : 'red') }}>
        </View>
        <View>
            <Text>{history.status}</Text>
        </View>
    </View>
    </Pressable>
  );
};

export default PendingBooking;

const styles = StyleSheet.create({
  historyWrapper: { 
    width: "90%",
    padding: 10,
    borderRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
    margin: 5
},
    title: {
        fontSize: 18
    },
    dateTime: {
        flexDirection: 'row',
        gap: 30
    },
    status: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center',
        gap: 10
    }    
});

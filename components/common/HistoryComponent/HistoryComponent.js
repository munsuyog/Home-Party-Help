import React from "react";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { fontFamily } from "../../../styles/fontStyles";
import ButtonSecondary from "../ButtonSecondary/ButtonSecondary";

const HistoryComponent = ({ history, onPress, actionBtn, actionBtnTitle }) => {
  return (
    <Pressable onPress={onPress} style={styles.historyWrapper}>
      <Text style={[fontFamily.poppins500, styles.title]}>
        Booking ID: {history.id}
      </Text>
      <Text style={[fontFamily.poppins500]}>{history.providerDetails.service} - {history.providerDetails.name}</Text>
      <View style={styles.dateTime}>
        <Text>{history.bookingDate.toLocaleString()}</Text>
      </View>
        {actionBtn ? (
            <View style={{marginTop: 10}}>
                <ButtonSecondary onPress={actionBtn} title={actionBtnTitle} color />
            </View>
        ): (
        <View style={styles.status}>
        <View style={{width: 15, height: 15, borderRadius: 20, backgroundColor: history.status == ' completed' ? 'green' : (history.status == 'pending' ? 'yellow' : 'red') }}>
        </View>
        <View>
            <Text>{history.status}</Text>
        </View>
    </View>
    )}
    </Pressable>
  );
};

export default HistoryComponent;

const styles = StyleSheet.create({
  historyWrapper: { 
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

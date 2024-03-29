import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text, TouchableWithoutFeedback, ScrollView, TextInput, Pressable } from "react-native";
import RNDateTimePicker from "@react-native-community/datetimepicker";
import { fontFamily } from "../../../../styles/fontStyles";
import ButtonSecondary from "../../../../components/common/ButtonSecondary/ButtonSecondary";
import axios from "axios";
import { encode } from "base-64";
import { router, useLocalSearchParams } from "expo-router";
import { getUserData } from "../../../../utils/useSecureStorage";
import { createOrder } from "../../../../utils/firebase";


const BookingForm = () => {
  const [userData, setUserData] = useState({})

  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserData(userData);
      setObject({...object, customerId: userData?.id})
    };
    fetchUserData();
  }, []);
  const params = useLocalSearchParams();
  const personInfo = params;
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [totalHours, setTotalHours] = useState(null);

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [hoursOfWorkPerDay, setHoursOfWorkPerDay] = useState('1');
  const [customerName, setCustomerName] = useState(null);
  const [subTotal, setSubtotal] = useState(0);
  const [object, setObject] = useState({
    status: "pending",
    bookingDate: new Date(),
    providerDetails: personInfo,
    customerId: userData.id,
    providerId: personInfo.id,
    hoursOfWorkPerDay: "1",
  });

  const [loading, setLoading] = useState(false);
  const [checkoutURL, setCheckoutURL] = useState(null);
  console.log(checkoutURL);

  const paypalConfig = {
    clientId:
      "AdecUxsakpcFbkQRFn8DUXEPc6gSt6R-UOTOssl1yL5Qfx9VJOGN9S4Uh9X7DLdQOwTUTuvpPHzv6-fM",
    clientSecret:
      "EEOrlP6vF3JBXVMqqHv_w86_JFwcN6iCnvOutdMs_Xl99t29IkX_WMntV7cxIKeaz0hh0JvdStuZB3Dz",
    environment: "live", // or 'live' for production
  };

  const onChangeFromDate = (event, selectedDate) => {
    const currentDate = selectedDate || fromDate;
    setShowFromDatePicker(false);
    setFromDate(currentDate);
    setObject({ ...object, fromDate: currentDate });
  };

  const onChangeToDate = (event, selectedDate) => {
    const currentDate = selectedDate || toDate;
    setShowToDatePicker(false);
    setToDate(currentDate);
    setObject({ ...object, toDate: currentDate });
  };

  const showFromDatepickerModal = () => {
    setShowFromDatePicker(true);
  };

  const showToDatepickerModal = () => {
    setShowToDatePicker(true);
  };

    // Function to handle incrementing the hours of work per day
    const incrementHours = () => {
      const incrementedHours = parseInt(hoursOfWorkPerDay || 0) + 1;
      setHoursOfWorkPerDay(incrementedHours.toString());
      setObject({ ...object, hoursOfWorkPerDay: incrementedHours.toString() });
    };

    console.log(subTotal)
  
    // Function to handle decrementing the hours of work per day
    const decrementHours = () => {
      const decrementedHours = parseInt(hoursOfWorkPerDay || 0) - 1;
      if (decrementedHours > 0) { // Check if decremented value is greater than zero
        setHoursOfWorkPerDay(decrementedHours.toString());
        setObject({ ...object, hoursOfWorkPerDay: decrementedHours.toString() });
      }
    };
    const calculateAmount = (price, service) => {
      if(service == 'bartender') {
        const amount = price * 3
        return amount
      }
      else if(service == 'dj-artist') {
        const amount = price * 2
        return amount
      }
      else if(service == 'home-helper') {
        const amount = price * 2.75
        return amount
  
      }
    }
    const proceedToPayment = async () => {
      setLoading(true);
      try {
        const credentials = `${paypalConfig.clientId}:${paypalConfig.clientSecret}`;
        const encodedCredentials = encode(credentials);
  
        const response = await axios.post(
          "https://api-m.paypal.com/v1/oauth2/token",
          "grant_type=client_credentials",
          {
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${encodedCredentials}`,
            },
          }
        );
  
        const accessToken = response.data.access_token;
  
        const paymentResponse = await axios.post(
          "https://api-m.paypal.com/v2/checkout/orders",
          {
            intent: "CAPTURE",
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: subTotal,
                },
              },
            ],
            application_context: {
              return_url: "https://example.com/success", // Replace with your actual return URL
              cancel_url: "https://example.com/failure", // Replace with your actual cancel URL
            }
          },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        const checkoutLink = paymentResponse.data.links.find(
          (link) => link.rel === "approve"
        );
  
        if (checkoutLink) {
          setCheckoutURL(checkoutLink.href);
          setObject({...object, paymentDetails: {...object.paymentDetails, subTotal: subTotal, status: 'pending', transactionId: paymentResponse.data.id}})
          router.navigate({pathname: '/customer/app/Services/WebView', params: {url: checkoutLink.href, booking: JSON.stringify(object)}});
        } else {
          console.error("PayPal checkout URL not found");
        }
      } catch (error) {
        console.error("PayPal Error: ", error);
      } finally {
        setLoading(false);
      }
    };

    console.log(object)
  
    useEffect(() => {
      if (
        fromDate &&
        toDate &&
        hoursOfWorkPerDay !== null &&
        hoursOfWorkPerDay !== ""
      ) {
        const daysDifference =
          Math.floor((toDate - fromDate) / (1000 * 60 * 60 * 24)) + 1;
        const totalHoursDiff =
          daysDifference * parseInt(hoursOfWorkPerDay) === 0
            ? 1
            : daysDifference * parseInt(hoursOfWorkPerDay);
    
        const newSubtotal = calculateAmount(personInfo.hourlyRate, personInfo.service) * totalHoursDiff;
        
        setObject(prevObject => ({
          ...prevObject,
          paymentDetails: {
            ...prevObject.paymentDetails,
            status: "pending",
            subTotal: newSubtotal
          },
        }));
    
        setTotalHours(totalHoursDiff);
        setSubtotal(newSubtotal);
      }
    }, [fromDate, toDate, hoursOfWorkPerDay]);
    
    

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setShowFromDatePicker(false);
        setShowToDatePicker(false);
      }}
    >
      <ScrollView
        style={{
          paddingTop: "5%",
          paddingBottom: "5%",
          backgroundColor: "white",
        }}
      >
        <View style={styles.container}>
          <View style={styles.dateContainer}>
            <View style={styles.dateTimeContainer}>
              <Text style={fontFamily.poppins400}>From Date: </Text>
              <TouchableWithoutFeedback onPress={showFromDatepickerModal}>
                <View>
                  <Text style={styles.input}>
                    {fromDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              {showFromDatePicker && (
                <RNDateTimePicker
                  value={fromDate}
                  mode="date"
                  display="default"
                  onChange={onChangeFromDate}
                />
              )}
            </View>
            <View style={styles.dateTimeContainer}>
              <Text style={fontFamily.poppins400}>To Date: </Text>
              <TouchableWithoutFeedback onPress={showToDatepickerModal}>
                <View>
                  <Text style={styles.input}>
                    {toDate.toLocaleDateString()}
                  </Text>
                </View>
              </TouchableWithoutFeedback>
              {showToDatePicker && (
                <RNDateTimePicker
                  value={toDate}
                  mode="date"
                  display="default"
                  onChange={onChangeToDate}
                />
              )}
            </View>
          </View>
          <View style={styles.formMainContainer}>
          <View style={styles.formContainer}>
      <Text style={styles.formHead}>Hours of work per day: </Text>
      <View style={styles.hoursOfWorkContainer}>
        {/* Decrement button */}
        <Pressable onPress={decrementHours} style={styles.hoursOfWorkButton}>
          <Text style={styles.hoursOfWorkButtonText}>-</Text>
        </Pressable>
        {/* Input field */}
        <TextInput
          placeholder="Hours of work per day"
          value={hoursOfWorkPerDay}
          onChangeText={(value) => {
            setHoursOfWorkPerDay(value);
            setObject({ ...object, hoursOfWorkPerDay: value });
          }}
          keyboardType="numeric"
          style={styles.inputBox}
        />
        {/* Increment button */}
        <Pressable onPress={incrementHours} style={styles.hoursOfWorkButton}>
          <Text style={styles.hoursOfWorkButtonText}>+</Text>
        </Pressable>
      </View>
    </View>
            <View style={styles.formContainer}>
              <Text style={styles.formHead}>Name: </Text>
              <TextInput
                placeholder="Name of the Customer"
                value={customerName}
                onChangeText={(value) => {
                  setCustomerName(value);
                  setObject({ ...object, customerName: value });
                }}
                style={styles.inputBox}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formHead}>Address of Delivery: </Text>
              <TextInput
                placeholder="Enter the address"
                onChangeText={(value) => {
                  setObject({ ...object, address: value });
                }}
                style={styles.inputBox}
              />
            </View>
            <View style={styles.formContainer}>
              <Text style={styles.formHead}>City: </Text>
              <TextInput
                placeholder="Enter City"
                onChangeText={(value) => {
                  setObject({ ...object, city: value });
                }}
                style={styles.inputBox}
              />
            </View>
          </View>
          <View>
            <View style={styles.rateWrapper}>
              <Text style={styles.rateText}>Total Rate: </Text>
              <Text style={styles.hourlyRate}>
                ${calculateAmount(personInfo.hourlyRate, personInfo.service)}
              </Text>
            </View>
            <View style={styles.rateWrapper}>
              <Text style={styles.rateText}>Subtotal: </Text>
              {/* Provider CHarges * 2/3/4 - ProviderCHarges */}
              <Text style={styles.hourlyRate}>
                ${subTotal}
              </Text>
            </View>
          </View>
          <View style={{ marginTop: "5%" }}>
            <ButtonSecondary
              title="Pay with Paypal"
              width={200}
              height={50}
              color="#EF4F5F"
              onPress={proceedToPayment}
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

export default BookingForm;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Poppins_400Regular",
    width: "100%",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    gap: 50,
  },
  dateTimeContainer: {
    flexDirection: "column",
  },
  input: {
    height: 40,
    width: 120,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    paddingTop: 10,
    borderColor: "#EF4F5F",
    borderRadius: 10,
  },
  inputBox: {
    padding: 8,
    borderWidth: 1,
    borderColor: "#EF4F5F",
    borderRadius: 10,
  },
  formContainer: {
    width: "90%",
    marginBottom: 15,
  },
  formMainContainer: {
    width: "100%",
    alignItems: "center",
  },
  formHead: {
    fontFamily: "Poppins_400Regular",
  },
  rateWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
  },
  rateText: {
    fontFamily: "Poppins_400Regular",
    fontSize: 20,
  },
  hourlyRate: {
    color: "green",
    fontFamily: "Poppins_400Regular",
    fontSize: 20,
  },
  serviceCharge: {
    color: "red",
    fontFamily: "Poppins_400Regular",
    fontSize: 20,
  },
  hoursOfWorkContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center'
  },
  hoursOfWorkButton: {
    backgroundColor: "#EF4F5F",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 5,
    marginHorizontal: 5,
  },
  hoursOfWorkButtonText: {
    color: "white",
    fontSize: 20,
  },
});

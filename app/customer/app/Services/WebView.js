import React, { useEffect } from 'react';
import { WebView } from 'react-native-webview';
import { useLocalSearchParams, router } from 'expo-router';
import { createOrder } from '../../../../utils/firebase';

const WebViewComponent = () => {
    const { url } = useLocalSearchParams();
    const param = useLocalSearchParams();
    const bookingDetails = JSON.parse(param.booking)
    console.log(bookingDetails)

    const handleNavigationStateChange = async (newNavState) => {
      console.log(newNavState.url);
      if (newNavState.url.includes('success')) {
          // Update payment status if paymentDetails is defined
          if (bookingDetails.paymentDetails) {
              bookingDetails.paymentDetails.status = 'success';
          }
          await createOrder(bookingDetails);
          router.push({pathname: '/customer/app/Services/SuccessPage', params: {id: bookingDetails.providerDetails.id}});
      } else if (newNavState.url.includes('failure')) {
          router.push('/customer/app/Services/ErrorPage');
      }
  };
  

    return <WebView source={{ uri: url }} onNavigationStateChange={handleNavigationStateChange}  />;
};

export default WebViewComponent;

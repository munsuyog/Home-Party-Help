import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const TermsAndConditions = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Terms and Conditions</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>1. Definitions</Text>
        <Text style={styles.text}>
          BARTENDER AND DJ FOR HOME: Refers to the mobile application and website where users can request bartender and DJ services.
          {'\n\n'}
          User: Refers to the person(s) using the BARTENDER AND DJ FOR HOME App to request bartender and DJ services.
          {'\n\n'}
          Service Provider: Refers to the bartender or DJ who provides their services through the BARTENDER AND DJ FOR HOME App.
          {'\n\n'}
          Service: Refers to bartender and DJ services offered through the App.
          {'\n\n'}
          Event: Refers to the specific occasion or gathering for which the User requests bartender and DJ services.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>2. Service Booking and Payment</Text>
        <Text style={styles.text}>
          2.1. Service Request: Users can request bartender and DJ services through the Home App by specifying the date, time, location, and any special requirements for their event.
          {'\n\n'}
          2.2. Service Confirmation: Service Providers will confirm or decline service requests based on their availability. Users will be notified of the confirmation status.
          {'\n\n'}
          2.3. Payment: Users agree to pay the agreed-upon fees for the services provided by the Service Provider. Payments are processed through the BARTENDER AND DJ FOR HOME App, and users must provide accurate payment information.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>3. Service Provider Obligations</Text>
        <Text style={styles.text}>
          3.1. Professionalism: Service Providers must conduct themselves in a professional and respectful manner during events. They should arrive punctually and adhere to any special requests made by the User.
          {'\n\n'}
          3.2. Licensing and Permits: Service Providers are responsible for obtaining any necessary licenses, permits, or certifications required for providing bartender or DJ services in their area.
          {'\n\n'}
          3.3. Equipment and Supplies: Service Providers must bring their own equipment and supplies necessary to perform their services unless otherwise specified in the service request.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>4. User Obligations</Text>
        <Text style={styles.text}>
          4.1. Accurate Information: Users must provide accurate and complete information when requesting bartender and DJ services, including the date, time, and location of the event.
          {'\n\n'}
          4.2. Payment: Users agree to pay the agreed-upon fees promptly through the BARTENDER AND DJ FOR HOME App.
          {'\n\n'}
          4.3. Safety: Users are responsible for ensuring the safety of their guests during events and for providing a safe working environment for the Service Provider.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>5. Cancellations and Refunds</Text>
        <Text style={styles.text}>
          5.1. Cancellations by Users: Users may cancel a service request, but cancellation fees may apply as specified in the cancellation policy.
          {'\n\n'}
          5.2. Cancellations by Service Providers: Service Providers may cancel a confirmed service request due to unforeseen circumstances. In such cases, every effort will be made to find a replacement Service Provider, or a full refund will be issued to the User.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>6. Liability</Text>
        <Text style={styles.text}>
          6.1. Limitation of Liability: BARTENDER AND DJ FOR HOME App and its operators are not liable for any damages, injuries, or losses incurred during or as a result of the services provided by Service Providers.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>7. Privacy</Text>
        <Text style={styles.text}>
          7.1. Data Usage: BARTENDER AND DJ FOR HOME App may collect and use user data as described in our Privacy Policy. By using our platform, you consent to our data practices.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
        <Text style={styles.text}>
          8.1. Modification of Terms: Home App reserves the right to modify these Terms at any time. Users will be notified of any changes, and continued use of the platform constitutes acceptance of the modified Terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>9. Termination</Text>
        <Text style={styles.text}>
          9.1. Termination: BARTENDER AND DJ FOR HOME App reserves the right to terminate user accounts or restrict access to the platform for violations of these Terms.
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>10. Governing Law</Text>
        <Text style={styles.text}>
          10.1. Jurisdiction: These Terms are governed by and construed in accordance with the laws of [USA].
        </Text>
      </View>

      <Text style={styles.contactText}>Contact Us: support@bartenderdj.com</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
  contactText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 20,
  },
});

export default TermsAndConditions;

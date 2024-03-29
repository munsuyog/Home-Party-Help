import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const CustomerPrivacy = () => {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Privacy Policy</Text>
      <Text style={styles.text}>
        Welcome to the Bartender and DJ for Home App. We are committed to
        protecting your privacy and ensuring the security of your personal
        information. This Privacy Policy explains how we collect, use,
        disclose, and protect your data when you use our App, whether you are a
        customer or a job seeker (bartender or DJ).
      </Text>

      <Text style={styles.sectionTitle}>1. Information We Collect</Text>
      <Text style={styles.text}>
        <Text style={styles.subTitle}>1.1. Information Provided by You</Text>
        {'\n\n'}
        When you create an account or use our App, you may provide personal
        information such as your name, email address, phone number, and payment
        information.
        {'\n\n'}
        As a job seeker (bartender or DJ), you may provide additional
        information, including your professional qualifications and experience.
        {'\n\n'}
        <Text style={styles.subTitle}>1.2. Automatically Collected
        Information</Text>
        {'\n\n'}
        We collect certain technical information automatically, including your
        IP address, device type, operating system, and app usage data through
        cookies and similar tracking technologies.
      </Text>

      <Text style={styles.sectionTitle}>2. How We Use Your Information</Text>
      <Text style={styles.text}>
        We use the information you provide to create and manage your account,
        process payments, connect customers with bartenders and DJs, and
        facilitate communication between users.
        {'\n\n'}
        Job seekers' information is used for matching them with available job
        opportunities and verifying qualifications.
      </Text>

      <Text style={styles.sectionTitle}>3. Sharing Your Information</Text>
      <Text style={styles.text}>
        We may share your information with other users to facilitate service
        requests and bookings. For example, customers may see bartenders' or
        DJs' profiles, and vice versa.
        {'\n\n'}
        Your information may be shared with third-party service providers to
        process payments, conduct background checks, or improve our App's
        functionality.
      </Text>

      <Text style={styles.sectionTitle}>4. Your Privacy Choices</Text>
      <Text style={styles.text}>
        You can access, update, or delete your account information at any time
        through the App.
        {'\n\n'}
        You can manage your communication preferences and opt out of promotional
        emails or notifications.
      </Text>

      <Text style={styles.sectionTitle}>5. Data Security</Text>
      <Text style={styles.text}>
        We take reasonable security measures to protect your information,
        including encryption, access controls, and regular security assessments.
      </Text>

      <Text style={styles.sectionTitle}>6. Data Retention</Text>
      <Text style={styles.text}>
        We retain your data as long as necessary for the purposes outlined in
        this Privacy Policy or as required by law.
      </Text>

      <Text style={styles.sectionTitle}>7. Children's Privacy</Text>
      <Text style={styles.text}>
        Our App is not intended for children under the age of 18. We do not
        knowingly collect data from individuals under 18 years of age.
      </Text>

      <Text style={styles.sectionTitle}>8. Changes to this Privacy Policy</Text>
      <Text style={styles.text}>
        We may update this Privacy Policy from time to time to reflect changes
        in our practices or applicable laws. Any updates will be posted on the
        App.
      </Text>

      <Text style={styles.sectionTitle}>9. Contact Us</Text>
      <Text style={styles.text}>
        If you have any questions, concerns, or requests related to your privacy
        or this Privacy Policy, please contact us.
      </Text>

      <Text style={styles.sectionTitle}>10. Consent to Terms</Text>
      <Text style={styles.text}>
        By using the App, you consent to the terms and practices described in
        this Privacy Policy.
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#F5F5F5',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 20,
    color: '#333',
  },
  subTitle: {
    fontWeight: 'bold',
    color: '#555',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#555',
  },
});

export default CustomerPrivacy;

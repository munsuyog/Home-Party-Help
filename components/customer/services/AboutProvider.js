// AboutProviderModal.js

import React from 'react';
import { Modal, View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import ButtonSecondary from '../../common/ButtonSecondary/ButtonSecondary';

const AboutProviderModal = ({ visible, providerInfo, onClose }) => {
  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.aboutTitle}>About Provider</Text>
          {providerInfo.about ? (
            <Text style={styles.aboutText}>{providerInfo.about.info}</Text>
          ) : (
            <Text style={styles.aboutNotUpdated}>About is not updated.</Text>
          )}
          {providerInfo.about && providerInfo.about.gallery && (
            <>
              <Text style={styles.galleryTitle}>Gallery</Text>
              <View style={styles.imageContainer}>
                {providerInfo.about.gallery.map((image, index) => (
                  <Image key={index} source={{ uri: image }} style={styles.image} />
                ))}
              </View>
            </>
          )}
          <ButtonSecondary title="Close" onPress={onClose} />
        </ScrollView>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  aboutTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  aboutText: {
    fontSize: 16,
    marginBottom: 20,
  },
  aboutNotUpdated: {
    fontSize: 16,
    marginBottom: 20,
    color: 'gray',
    fontStyle: 'italic',
  },
  galleryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 20,
  },
  image: {
    width: 150,
    height: 150,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default AboutProviderModal;

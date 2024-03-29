// @ts-ignore 
import { initializeApp } from "firebase/app";
import { useState, useEffect } from "react";
import { initializeAuth, createUserWithEmailAndPassword, getReactNativePersistence, signInWithEmailAndPassword } from "firebase/auth";
import {getStorage, ref, uploadBytes, getDownloadURL} from 'firebase/storage'
import {doc, getDoc, getFirestore, setDoc, getDocs, collection, query, where, onSnapshot, addDoc, orderBy, collectionGroup, updateDoc } from 'firebase/firestore'
import * as Notifications from 'expo-notifications';
import AsyncStorage from "@react-native-async-storage/async-storage";

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyD6rDqFbvobVJL-RuUiRhd0zL3EtzqsPi0",
    authDomain: "chatapp-6131e.firebaseapp.com",
    databaseURL: "https://chatapp-6131e-default-rtdb.firebaseio.com",
    projectId: "chatapp-6131e",
    storageBucket: "chatapp-6131e.appspot.com",
    messagingSenderId: "117924893445",
    appId: "1:117924893445:web:451643480c022d05de9d6c",
    measurementId: "G-HEQS56NX76"
  };


    const app = initializeApp(firebaseConfig);
    const auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage)
      });;

  const db = getFirestore();
  

  const uploadImageToStorage = async (fileUrl, userId) => {
    try {
        // Get reference to the storage service
        const storage = getStorage();
        const fileExtension = fileUrl.split('.').pop();
        // Create a reference to the storage location with custom filename
        const imageRef = ref(storage, `profiles/${userId}.${fileExtension}`);

        // Fetch the image file data
        const response = await fetch(fileUrl);
        const fileData = await response.blob();

        // Upload file data to the storage reference
        const snapshot = await uploadBytes(imageRef, fileData);
        const downloadURL = await getDownloadURL(snapshot.ref);
        return downloadURL
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

  export const checkIfUserIsLoggedIn = async () => {
    try {
        // Check if user credentials are stored locally
        if (email && password) {
            // Attempt to sign in with stored credentials
            const userCredential = await signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            const userRef=doc(db, service, user.uid);
            const userInfo = await getDoc(userRef)
            console.log(userInfo)
            return userInfo.data();
        } else {
            console.log('No stored credentials found.');
        }
    } catch (error) {
        console.error('Error checking user login status:', error);
    }
};


  export const CustomerSignup = async (email, password, object) => {
      try {
          const userCredential = await createUserWithEmailAndPassword(auth, email, password);
          const user = userCredential.user;
          console.log('User signed up:', user.uid);
        //   const imageUrl = await uploadImageToStorage(object.imageUri, user.uid);
        //   object.imageUri = imageUrl
          await setDoc(doc(db, "Customers", user.uid), object);
          return user;
      } catch (error) {
          console.error('Sign up error:', error);
          throw error;
      }
  };
  export const ProviderSignup = async (email, password, object, service) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed up:', user.uid);
        const imageUrl = await uploadImageToStorage(object.imageUri, user.uid);
        object.imageUri = imageUrl
        object.service = service
        await setDoc(doc(db, "Providers", user.uid), object);
        const userRef = doc(db, "Providers", user.uid);
        const userInfo = await getDoc(userRef)
        return userInfo.data();
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
};
  
  export const onSigninPress = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userRef=doc(db, "Customers", user.uid);
        const userInfoRef = await getDoc(userRef)
        const userInfo = userInfoRef.data()
        const userData = {...userInfo,id: user.uid}
        return userData;
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
};

export const loginProvider = async (email, password, service) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Fetching user document
        const userRef = doc(db, "Providers", user.uid);
        const userInfoRef = await getDoc(userRef);
        
        // Checking if user exists and service matches
        if (userInfoRef.exists()) {
            const userInfo = userInfoRef.data();
            if (userInfo.service === service) {
                // Constructing user data with additional id field
                const userData = { ...userInfo, id: user.uid };
                return userData;
            } else {
                console.error(`User is not authorized for ${service}`);
                throw new Error(`User is not authorized for ${service}`);
            }
        } else {
            console.error('User document not found.');
            throw new Error('User document not found.');
        }
    } catch (error) {
        console.error('Sign in error:', error);
        throw error;
    }
};


export async function getDocumentsByService(service) {
    const providerRef = collection(db, 'Providers');
    const q = query(providerRef, where('service', '==', service));

    try {
        const querySnapshot = await getDocs(q);
        const documents = [];
        querySnapshot.forEach((doc) => {
            documents.push({ id: doc.id, data: doc.data() });
        });
        return documents;
    } catch (error) {
        console.error('Error getting documents: ', error);
        throw error;
    }
}

export const useChatMessages = (customerId, providerId) => {
    const [messages, setMessages] = useState([]);
    const [chatroomId, setChatroomId] = useState('');

    useEffect(() => {
        if (customerId && providerId) {
            // Generate chatroomId based on the order of IDs
            const id1 = `${customerId}_${providerId}`;
            const id2 = `${providerId}_${customerId}`;
            const chatId = customerId.localeCompare(providerId) === -1 ? id1 : id2;
            setChatroomId(chatId);

            const unsubscribe = onSnapshot(query(collection(db, `messages/${chatId}/messages`), orderBy('createdAt', 'desc')), (snapshot) => {
                const messageData = [];
                snapshot.forEach((doc) => {
                    const data = doc.data();
                    const createdAt = data.createdAt.toDate(); // Convert Firestore Timestamp to JavaScript Date object
                    const message = {
                        _id: doc.id,
                        ...data,
                        createdAt,
                        user: { _id: data.senderId },
                        receiverName: data.receiverName, // Add receiver name
                        senderName: data.senderName // Add sender name
                    };
                    messageData.push(message);
                });
                // Sort messages by createdAt in descending order
                messageData.sort((a, b) => b.createdAt - a.createdAt);
                setMessages(messageData);
            });

            return () => unsubscribe();
        }
    }, [customerId, providerId]);

    const sendMessage = async (senderId, senderName, receiverId, receiverName, text) => {
        try {
            if (customerId && providerId) {
                await addDoc(collection(db, `messages/${chatroomId}/messages`), {
                    senderId,
                    senderName,
                    receiverId,
                    receiverName,
                    text,
                    createdAt: new Date() // Use JavaScript Date object for createdAt
                });
            } else {
                console.error('customerId and/or providerId is undefined');
            }
        } catch (error) {
            console.error("Error sending message: ", error);
        }
    };

    return { messages, sendMessage };
};


export async function getConversationsByUser(userId) {
    try {
        const conversations = [];
        const q = query(collectionGroup(db, 'messages'));
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.receiverId === userId || data.senderId === userId) {
                // Check for both possible combinations of sender and receiver IDs
                conversations.push({ id: doc.id, ...data });
            } else if (data.receiverId === userId || data.senderId === userId) {
                // Check for the switched IDs combination
                conversations.push({ id: doc.id, ...data });
            }
        });
        return conversations;
    } catch (error) {
        console.error('Error getting conversations by user: ', error);
        throw error;
    }
}



export async function createOrder(orderData) {
    try {
        // Add the order to the "orders" collection
        const docRef = await addDoc(collection(db, 'orders'), orderData);
        console.log('Order created with ID: ', docRef.id);
        return docRef.id; // Return the ID of the newly created order document
    } catch (error) {
        console.error('Error creating order: ', error);
        throw error;
    }
}

export async function getOrdersByStatus() {
    try {
        const ordersByStatus = {
            pending: {},
            completed: {},
            awaiting: {},
            confirmed: {}
        };

        // Create a query using collectionGroup to query all collections
        const q = query(collectionGroup(db, 'orders'));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            order.id = doc.id
            console.log(doc.id)
            const status = order.status;

            // if (order.bookingDate) {
            //     order.bookingDate = order.bookingDate.toDate();
            // }

            // Categorize the order based on its status
            if (status === 'pending') {
                ordersByStatus.pending[doc.id] = order;
            } else if (status === 'completed') {
                ordersByStatus.completed[doc.id] = order;
            } else if (status === 'cancelled') {
                ordersByStatus.awaiting[doc.id] = order;
            } else if (status === 'confirmed') {
                ordersByStatus.confirmed[doc.id] = order;
            }
        });

        return ordersByStatus;
    } catch (error) {
        console.error('Error getting orders by status: ', error);
        throw error;
    }
}
export async function getOrdersByStatusAndUser(userId, status) {
    try {
        const ordersByStatus = {
            pending: {},
            completed: {},
            awaiting: {},
            confirmed: {}
        };

        // Create a query using collectionGroup to query all collections
        const q = query(collectionGroup(db, 'orders'));

        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const order = doc.data();
            const orderStatus = order.status;
            const providerId = order.providerDetails.id;
            const id = doc.id;
            order.id = id;

            // Convert createdAt and bookingDate from Timestamp to JavaScript Date object
            if (order.createdAt) {
                order.createdAt = order.createdAt.toDate();
            }
            // if (order.bookingDate) {
            //     order.bookingDate = order.bookingDate.toDate();
            // }

            // Check if the order belongs to the specified user and matches the specified status
            if (providerId === userId && orderStatus === status) {
                // Categorize the order based on its status
                if (status === 'pending') {
                    ordersByStatus.pending[id] = order;
                } else if (status === 'completed') {
                    ordersByStatus.completed[id] = order;
                } else if (status === 'cancelled') {
                    ordersByStatus.awaiting[id] = order;
                } else if (status === 'confirmed') {
                    ordersByStatus.confirmed[id] = order;
                }
            }
        });

        return ordersByStatus;
    } catch (error) {
        console.error('Error getting orders by status and user: ', error);
        throw error;
    }
}

export async function editProfile(user, userId, newData) {
    try {
        const userRef = doc(db, user, userId);

        await updateDoc(userRef, newData);

        console.log('Profile updated successfully');
    } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
    }
}

export const getUserDataById = async (userId) => {
    try {
        // Query the Providers collection
        const providerQuerySnapshot = await getDocs(query(collection(db, 'Providers'), where('id', '==', userId)));
        if (!providerQuerySnapshot.empty) {
            const providerData = providerQuerySnapshot.docs[0].data();
            return providerData;
        }

        // Query the Customers collection
        const customerQuerySnapshot = await getDocs(query(collection(db, 'Customers'), where('id', '==', userId)));
        if (!customerQuerySnapshot.empty) {
            const customerData = customerQuerySnapshot.docs[0].data();
            return customerData;
        }

        // If user data not found in either collection
        return null;
    } catch (error) {
        console.error('Error getting user data:', error);
        throw error;
    }
};



export async function updateOrderStatus(orderId, status) {
    try {
        // Get a reference to the order document
        const orderRef = doc(db, 'orders', orderId);

        // Update the status field of the order document
        await setDoc(orderRef, { status }, { merge: true });
    } catch (error) {
        console.error('Error updating order status:', error);
        throw error;
    }
}

export async function acceptOrder(orderId) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            status: 'confirmed'
        });
        console.log('Order accepted successfully');
    } catch (error) {
        console.error('Error accepting order:', error);
        throw error;
    }
}

export async function rejectOrder(orderId) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            status: 'cancelled'
        });
        console.log('Order rejected successfully');
    } catch (error) {
        console.error('Error rejecting order:', error);
        throw error;
    }
}

export async function updateService(providerId, newService) {
    try {
        const providerRef = doc(db, 'Providers', providerId);

        await updateDoc(providerRef, {
            service: newService
        });

        console.log('Service updated successfully');
    } catch (error) {
        console.error('Error updating service:', error);
        throw error;
    }
}

export async function getOrderById(orderId) {
    try {
        // Get a reference to the order document
        const orderRef = doc(db, 'orders', orderId);

        // Get the snapshot of the order document
        const orderSnapshot = await getDoc(orderRef);

        // Check if the order document exists
        if (orderSnapshot.exists()) {
            // Extract the order data from the snapshot
            const orderData = orderSnapshot.data();
            // Convert createdAt and bookingDate from Timestamp to JavaScript Date object
            if (orderData.createdAt) {
                orderData.createdAt = orderData.createdAt.toDate();
            }
            // if (orderData.bookingDate) {
            //     orderData.bookingDate = orderData.bookingDate.toDate();
            // }
            // Return the order data
            return orderData;
        } else {
            // If the order document does not exist, return null
            console.log('Order not found.');
            return null;
        }
    } catch (error) {
        console.error('Error getting order by ID:', error);
        throw error;
    }
}


// Providers - Login

export async function loginWithService(email, password, service) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userRef = doc(db, "Providers", service, user.uid); // Reference to the specific service collection
        const userInfoRef = await getDoc(userRef);
        const userInfo = userInfoRef.data();
        const userData = { ...userInfo, id: user.uid }
        return userData;
    } catch (error) {
        console.error(`Sign in error for ${service}:`, error);
        throw error;
    }
}

// Providers - Signup

export async function signupWithService(email, password, object, service) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        console.log('User signed up:', user.uid);
        const imageUrl = await uploadImageToStorage(object.imageUri, user.uid);
        object.imageUri = imageUrl;
        object.service = service;
        object.id = user.uid;
        await setDoc(doc(db, "Providers", user.uid), object);
        const userRef = doc(db, "Providers", user.uid); // Reference to the specific service collection
        const userInfoRef = await getDoc(userRef);
        const userInfo = userInfoRef.data()
        const userData = userInfo
        return userData;
    } catch (error) {
        console.error(`Sign up error for ${service}:`, error);
        throw error;
    }
}

export async function updateProviderLocation(providerId, latitude, longitude, address) {
    try {
        // Get a reference to the provider document
        const providerRef = doc(db, 'Providers', providerId);

        // Update the location field of the provider document with coordinates
        await updateDoc(providerRef, {
            location: {
                latitude: latitude,
                longitude: longitude,
                address: address
            }
        });

        console.log('Location updated successfully');
    } catch (error) {
        console.error('Error updating location:', error);
        throw error;
    }
}


// Notifications

// Function to generate and store push notification token
export async function registerForPushNotificationsAsync(userId) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }  
    // If permission is granted, get the token
    if (finalStatus === 'granted') {
        const tokenData = await Notifications.getExpoPushTokenAsync();
        const token = tokenData.data;
        // Store the token in the user's document in Firebase
        const providerRef = doc(db, 'Providers', userId);
        await updateDoc(providerRef, {
            pushToken: token
        })
    } else {
        console.log('Permission to send push notifications denied');
    }
}

// Function to send a new message
export const sendMessage = async (senderId, senderName, receiverId, receiverName, text) => {
    try {
        const receiverRef = doc(db, 'Providers', receiverId)
        const receiverSnapshot =await getDoc(receiverRef)
        const receiverData = receiverSnapshot.data();
        const receiverToken = receiverData.pushToken;
        console.log(receiverToken)


        // Send a push notification to the receiver
        await sendPushNotification(receiverToken, 'Notification', `${senderName}: ${text}`);
    } catch (error) {
        console.error('Error sending message: ', error);
    }
};

async function sendPushNotification(token, title, body) {
    await fetch('https://exp.host/--/api/v2/push/send', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            to: token,
            sound: 'default',
            title: title,
            body: body,
            data: { data: 'goes here' },
        }),
    });
}

// Function to get provider by ID
export async function getProviderById(providerId) {
    try {
        // Get a reference to the provider document
        const providerRef = doc(db, 'Providers', providerId);
        // Get the snapshot of the provider document
        const providerSnapshot = await getDoc(providerRef);

        // Check if the provider document exists
        if (providerSnapshot.exists()) {
            const providerData = providerSnapshot.data();
            return providerData;
        } else {
            // If the provider document does not exist, return null
            console.log('Provider not found.');
            return null;
        }
    } catch (error) {
        console.error('Error getting provider by ID:', error);
        throw error;
    }
}


export async function updateProviderAboutAndGallery(userId, about, gallery) {
    try {
        // Upload images in the gallery to storage and get their download URLs
        const uploadedGallery = await Promise.all(gallery.map(async (image) => {
            const imageUrl = await uploadImageToStorage(image, userId);
            return imageUrl;
        }));

        // Get a reference to the provider document
        const providerRef = doc(db, 'Providers', userId);

        // Update the about and gallery fields of the provider document
        await updateDoc(providerRef, {
            about: {
                info: about,
                gallery: uploadedGallery
            }
        });

        console.log('About and gallery updated successfully');
    } catch (error) {
        console.error('Error updating about and gallery:', error);
        throw error;
    }
}

export async function deleteUserAccount(email, password) {
    try {
        // Sign in the user
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Delete the user account
        await user.delete();

        console.log('User account deleted successfully');
    } catch (error) {
        console.error('Error deleting user account:', error);
        throw error;
    }
}
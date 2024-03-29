// chat.js

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import {getConversationsByUser} from '../../../../utils/firebase'; // Importing the hook to fetch conversations
import { router } from 'expo-router';
import { getUserData } from '../../../../utils/useSecureStorage';

const Chats = () => {
  const [conversations, setConversations] = useState([]);
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserData(userData);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        if(userData) {
            const userConversations = await getConversationsByUser(userData.id);
            setConversations(userConversations);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      }
    };

    fetchConversations();
  }, [userData]);

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity onPress={() => {console.log(item); router.push({pathname: '/provider/app/Chats/ChatScreen', params: {conversation: JSON.stringify(item)}})}}>
      <View style={{ padding: 20, borderBottomWidth: 1, borderBottomColor: '#ccc' }}>
        <Text style={{fontSize: 16}}>{item.senderName}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1 }}>
      {conversations.length > 0 ?       <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={(item) => item.id}
      /> : <View style={{flex: 1,justifyContent: 'center', alignItems: 'center'}}>
        <Text style={{textAlign: 'center'}}>No one reached you yet...</Text></View>}
    </View>
  );
};

export default Chats;

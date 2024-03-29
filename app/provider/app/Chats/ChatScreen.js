import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useChatMessages } from '../../../../utils/firebase';
import { useLocalSearchParams } from 'expo-router';
import { getUserData } from '../../../../utils/useSecureStorage';

const ChatScreen = () => {
  const [userData, setUserData] = useState({});
  useEffect(() => {
    const fetchUserData = async () => {
      const userData = await getUserData();
      setUserData(userData);
    };
    fetchUserData();
  }, []);
    const params = useLocalSearchParams();
    const personInfo = JSON.parse(params.conversation);
    console.log(personInfo)
    const { messages, sendMessage } = useChatMessages(userData.id, personInfo.senderId);


    const onSend = (newMessages = []) => {
        const { text, user } = newMessages[0]; // Assuming only one message is sent at a time
        sendMessage(userData.id, userData.name, personInfo.senderId, personInfo.senderName, text);
    };

  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
            <GiftedChat
      messages={messages}
      onSend={newMessages => onSend(newMessages)}
      user={{
        _id: userData.id,
      }}
    />
    </View>
  );
};

export default ChatScreen;

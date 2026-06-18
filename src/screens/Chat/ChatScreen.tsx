import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from 'react-native';
import {RouteProp, useRoute} from '@react-navigation/native';
import {RootStackParamList} from '../../types';
import COLORS from '../../utils/Colors';

type ChatScreenRouteProp = RouteProp<RootStackParamList, 'ChatScreen'>;

type Message = {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
};

const ChatScreen: React.FC = () => {
  const {user} = useRoute<ChatScreenRouteProp>().params;
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const ws = useRef<WebSocket | null>(null);

  const webSocketUrl = 'wss://echo.websocket.events';

  useEffect(() => {
    ws.current = new WebSocket(webSocketUrl);

    ws.current.onopen = () => console.log('WebSocket connected');
    ws.current.onmessage = e => {
      setMessages(prev => [
        {
          id: String(Date.now()),
          text: e.data,
          sender: 'them',
          time: new Date().toLocaleTimeString(),
        },
        ...prev,
      ]);
    };
    ws.current.onerror = e => console.error('WebSocket error', e);
    ws.current.onclose = () => console.log('WebSocket closed');

    return () => ws.current?.close();
  }, []);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg: Message = {
      id: String(Date.now()),
      text: input,
      sender: 'me',
      time: new Date().toLocaleTimeString(),
    };
    ws.current?.send(input);
    setMessages(prev => [msg, ...prev]);
    setInput('');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}>
        {/* Header */}

        <View style={styles.header}>
          <Image
            source={
              typeof user.avatar === 'string' ? {uri: user.avatar} : user.avatar
            }
            style={styles.avatar}
          />
          <Text style={styles.headerTitle}>{user.name}</Text>
        </View>

        {/* Messages */}
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          inverted
          contentContainerStyle={{padding: 12}}
          renderItem={({item}) => (
            <View
              style={[
                styles.bubble,
                item.sender === 'me' ? styles.myBubble : styles.theirBubble,
              ]}>
              <Text style={styles.bubbleText}>{item.text}</Text>
              <Text style={styles.bubbleTime}>{item.time}</Text>
            </View>
          )}
        />

        {/* Input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type message..."
            value={input}
            onChangeText={setInput}
          />
          <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
            <Text style={styles.sendText}>➤</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f2f5f8'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderColor: '#ececec',
  },
  avatar: {width: 36, height: 36, borderRadius: 18, marginRight: 10},
  headerTitle: {fontSize: 18, fontWeight: '600'},

  bubble: {
    maxWidth: '75%',
    borderRadius: 12,
    padding: 10,
    marginVertical: 4,
  },
  myBubble: {
    backgroundColor: '#007AFF',
    alignSelf: 'flex-end',
  },
  theirBubble: {
    backgroundColor: '#E5E5EA',
    alignSelf: 'flex-start',
  },
  bubbleText: {color: COLORS.black},
  bubbleTime: {fontSize: 10, color: COLORS.disableText, marginTop: 4, textAlign: 'right'},

  inputRow: {
    flexDirection: 'row',
    padding: 8,
    backgroundColor: COLORS.white,
    borderTopWidth: 1,
    borderColor: '#ececec',
  },
  input: {
    flex: 1,
    backgroundColor: '#f1f1f1',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  sendBtn: {
    width: 40,
    height: 40,
    marginLeft: 8,
    backgroundColor: '#007AFF',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendText: {color: COLORS.white, fontSize: 18},
});

export default ChatScreen;

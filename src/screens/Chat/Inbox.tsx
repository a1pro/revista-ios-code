import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  TextInput,
  Image,
  SafeAreaView,
} from 'react-native';
import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {RootStackParamList, UserChat} from '../../types';
import IMAGES from '../../assets/images';
import VectorIcon from '../../components/VectorIcon';
import COLORS from '../../utils/Colors';
import { t } from 'i18next';

type InboxNavProp = NativeStackNavigationProp<RootStackParamList, 'Inbox'>;

const mockChats: UserChat[] = [
  {
    id: '1',
    name: 'Hamad',
    avatar: IMAGES.imgplaceholder, // local require
    lastMessage: 'fdff',
    lastTime: '32 minutes ago',
    type: 'vendor',
  },
  {
    id: '2',
    name: 'Main',
    avatar: IMAGES.imgplaceholder,
    lastMessage: 'yuiehf gf',
    lastTime: '42 minutes ago',
    type: 'vendor',
  },
  {
    id: '3',
    name: 'Dgoud',
    avatar: IMAGES.imgplaceholder,
    lastMessage: 'where is product',
    lastTime: '1 day ago',
    type: 'vendor',
  },
  {
    id: '4',
    name: 'Ali',
    avatar: IMAGES.imgplaceholder,
    lastMessage: 'I am here',
    lastTime: '2 hours ago',
    type: 'deliveryman',
  },
];

const Inbox: React.FC = () => {
  const navigation = useNavigation<InboxNavProp>();
  const [tab, setTab] = useState<'vendor' | 'deliveryman'>('vendor');
  const [search, setSearch] = useState('');

  const filteredChats = mockChats.filter(
    chat =>
      chat.type === tab &&
      (chat.name.toLowerCase().includes(search.toLowerCase()) ||
        chat.lastMessage?.toLowerCase().includes(search.toLowerCase())),
  );

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}>
            <VectorIcon
              type="Ionicons"
              name="arrow-back"
              size={24}
              color={COLORS.black}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('Inbox')}</Text>
          <View style={{width: 32}} />
        </View>

        {/* Tabs */}
        <View style={styles.tabRow}>
          {(['vendor', 'deliveryman'] as const).map(t => (
            <TouchableOpacity
              key={t}
              style={[styles.tabButton, tab === t && styles.tabActive]}
              onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search"
            value={search}
            onChangeText={setSearch}
          />
        </View>

        <FlatList
          data={filteredChats}
          keyExtractor={item => item.id}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('ChatScreen', {user: item})}>
              <Image source={IMAGES.imgplaceholder} style={styles.avatar} />
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMsg}>{item.lastMessage}</Text>
              </View>
              <Text style={styles.chatTime}>{item.lastTime}</Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#f8faff'},
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
  },
  backBtn: {padding: 6},
  headerTitle: {flex: 1, textAlign: 'center', fontSize: 18, fontWeight: 'bold'},
  tabRow: {flexDirection: 'row', justifyContent: 'center', marginVertical: 8},
  tabButton: {paddingHorizontal: 16, paddingVertical: 8},
  tabActive: {borderBottomWidth: 2, borderColor: COLORS.appColor},
  tabText: {fontSize: 16, color: '#555'},
  tabTextActive: {color: COLORS.appColor},
  searchRow: {paddingHorizontal: 16, marginBottom: 8},
  searchInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: COLORS.white,
    marginVertical: 4,
    marginHorizontal: 16,
    borderRadius: 8,
  },
  avatar: {width: 48, height: 48, borderRadius: 24},
  chatName: {fontSize: 16, fontWeight: '500'},
  chatMsg: {color: COLORS.disableText, marginTop: 4},
  chatTime: {fontSize: 12, color: '#999'},
});

export default Inbox;

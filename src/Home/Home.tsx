import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { Background, Icon } from '../Components/StyledComponent';
import FABBtn from './Component/FABBtn';
import PostList from './Component/PostList';
import { PostListItem } from './Interface/Interface';
import dayjs from 'dayjs';
import theme from '../Components/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../lib/supabase';
import { useAuth } from '../Login/hooks/useAuth';

const Home = () => {
  const navigation = useNavigation();

  const [list, setList] = useState<PostListItem[]>([]);

  // 검색 - Realtime Database에서는 구현이 어려움
  const [search, setSearch] = useState('');

  const onSearch = () => {
    search.trim() && console.log('Searching for:', search);
  };

  // Paper FAB Handler
  const [isExpanded, setIsExpanded] = useState(false);

  const { user } = useAuth();
  const isLogin = !!user;


  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        {/* 검색 */}
        <SearchView>
          <SearchInput
            placeholder="Search..."
            placeholderTextColor={theme.colors.fontLightGray}
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity onPress={onSearch}>
            <Icon source={require('../Image/ic_find_black.png')} />
          </TouchableOpacity>
        </SearchView>

        {/* 게시글 리스트 */}
        <ListView bounces={false}>
          {list?.map((item, index) => (
            <PostList key={index} {...item} />
          ))}
          <PaddingView />
        </ListView>

        {/* {FAB} */}
        <FABBtn isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </SafeAreaView>
    </Background>
  );
};

export default Home;

const SearchView = styled.View`
  height: 40px;
  width: 100%;
  border-width: 1px;
  border-color: gray;
  border-radius: 8px;
  padding-horizontal: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const SearchInput = styled.TextInput`
  height: 100%;
  width: 85%;
  font-size: 16px;
  color: ${theme.colors.fontMain};
`;

const ListView = styled.ScrollView`
  flex: 1;
  width: 100%;
`;

const PaddingView = styled.View`
  height: 50px;
`;

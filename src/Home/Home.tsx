import { useIsFocused, useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { Dimensions, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import { Background, Background2, Icon, RowView } from '../Components/StyledComponent';
import FABBtn from './Component/FABBtn';
import PostList from './Component/PostList';
import { PostListItem } from './Interface/Interface';
import dayjs from 'dayjs';
import theme from '../Components/theme';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../Login/lib/supabase';
import { useAuth } from '../Login/hooks/useAuth';
import LottieView from 'lottie-react-native';

const Home = () => {
  const navigation = useNavigation();
  const isFocused = useIsFocused();

  const [list, setList] = useState<PostListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 검색 - Realtime Database에서는 구현이 어려움
  const [search, setSearch] = useState('');

  const onSearch = () => {
    getPosts();
  };

  const onReset = () => {
    setSearch('');
  }

  // Paper FAB Handler
  const [isExpanded, setIsExpanded] = useState(false);

  const { user } = useAuth();

  useEffect(() => {
    setIsLoading(true);
    const delay = setTimeout(() => {
      getPosts();
    }, 500);

    return () => clearTimeout(delay);
  }, [isFocused, search]);



  const getPosts = async () => {
    let query = supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });

    // 🔥 검색어 있을 때 (title + tags 검색)
    if (search.trim()) {
      query = query.or(
        `title.ilike.%${search}%,tags.cs.{${search}}`
      );
    }

    const { data, error } = await query;

    setIsLoading(false)

    if (error) {
      console.log(error);
      return;
    }

    const mapped = data.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      thumbnail: item.image_urls?.[0] || '',
      created_at: dayjs(item.created_at).format('YYYY.MM.DD'),
      viewCount: item.view_count || 0,
      tag: item.tags || [],
    }));

    setList(mapped);
  };




  return (
    <Background2>
      <SafeAreaView style={{ flex: 1 }}>
        {/* 검색 */}
        <RowView style={{ gap: 8 }}>

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
          <ResetBtn onPress={onReset}>
            <Icon source={require('../Image/ic_reset_black.png')} />
          </ResetBtn>
        </RowView>

        {/* 게시글 리스트 */}
        {
          isLoading ?
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>

              <LottieView
                source={require('../Image/loading_gray.json')}
                autoPlay
                loop
                style={{ width: 100, height: 100, alignSelf: 'center', marginTop: 50 }}
              />

            </View>
            :
            <ListView bounces={false}>
              {list?.map((item) => (
                <PostList key={item.id} {...item} />
              ))}

              <PaddingView />
            </ListView>

        }

        {/* {FAB} */}
        <FABBtn isExpanded={isExpanded} setIsExpanded={setIsExpanded} />
      </SafeAreaView>
    </Background2>
  );
};

export default Home;

const SearchView = styled.View`
  height: 40px;
  width: ${Dimensions.get('window').width - 72}px;
  border-width: 1px;
  border-color: gray;
  border-radius: 8px;
  padding-horizontal: 10px;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  background-color: white;
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

const ResetBtn = styled.TouchableOpacity`
  border-radius: 8px;
  background-color:white;
  align-items:center;
  justify-content:center;
  padding:4px;
  width:40px;
  height:40px;
`
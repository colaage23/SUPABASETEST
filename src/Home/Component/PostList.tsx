/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { useNavigation } from '@react-navigation/native';
import { FlatList, TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import { ContentText, Icon, RowView } from '../../Components/StyledComponent';
import theme from '../../Components/theme';
import { PostListItem } from '../Interface/Interface';

const PostList = (item: PostListItem) => {
    const navigation = useNavigation<any>();
    const goPostDetail = () => {
        navigation.navigate('HomeStacks', { screen: 'PostDetail', params: { item } });
    }

    return (
        <ListItemView>
            <TouchableOpacity onPress={goPostDetail}>
                <RowView>
                    <Thumnail
                        source={{
                            uri: item.thumbnail || 'https://via.placeholder.com/100',
                        }}
                        resizeMode="cover"
                    />

                    <ContentView>
                        <ContentText numberOfLines={1}>{item.title}</ContentText>
                        <ContentText small numberOfLines={2}>
                            {item.content}
                        </ContentText>
                        <RowView between>
                            <ContentText xxsmall right>
                                {item.created_at}
                            </ContentText>
                            <RowView style={{ gap: 5 }}>
                                <Icon
                                    size={15}
                                    source={require('../../Image/ic_view_count_black.png')}
                                />
                                <ContentText xxsmall>{item.viewCount}</ContentText>
                            </RowView>
                        </RowView>
                    </ContentView>
                </RowView>
            </TouchableOpacity>

            <RowView style={{ gap: 5, marginTop: 8 }}>
                <FlatList
                    data={item.tag}
                    renderItem={({ item: tag }) => (
                        <Tag key={tag}>
                            <ContentText small blue>
                                {tag}
                            </ContentText>
                        </Tag>
                    )}
                    keyExtractor={(tag, index) => index.toString()}
                    horizontal
                    bounces={false}
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 5 }}
                />
            </RowView>
        </ListItemView>
    );
};

const ListItemView = styled.View`
    width: 100%;
    flex: 1;
    background-color: white;
    padding:10px 8px;
    margin-top:8px;
    border-radius:8px;
  `;

const Thumnail = styled.Image`
    flex: 1;
    height: 90px;
    border-radius: 4px;
`;

const ContentView = styled.View`
    flex: 3;
    height: 100%;
    padding: 4px 8px;
    gap: 5px;
    justify-content: space-between;
    max-height: 100px;
`;

const Tag = styled.View`
    padding: 4px 10px;
    border-radius: 15px;
    background-color: ${theme.colors.bgBlue};
`;

export default PostList;

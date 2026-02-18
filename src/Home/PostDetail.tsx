import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, Keyboard } from "react-native";
import styled from "styled-components/native";
import { Background, ContentText, Icon, RowView } from "../Components/StyledComponent";
import theme from "../Components/theme";
import { PostListItem } from "./Interface/Interface";
import dayjs from "dayjs";
import { SafeAreaView } from 'react-native-safe-area-context';

interface Comment {
    id: string;
    email: string;
    content: string;
    createdAt: number;
}

const PostDetail: React.FC = () => {
    const route = useRoute<RouteProp<{ params: { item: PostListItem; id: string } }, 'params'>>();
    const { item, id } = route.params; // id = 게시글 key
    const navigation = useNavigation();

    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState<Comment[]>([]);



    // 댓글 저장
    const addComment = async () => {

    };

    const goBack = () => {
        navigation.goBack();
    };

    return (
        <Background>
            <TopBar>
                <BackBtn onPress={goBack}>
                    <Icon source={require("../Image/ic_back_black.png")} />
                </BackBtn>
                <ContentText title medium>{item.title}</ContentText>
            </TopBar>
            <SafeAreaView style={{ flex: 1, gap: 10 }}>
                <Thumnail source={{ uri: item.thumbnail }} resizeMode="cover" />

                {item.tag.length > 0 && (
                    <RowView style={{ gap: 5 }}>
                        <FlatList
                            data={item.tag}
                            renderItem={({ item: tag }) => (
                                <Tag key={tag}>
                                    <ContentText small blue>{tag}</ContentText>
                                </Tag>
                            )}
                            keyExtractor={(tag, index) => index.toString()}
                            horizontal
                            bounces={false}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ gap: 5 }}
                        />
                    </RowView>
                )}

                <ContentView>
                    <ContentText>{item.content}</ContentText>
                </ContentView>

                <Bar />


                {commentList.map((item) => (
                    <CommentListView>
                        <RowView between>
                            <ContentText small bold>{item.email}</ContentText>
                            <ContentText small bold>{dayjs(item.createdAt).format("YY-MM-DD HH:mm")}</ContentText>
                        </RowView>
                        <ContentText>{item.content}</ContentText>
                    </CommentListView>
                ))}


                {/* 댓글 입력창 */}
                <CommentInputView>
                    <CommentInput
                        placeholder="댓글을 입력하세요"
                        placeholderTextColor={theme.colors.fontLightGray}
                        value={comment}
                        onChangeText={setComment}
                    />
                    <TouchableOpacity onPress={addComment}>
                        <Icon source={require("../Image/ic_send_black.png")} />
                    </TouchableOpacity>
                </CommentInputView>
            </SafeAreaView>
        </Background>
    );
};

export default PostDetail;

const TopBar = styled.View`
  height: 30px;
  width: 100%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const BackBtn = styled.TouchableOpacity`
  position: absolute;
  left: 0px;
`;


const Thumnail = styled.Image`
    width: 100%;
    height: 100%;
    max-height: 300px;

`
const Tag = styled.View`
  padding: 4px 10px;
  border-radius: 15px;
  background-color: ${theme.colors.bgBlue};
`;

const ContentView = styled.View`
  padding: 10px 0px;
`;

const Bar = styled.View`
  height: 5px;
  width: 120%;
  right: 20px;
  background-color: ${theme.colors.lineGray};
`;

const CommentInputView = styled.View`
  position: absolute;
  bottom: 0px;
  border-radius: 8px;
  width: 100%;
  height: 40px;
  border-width: 1px;
  border-color: gray;
  flex-direction: row;
  align-items: center;
  padding: 0px 10px;
  justify-content: space-between;
  background-color: #fff;
`;

const CommentInput = styled.TextInput`
  width: 85%;
  color: ${theme.colors.fontMain};
`;

const CommentListView = styled.View`
  width: 100%;
  padding: 10px 0px;
  border-bottom-width: 1px;
  border-color: ${theme.colors.lineGray};
  gap: 5px;
`;

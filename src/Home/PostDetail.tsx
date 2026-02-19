import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { Alert, FlatList, Keyboard, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import styled from "styled-components/native";
import { Background, ContentText, Icon, RowView } from "../Components/StyledComponent";
import theme from "../Components/theme";
import { useAuth } from "../Login/hooks/useAuth";
import { supabase } from "../Login/lib/supabase"; // 🔥 추가
import { PostListItem } from "./Interface/Interface";

interface Comment {
    id: string;
    email: string;
    content: string;
    created_at: string;
}

const PostDetail: React.FC = () => {

    const { user } = useAuth();

    const route = useRoute<RouteProp<{ params: { item: PostListItem; } }, 'params'>>();
    const { item } = route.params;
    const navigation = useNavigation();

    const [comment, setComment] = useState("");
    const [commentList, setCommentList] = useState<Comment[]>([]);

    // 댓글 불러오기
    const getComments = async () => {
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .eq("post_id", item.id)
            .order("created_at", { ascending: false });

        if (error) {
            console.log(error);
            return;
        }

        setCommentList(data || []);
    };

    // 🔥 댓글 저장
    const addComment = async () => {
        if (!user) {
            Alert.alert("로그인이 필요한 기능입니다.");
            return;
        }

        if (!comment.trim()) return;

        const { error } = await supabase.from("comments").insert({
            post_id: item.id,
            email: user?.email,
            content: comment,
        });

        if (error) {
            Alert.alert("댓글 등록 실패");
            return;
        }

        setComment("");
        Keyboard.dismiss();
        getComments(); // 🔥 다시 불러오기
    };

    useEffect(() => {
        getComments();
    }, []);

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

            <SafeAreaView style={{ flex: 1 }}>

                <Thumnail
                    source={{ uri: item.thumbnail }}
                    resizeMode="cover"
                    onError={() => console.log("이미지 로드 실패")}
                />

                {/* 태그 */}
                <View>

                    {item.tag.length > 0 && (
                        <FlatList
                            data={item.tag}
                            renderItem={({ item: tag }) => (
                                <Tag>
                                    <ContentText small blue>{tag}</ContentText>
                                </Tag>
                            )}
                            keyExtractor={(tag, index) => `${tag}-${index}`}
                            horizontal
                            contentContainerStyle={{ gap: 5, padding: 10, paddingLeft: 0 }}
                            showsHorizontalScrollIndicator={false}
                        />
                    )}
                </View>

                <ContentView>
                    <ContentText>{item.content}</ContentText>
                    <ContentText small>
                        {item.created_at}
                    </ContentText>
                </ContentView>

                <Bar />

                {/*  댓글 리스트 */}
                <FlatList
                    data={commentList}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <CommentListView>
                            <RowView between>
                                <ContentText small bold>{item.email}</ContentText>
                                <ContentText small>
                                    {dayjs(item.created_at).format("YY-MM-DD HH:mm")}
                                </ContentText>
                            </RowView>
                            <ContentText>{item.content}</ContentText>
                        </CommentListView>
                    )}
                    contentContainerStyle={{ paddingBottom: 80 }}
                />

                {/* 댓글 입력 */}
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
    border-radius: 8px;
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

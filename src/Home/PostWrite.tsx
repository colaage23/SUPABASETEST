/* eslint-disable react-native/no-inline-styles */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Background, ContentText, Icon } from '../Components/StyledComponent';
import {
  Alert,
  Keyboard,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import styled from 'styled-components/native';
import theme from '../Components/theme';
import ImageCropPicker from 'react-native-image-crop-picker';
import ImageResizer from 'react-native-image-resizer';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '../Login/lib/supabase';
import RNFS from 'react-native-fs';
import { Buffer } from 'buffer';


const PostWrite = () => {
  const navigation = useNavigation();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);


  const imgAttachBtn = () => {
    if (images.length <= 4) {
      ImageCropPicker.openPicker({
        cropping: false,
        maxFiles: 5 - images.length,
      })
        .then(image => {
          ImageResizer.createResizedImage(
            image.path,
            (image.width || image.height) > 3000
              ? image.width / 5
              : (image.width || image.height) > 2000
                ? image.width / 2
                : image.width,
            (image.height || image.width) > 3000
              ? image.height / 5
              : (image.height || image.width) > 2000
                ? image.height / 2
                : image.height,
            'JPEG',
            100,
          )
            .then(resizes => {
              setImages(prevImages => [...prevImages, resizes.uri]);
            })
            .catch(err => console.log(err));
        })
        .catch(error => console.log('ImagePicker Error:', error));
    }
  };

  const uploadImageToStorage = async (uri: string) => {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) throw new Error('로그인 필요');

    const fileExt = uri.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;

    const base64 = await RNFS.readFile(uri, 'base64');

    const { data, error } = await supabase.storage
      .from('post-images')
      .upload(filePath, Buffer.from(base64, 'base64'), {
        contentType: 'image/jpeg',
      });

    if (error) throw error;

    const { data: publicUrl } = supabase.storage
      .from('post-images')
      .getPublicUrl(data.path);

    return publicUrl.publicUrl;
  };



  const savePost = async () => {
    setIsLoading(true);

    if (!title || !content) {
      Alert.alert('제목과 내용을 입력해주세요.');
      setIsLoading(false);
      return;
    }

    if (images.length === 0) {
      Alert.alert('최소 한 장의 이미지를 업로드해주세요.');
      setIsLoading(false);
      return;
    }

    try {
      // 1. 이미지 업로드
      const imageUrls = await Promise.all(
        images.map(uri => uploadImageToStorage(uri)),
      );

      // 2. 태그 파싱 (#a #b -> ["a","b"])
      const parsedTags = tags
        .split(' ')
        .map(tag => tag.replace('#', '').trim())
        .filter(Boolean);

      // 3. 게시글 저장
      const { error } = await supabase.from('posts').insert([
        {
          title,
          content,
          tags: parsedTags,
          image_urls: imageUrls,
        },
      ]);

      if (error) throw error;

      // 4. 초기화
      setTitle('');
      setContent('');
      setTags('');
      setImages([]);

      navigation.goBack();
    } catch (err) {
      console.log('Save post error:', err);
      Alert.alert('저장 실패');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <Background>
      <SafeAreaView style={{ flex: 1 }}>
        <Pressable onPress={() => Keyboard.dismiss()}>
          <InsertView>
            <View>
              <ContentText bold>제목</ContentText>
              <TextInput
                placeholder="제목을 입력하세요"
                placeholderTextColor={theme.colors.fontLightGray}
                maxLength={50}
                value={title}
                onChangeText={setTitle}
              />
            </View>
            <View>
              <ContentText bold>내용</ContentText>
              <TextInput
                placeholder="내용을 입력하세요"
                placeholderTextColor={theme.colors.fontLightGray}
                maxLength={500}
                multiline
                numberOfLines={10}
                style={{ textAlignVertical: 'top', height: 200 }}
                value={content}
                onChangeText={setContent}
              />
              <TextInput
                placeholder="Tag"
                placeholderTextColor={theme.colors.fontLightGray}
                maxLength={50}
                value={tags}
                onChangeText={setTags}
              />
            </View>
            <ContentText bold>사진</ContentText>
          </InsertView>
        </Pressable>

        <ScrollView
          style={{ marginTop: 5 }}
          horizontal
          bounces={false}
          showsHorizontalScrollIndicator={false}>
          {images.length < 1 && (
            <ImageBtn onPress={imgAttachBtn}>
              <Icon source={require('../Image/ic_plus_circle_gray.png')} />
            </ImageBtn>
          )}

          <View style={{ height: 120, flexDirection: 'row', alignItems: 'center' }}>
            {images.map((item, index) => {
              return (
                <PostImage source={{ uri: item }} key={index}>
                  <DelBtn
                    onPress={() =>
                      setImages(prev => prev.filter(img => img !== item))
                    }>
                    <Icon source={require('../Image/ic_x_circle_white.png')} />
                  </DelBtn>
                </PostImage>
              );
            })}
          </View>
        </ScrollView>

        <SubmitBtn onPress={savePost} disabled={isLoading}>
          <Text style={{ color: 'white', fontWeight: 'bold' }}>{isLoading ? "작성중..." : "게시물 저장"}</Text>
        </SubmitBtn>
      </SafeAreaView>
    </Background>
  );
};

export default PostWrite;

const InsertView = styled.View`
  align-self: center;
  width: 100%;
  gap: 10px;
`;

const TextInput = styled.TextInput`
  color: ${theme.colors.fontMain};
  width: 100%;
  height: 40px;
  background-color: #fff;
  margin-bottom: 12px;
  border-width: 1px;
  border-radius: 8px;
  border-color: ${theme.colors.barGray};
  margin-top: 5px;
  padding: 10px;
`;

const ImageBtn = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  background-color: white;
  border-radius: 8px;
  align-items: center;
  justify-content: center;
  border: 1px solid ${theme.colors.barGray};
  margin-right: 10px;
`;

const DelBtn = styled.TouchableOpacity`
  position: absolute;
  right: -7px;
  top: -7px;
`;

const PostImage = styled.ImageBackground`
  width: 100px;
  height: 100px;
  margin-right: 10px;
`;

const SubmitBtn = styled.TouchableOpacity`
  background-color: ${theme.colors.main};
  padding: 12px;
  margin: 20px;
  border-radius: 8px;
  align-items: center;
`;

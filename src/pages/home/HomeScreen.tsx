import React from 'react';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '@/components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useDispatch, useSelector } from 'react-redux';
import { authSelector, removeAuth } from '@/redux/reducers/authReducer';
const HomeScreen = ({navigation}: any) => {
  const dispatch = useDispatch();
  const handleLogout = async () => {
        await AsyncStorage.removeItem(
          'auth',
        );
        dispatch(removeAuth({}))
  };
  return (
    <ContainerComponent isImageBackground isScroll>
      <SectionComponent>
          <ButtonComponent
            onPress={handleLogout}
            text="Đăng xuất"
            type="primary"
          />
        </SectionComponent>
        <TextComponent text='Home page'></TextComponent>
    </ContainerComponent>
  );
};

export default HomeScreen;
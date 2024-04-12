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
const UserProfileScreen = ({navigation}: any) => {
  
  const auth = useSelector(authSelector);
  return (
    <ContainerComponent isImageBackground isScroll>
        <TextComponent text='User Profile'></TextComponent>
    </ContainerComponent>
  );
};

export default UserProfileScreen;
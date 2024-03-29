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
const HomeScreen = ({navigation}: any) => {
  const handleLogout = async () => {
        await AsyncStorage.removeItem(
          'auth',
        );
        navigation.navigate('LoginScreen')
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
        <TextComponent text='HOme screen' />
    </ContainerComponent>
  );
};

export default HomeScreen;
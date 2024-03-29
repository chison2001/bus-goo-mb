import React from 'react';
import {ActivityIndicator, Image, ImageBackground} from 'react-native';
import {appInfo} from '@/constants/appInfos';
import {SpaceComponent} from '@/components';
import {appColors} from '@/constants/appColors';

const SplashScreen = () => {
  return (
    <ImageBackground
      source={require('@/assets/images/bg-splash.jpg')}
      style={{
        flex: 1,
        width: appInfo.sizes.WIDTH,
        height: appInfo.sizes.HEIGHT,
        justifyContent: 'center',
        alignItems: 'center',
      }}
      imageStyle={{flex: 1}}>
      <Image
        source={require('@/assets/images/thumnail.png')}
        style={{
          resizeMode: 'contain',
        }}
      />
      <SpaceComponent height={16} />
      <ActivityIndicator color={appColors.gray} size={22} />
    </ImageBackground>
  );
};

export default SplashScreen;

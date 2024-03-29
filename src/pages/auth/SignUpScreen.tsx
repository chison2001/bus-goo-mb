import {Lock, Sms, User, Call} from 'iconsax-react-native';
import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from '../../components';
import {appColors} from '@/constants/appColors';
import {LoadingModal} from '@/modals';
import {Validate} from '../../utils/validate';
import authenticationAPI from '@/services/authApi';
import { Image} from 'react-native';
interface ErrorMessages {
  email: string;
  password: string;
  confirmPassword: string;
}

const initValue = {
  fullName: '',
  email: '',
  phone: '',
  password: '',
  confirmPassword: '',
};

const SignUpScreen = ({navigation}: any) => {
  const [values, setValues] = useState(initValue);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<any>();
  const [isDisable, setIsDisable] = useState(true);

  const dispatch = useDispatch();

  useEffect(() => {
    if (
      !errorMessage ||
      (errorMessage &&
        (errorMessage.email ||
          errorMessage.password ||
          errorMessage.confirmPassword)) ||
      !values.email ||
      !values.password ||
      !values.confirmPassword
    ) {
      setIsDisable(true);
    } else {
      setIsDisable(false);
    }
  }, [errorMessage, values]);

  const handleChangeValue = (key: string, value: string) => {
    const data: any = {...values};

    data[`${key}`] = value;

    setValues(data);
  };

  const formValidator = (key: string) => {
    const data = {...errorMessage};
    let message = ``;

    switch (key) {
      case 'email':
        if (!values.email) {
          message = `Email là bắt buộc!!!`;
        } else if (!Validate.email(values.email)) {
          message = 'Email không hợp lệ!!';
        } else {
          message = '';
        }

        break;

      case 'phone':
          if (!values.phone) {
            message = `Số điện thoại là bắt buộc!!!`;
          } else if (!Validate.phoneNumber(values.phone)) {
            message = 'Số điện thoại không hợp lệ!!';
          } else {
            message = '';
          }
  
          break;

      case 'password':
        message = !values.password ? `Mật khẩu là bắt buộc!!!` : '';
        break;

      case 'confirmPassword':
        if (!values.confirmPassword) {
          message = `Vui lòng nhập xác nhận mật khẩu!!`;
        } else if (values.confirmPassword !== values.password) {
          message = 'Xác nhận mật khẩu không trùng!!!';
        } else {
          message = '';
        }

        break;
    }

    data[`${key}`] = message;

    setErrorMessage(data);
  };

  const handleRegister = async () => {
    const api = `/verification`;
    setIsLoading(true);
    try {
      const res = await authenticationAPI.HandleAuthentication(
        api,
        {email: values.email},
        'post',
      );

      setIsLoading(false);

      navigation.navigate('Verification', {
        code: res.data.code,
        ...values,
      });
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <>
      <ContainerComponent isImageBackground isScroll>
      <SectionComponent
        styles={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 25,
        }}>
        <Image
          source={require('@/assets/images/thumnail.png')}
          style={{
            width: 162,
            height: 114,
            marginBottom: 30,
          }}
        />
      </SectionComponent>
        <SectionComponent>
          <TextComponent size={24} title text="Đăng kí" />
          <SpaceComponent height={21} />
          <InputComponent
            value={values.fullName}
            placeholder="Tên người dùng"
            onChange={val => handleChangeValue('fullName', val)}
            allowClear
            affix={<User size={22} color={appColors.gray} />}
          />
          <InputComponent
            value={values.email}
            placeholder="email"
            onChange={val => handleChangeValue('email', val)}
            allowClear
            affix={<Sms size={22} color={appColors.gray} />}
            onEnd={() => formValidator('email')}
          />
          <InputComponent
            value={values.phone}
            placeholder="số điện thoại"
            onChange={val => handleChangeValue('phone', val)}
            allowClear
            affix={<Call size={22} color={appColors.gray} />}
            onEnd={() => formValidator('phone')}
          />
          <InputComponent
            value={values.password}
            placeholder="Mật khẩu"
            onChange={val => handleChangeValue('password', val)}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('password')}
          />
          <InputComponent
            value={values.confirmPassword}
            placeholder="Xác nhận mật khẩu"
            onChange={val => handleChangeValue('confirmPassword', val)}
            isPassword
            allowClear
            affix={<Lock size={22} color={appColors.gray} />}
            onEnd={() => formValidator('confirmPassword')}
          />
        </SectionComponent>

        {errorMessage && (
          <SectionComponent>
            {Object.keys(errorMessage).map(
              (error, index) =>
                errorMessage[`${error}`] && (
                  <TextComponent
                    text={errorMessage[`${error}`]}
                    key={`error${index}`}
                    color={appColors.danger}
                  />
                ),
            )}
          </SectionComponent>
        )}
        <SpaceComponent height={16} />
        <SectionComponent>
          <ButtonComponent
            onPress={handleRegister}
            text="ĐĂNG KÍ"
            disable={isDisable}
            type="primary"
          />
        </SectionComponent>
        <SectionComponent>
          <RowComponent justify="center">
            <TextComponent text="Đã có tài khoản? " />
            <ButtonComponent
              type="link"
              text="Đăng nhập"
              onPress={() => navigation.navigate('LoginScreen')}
            />
          </RowComponent>
        </SectionComponent>
      </ContainerComponent>
      <LoadingModal visible={isLoading} />
    </>
  );
};

export default SignUpScreen;

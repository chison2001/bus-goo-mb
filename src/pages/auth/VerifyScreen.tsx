import { View, Text, TextInput, StyleSheet } from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "../../components";
import { ArrowRight } from "iconsax-react-native";
import { appColors } from "../../constants/appColors";
import { fontFamilies } from "../../constants/fontFamilies";
import authenticationAPI from "@/services/authApi";
import { LoadingModal } from "../../modals";
import { useDispatch } from "react-redux";
import { addAuth } from "../../redux/reducers/authReducer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles } from "@/theme/globalStyles";

const Verification = ({ navigation, route }: any) => {
  const { email } = route.params;

  const [currentCode, setCurrentCode] = useState<string>("");
  const [codeValues, setCodeValues] = useState<string[]>([]);
  const [newCode, setNewCode] = useState("");
  const [limit, setLimit] = useState(60);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const ref1 = useRef<any>();
  const ref2 = useRef<any>();
  const ref3 = useRef<any>();
  const ref4 = useRef<any>();
  const ref5 = useRef<any>();
  const ref6 = useRef<any>();

  const dispatch = useDispatch();

  useEffect(() => {
    ref1.current.focus();
  }, []);

  useEffect(() => {
    if (limit > 0) {
      const interval = setInterval(() => {
        setLimit((limit) => limit - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [limit]);

  useEffect(() => {
    let item = ``;

    codeValues.forEach((val) => (item += val));

    setNewCode(item);
  }, [codeValues]);

  const handleChangeCode = (val: string, index: number) => {
    const data = [...codeValues];
    data[index] = val;

    setCodeValues(data);
  };

  const handleResendVerification = async () => {
    setCodeValues(["", "", "", "", "", ""]);
    setNewCode("");
    setIsLoading(true);
    console.log(`email nè ${email}`);
    try {
      const res: any = await authenticationAPI.HandleAuthentication(
        "/createToken",
        {},
        "get",
        { email: email }
      );
      const token = res.data.valueReponse.token;
      setCurrentCode(token);

      setLimit(60);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log(`Can not send verification code ${error}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await handleResendVerification();
      } catch (error) {
        console.log(`Can not send verification code ${error}`);
      }
    };
    fetchData();
  }, []);
  useEffect(() => {
    console.log(`Current code updated`);
  }, [currentCode]);
  const handleVerification = async () => {
    if (limit > 0) {
      if (String(newCode) !== String(currentCode)) {
        setErrorMessage("Mã xác minh không đúng!!!");
      } else {
        setErrorMessage("");

        const api = `/verify`;

        try {
          const res: any = await authenticationAPI.HandleAuthentication(
            api,
            {},
            "get",
            {
              email: email,
              token: newCode,
            }
          );
          navigation.navigate("LoginScreen");
        } catch (error) {
          setErrorMessage("Người dùng đã tạo tài khoản!!!");
          console.log(`Không thể xác minh người dùng ${error}`);
        }
      }
    } else {
      setErrorMessage("Mã xác minh hết hạn, lấy mã mới!!!");
    }
  };

  return (
    <ContainerComponent back isImageBackground isScroll>
      <SectionComponent>
        <TextComponent text="Xác minh email đăng kí" title />
        <SpaceComponent height={12} />
        <TextComponent
          text={`Chúng tôi vừa gửi 1 mã xác mình gồm 6 kí tự bao gồm chữ và số qua email  ${email.replace(
            /.{1,5}/,
            (m: any) => "*".repeat(m.length)
          )}`}
        />
        <SpaceComponent height={26} />
        <RowComponent justify="space-around">
          <TextInput
            ref={ref1}
            value={codeValues[0]}
            style={[styles.input]}
            maxLength={1}
            onChangeText={(val) => {
              val.length > 0 && ref2.current.focus();
              handleChangeCode(val, 0);
            }}
            // onChange={() => }
            placeholder="-"
          />
          <TextInput
            ref={ref2}
            value={codeValues[1]}
            onChangeText={(val) => {
              handleChangeCode(val, 1);
              val.length > 0 && ref3.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            value={codeValues[2]}
            ref={ref3}
            onChangeText={(val) => {
              handleChangeCode(val, 2);
              val.length > 0 && ref4.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            ref={ref4}
            value={codeValues[3]}
            onChangeText={(val) => {
              handleChangeCode(val, 3);
              val.length > 0 && ref5.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            ref={ref5}
            value={codeValues[4]}
            onChangeText={(val) => {
              handleChangeCode(val, 4);
              val.length > 0 && ref6.current.focus();
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
          <TextInput
            ref={ref6}
            value={codeValues[5]}
            onChangeText={(val) => {
              handleChangeCode(val, 5);
            }}
            style={[styles.input]}
            maxLength={1}
            placeholder="-"
          />
        </RowComponent>
      </SectionComponent>
      <SectionComponent styles={{ marginTop: 40 }}>
        <ButtonComponent
          disable={newCode.length !== 6}
          onPress={handleVerification}
          text="Continue"
          type="primary"
          iconFlex="right"
          icon={
            <View
              style={[
                globalStyles.iconContainer,
                {
                  backgroundColor:
                    newCode.length !== 4 ? appColors.gray : appColors.primary,
                },
              ]}
            >
              <ArrowRight size={18} color={appColors.white} />
            </View>
          }
        />
      </SectionComponent>
      {errorMessage && (
        <SectionComponent>
          <TextComponent
            styles={{ textAlign: "center" }}
            text={errorMessage}
            color={appColors.danger}
          />
        </SectionComponent>
      )}
      <SectionComponent>
        {limit > 0 ? (
          <RowComponent justify="center">
            <TextComponent text="Gửi lại mã xác minh trong " flex={0} />
            <TextComponent
              text={`${limit} s`}
              flex={0}
              color={appColors.link}
            />
          </RowComponent>
        ) : (
          <RowComponent>
            <ButtonComponent
              type="link"
              text="Gửi lại xác minh email"
              onPress={handleResendVerification}
            />
          </RowComponent>
        )}
      </SectionComponent>
      <LoadingModal visible={isLoading} />
    </ContainerComponent>
  );
};

export default Verification;

const styles = StyleSheet.create({
  input: {
    height: 55,
    width: 55,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: appColors.gray2,
    justifyContent: "center",
    alignItems: "center",
    fontSize: 24,
    fontFamily: fontFamilies.bold,
    textAlign: "center",
  },
});

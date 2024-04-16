import React, { useEffect, useState } from "react";
import {
  ButtonComponent,
  ContainerComponent,
  InputComponent,
  RowComponent,
  SectionComponent,
  SpaceComponent,
  TextComponent,
} from "@/components";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "@/redux/reducers/authReducer";
import { View, ActivityIndicator } from "react-native";
import defaultAPI from "@/services/defaultApi";
import { globalStyles } from "@/theme/globalStyles";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { appColors } from "@/constants/appColors";
const VerifyPaymentScreen = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [icon, setIcon] = useState("");
  const [color, setColor] = useState("");
  const { params } = route.params;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await defaultAPI.HandleAPI(
          "/verify-payment",
          {
            vnp_Amount: Number(params["vnp_Amount"]),
            vnp_BankCode: params["vnp_BankCode"],
            vnp_BankTranNo: params["vnp_BankTranNo"],
            vnp_CardType: params["vnp_CardType"],
            vnp_OrderInfo: params["vnp_OrderInfo"],
            vnp_PayDate: Number(params["vnp_PayDate"]),
            vnp_ResponseCode: params["vnp_ResponseCode"],
            vnp_TmnCode: params["vnp_TmnCode"],
            vnp_TransactionNo: params["vnp_TransactionNo"],
            vnp_TransactionStatus: params["vnp_TransactionStatus"],
            vnp_TxnRef: params["vnp_TxnRef"],
            vnp_SecureHash: params["vnp_SecureHash"],
          },
          "post",
          {}
        );
        const { respType, responseMsg, valueReponse } = res.data;
        if (respType === 200) {
          setMessage("Thanh toán thành công");
          setIcon("check-circle-outline");

          setColor(appColors.green);
        } else {
          setMessage(responseMsg);
          setIcon("alert-circle-outline");
          setColor(appColors.danger);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching verify:", error);
      }
    };
    fetchData();
  }, []);
  function handleNavigate(): void {
    navigation.navigate("Trang chủ");
  }

  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" />}
      {!loading && (
        <View style={globalStyles.card}>
          <RowComponent>
            <Icon name={icon} color={color} size={30} />
            <TextComponent text={message} color={color} size={24} />
          </RowComponent>
          <ButtonComponent
            styles={{ marginTop: 20 }}
            onPress={handleNavigate}
            text="Trở về"
            type="primary"
            color={appColors.primary}
          />
        </View>
      )}
    </View>
  );
};

export default VerifyPaymentScreen;

import React, { useState } from "react";
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
import { ActivityIndicator, View } from "react-native";
import WebView from "react-native-webview";
const VNPAYScreen = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(true);

  const handleLoadStart = () => {
    setLoading(true);
  };

  const handleLoadEnd = () => {
    setLoading(false);
  };
  const { url } = route.params;
  const auth = useSelector(authSelector);
  const handleNavigationStateChange = (navState: {
    url: string | string[];
  }) => {
    if (
      typeof navState.url === "string" &&
      navState.url.includes("vnpay_return_url")
    ) {
      // Tạo một đối tượng URLSearchParams từ query string
      const params = new URLSearchParams(navState.url.split("?")[1]);

      // Tạo một đối tượng để lưu trữ các cặp key-value
      const queryParams: { [key: string]: string } = {};

      // Lặp qua tất cả các key của params và lưu trữ vào đối tượng
      params.forEach((value, key) => {
        queryParams[key] = value;
      });
      navigation.navigate("verify", {
        params: queryParams,
      });
    }
  };
  return (
    <View style={{ flex: 1 }}>
      {loading && <ActivityIndicator size="large" />}

      <WebView
        source={{ uri: url }}
        onLoadStart={handleLoadStart}
        onLoadEnd={handleLoadEnd}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </View>
  );
};

export default VNPAYScreen;

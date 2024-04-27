import React, { useEffect, useState } from "react";
import { RowComponent, TextComponent } from "@/components";
import { useSelector } from "react-redux";
import { authSelector } from "@/redux/reducers/authReducer";
import defaultAPI from "@/services/defaultApi";
import { appColors } from "@/constants/appColors";
import { globalStyles } from "@/theme/globalStyles";
import {
  ActivityIndicator,
  FlatList,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";

type invoice = {
  id: number;
  code: string;
  status: number;
  userCode: string;
  userName: string;
  total: number;
  timeBooking: string;
  busTrip: string;
  timeStarted: string;
};
const InvoiceListScreen = ({ navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState([] as invoice[]);
  const auth = useSelector(authSelector);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await defaultAPI.HandleAPI(
          "/api/invoice/mobile/find",
          {},
          "get",
          {
            userId: auth.id,
          }
        );
        setInvoices(res.data.valueReponse.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };

    fetchData();
  }, []);
  function formatPrice(value: number) {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  }
  function formatDate(dateFormat: string) {
    const date = new Date(dateFormat);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
  }

  function formatAddress(address: string, type: number) {
    const temp = address.split("-");
    if (type === 2) {
      return temp[1];
    }

    return temp[0];
  }
  const renderItem = ({ item }: { item: invoice }) => (
    <TouchableOpacity
      style={{
        backgroundColor: appColors.white,
        marginHorizontal: 15,
        marginTop: 15,
        borderRadius: 10,
        flexDirection: "row",
      }}
      onPress={() => {
        navigation.navigate("Xem chi tiết hoá đơn", { id: item.id });
      }}
    >
      <View
        style={{
          flex: 3,
          justifyContent: "center",
          alignItems: "center",
          padding: 10,
        }}
      >
        <TextComponent text="Thời gian đi" />
        <TextComponent
          text={formatToTime(item.timeStarted)}
          size={30}
          color={appColors.gray}
          styles={{ marginTop: 10 }}
        />
        <TextComponent text={formatDate(item.timeStarted)} />
      </View>
      <Divider style={{ height: "100%", width: 1, marginHorizontal: 10 }} />
      <View
        style={{
          flex: 7,
          justifyContent: "center",
          alignItems: "flex-start",
          padding: 10,
        }}
      >
        <RowComponent styles={{ paddingBottom: 5 }}>
          <TextComponent text="Code: " />
          <TextComponent text={item.code} />
        </RowComponent>
        <RowComponent styles={{ paddingBottom: 5 }}>
          <Icon name="record-circle" color={appColors.green} size={18} />
          <TextComponent text={` ${formatAddress(item.busTrip, 1)}`} />
        </RowComponent>
        <RowComponent styles={{ paddingBottom: 5 }}>
          <Icon name="map-marker" color={appColors.orange} size={18} />
          <TextComponent text={formatAddress(item.busTrip, 2)} />
        </RowComponent>
        <RowComponent>
          <TextComponent text="Tổng tiền: " />
          <TextComponent
            text={formatPrice(item.total)}
            color={appColors.danger}
          />
        </RowComponent>
      </View>
    </TouchableOpacity>
  );
  function formatToTime(date: string) {
    const now = new Date(date);
    const hour = now.getHours().toString().padStart(2, "0");
    const minute = now.getMinutes().toString().padStart(2, "0");

    return `${hour}:${minute}`;
  }
  return (
    <View style={[globalStyles.container_list]}>
      {loading && (
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      <FlatList
        data={invoices}
        renderItem={renderItem}
        keyExtractor={(item: invoice) => item.id.toString()}
      />
    </View>
  );
};

export default InvoiceListScreen;

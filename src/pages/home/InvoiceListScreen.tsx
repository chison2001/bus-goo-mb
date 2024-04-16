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

type invoice = {
  id: number;
  code: string;
  status: number;
  userCode: string;
  userName: string;
  total: number;
  timeBooking: string;
  busTrip: string;
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
  const renderItem = ({ item }: { item: invoice }) => (
    <TouchableOpacity
      style={{ backgroundColor: appColors.white, margin: 5, padding: 10 }}
      onPress={() => {
        navigation.navigate("Xem chi tiết hoá đơn", { id: item.id });
      }}
    >
      <View style={{ alignItems: "flex-start" }}>
        <RowComponent>
          <TextComponent text="Đơn hàng #" title />
          <TextComponent text={item.code} title />
        </RowComponent>
        <RowComponent>
          <TextComponent text="Tuyến đường: " />
          <TextComponent text={item.busTrip} />
        </RowComponent>
        <RowComponent>
          <TextComponent text="Ngày đặt: " />
          <TextComponent text={item.timeBooking} />
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

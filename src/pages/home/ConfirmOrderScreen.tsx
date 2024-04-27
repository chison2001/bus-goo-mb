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
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { globalStyles } from "@/theme/globalStyles";
import { Divider } from "react-native-paper";
import defaultAPI from "@/services/defaultApi";
import { Picker } from "@react-native-picker/picker";
import { authSelector } from "@/redux/reducers/authReducer";
import { useSelector } from "react-redux";

interface Region {
  label: string;
  value: number;
}
const ConfirmOrderScreen = ({ route, navigation }: any) => {
  const [loading, setLoading] = useState(true);
  const { routeName, from, to, time, price, selectedSeats, listSeatOrder } =
    route.params;
  const arraySeat: string[] = Object.values(selectedSeats);
  const [pickUps, setPickUps] = useState([] as Region[]);
  const [dropOffs, setDropOffs] = useState([] as Region[]);
  const [pickUpPoint, setPickUpPoint] = useState<number>();
  const [dropOffPoint, setDropOffPoint] = useState<number>();
  const [discount, setDiscount] = useState<number>();
  const [user, setUser] = useState();
  const auth = useSelector(authSelector);

  function formatDateString(dateString: string) {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");

    return `${hours}:${minutes} ${day}-${month}-${year}`;
  }
  function formatPrice(value: number) {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  }
  async function getPickUps() {
    const res = await defaultAPI.HandleAPI("/api/station/get", {}, "get", {
      regionDetailId: from,
    });

    const data = res.data.valueReponse.data;

    const formattedData: Region[] = data.map(
      (item: { name: any; id: any }) => ({
        label: item.name,
        value: item.id,
      })
    );

    setPickUps(formattedData);

    // Thiết lập giá trị mặc định cho pickUpPoint
    if (formattedData.length > 0) {
      setPickUpPoint(formattedData[0].value);
    }
  }
  async function getDropOffs() {
    const res = await defaultAPI.HandleAPI("/api/station/get", {}, "get", {
      regionDetailId: to,
    });

    const data = res.data.valueReponse.data;

    const formattedData: Region[] = data.map(
      (item: { name: any; id: any }) => ({
        label: item.name,
        value: item.id,
      })
    );

    setDropOffs(formattedData);

    console.log(formattedData[0].value);

    // Thiết lập giá trị mặc định cho dropOffPoint
    if (formattedData.length > 0) {
      setDropOffPoint(formattedData[0].value);
    }
  }
  async function getPromotion() {
    const res = await defaultAPI.HandleAPI(
      "/api/promotion/get-by-frice",
      {},
      "get",
      {
        priceValue: Number(price) * arraySeat.length,
      }
    );

    const data = res.data.valueReponse.data;
    const type = data.promotionType;

    if (type === 1) setDiscount(data.discount);
    if (type === 2) {
      const temp = (Number(price) * arraySeat.length * data.discount) / 100;
      if (temp > data.maxDiscount) setDiscount(data.maxDiscount);
      else setDiscount(temp);
    }
  }
  async function getUser() {
    const res = await defaultAPI.HandleAPI("/api/user/get", {}, "get", {
      userId: auth.id,
    });

    const data = res.data.valueReponse.data;
    setUser(data);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getPickUps();
        await getDropOffs();
        await getPromotion();
        await getUser();
        setLoading(false);
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchData();
  }, []);
  async function createOrder() {
    try {
      const res = await defaultAPI.HandleAPI(
        "/api/order/create",
        {
          userId: auth.id,
          lstSeatOrderId: listSeatOrder,
          pickupPointId: pickUpPoint,
          dropoffPointId: dropOffPoint,
        },
        "post",
        {}
      );
      const { respType, responseMsg, valueReponse } = res.data;
      if (respType === 200) {
        return valueReponse.data.orderId;
      } else {
        console.error(responseMsg);
        return null;
      }
    } catch (error) {
      console.error("Error creating order:", error);
      return null;
    }
  }

  async function Payment() {
    const newOrderId = await createOrder();
    if (!newOrderId) {
      console.error("Order creation failed, cannot proceed to payment");
      return;
    }
    try {
      const res = await defaultAPI.HandleAPI("/payment", {}, "get", {
        orderId: newOrderId,
        paymentType: "VNPAY",
      });
      const { respType, responseMsg, valueReponse } = res.data;
      if (respType === 200) {
        navigation.navigate("VNPAY", {
          url: valueReponse.paymentUrl,
        });
      } else {
        console.error(responseMsg);
      }
    } catch (error) {
      console.error("Error processing payment:", error);
    }
  }
  return (
    <View style={[globalStyles.container, { padding: 20 }]}>
      {loading && (
        <View
          style={{ justifyContent: "center", flex: 1, alignItems: "center" }}
        >
          <ActivityIndicator size="large" />
        </View>
      )}
      {!loading && (
        <View>
          <TextComponent text="Thông tin của bạn" title />
          <RowComponent styles={styles.row}>
            <TextComponent text="Họ và tên: " />
            <TextComponent text={auth.name} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Email: " />
            <TextComponent text={auth.email} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Số điện thoại: " />
            {user && <TextComponent text={user.phone} />}
          </RowComponent>
          <Divider style={{ height: 1, width: "100%", marginVertical: 10 }} />
          <TextComponent text="Thông tin vé xe" title />
          <RowComponent styles={styles.row}>
            <TextComponent text="Tuyến xe: " />
            <TextComponent text={routeName} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Thời gian xuất bến: " />
            <TextComponent text={formatDateString(time)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Số lượng ghế: " />
            <TextComponent text={String(arraySeat.length)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Số ghế: " />
            <TextComponent text={arraySeat.join(", ")} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Tổng tiền lượt đi: " />
            <TextComponent text={formatPrice(arraySeat.length * price)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Khuyến mãi: " />
            <TextComponent text={formatPrice(discount ? discount : 0)} />
          </RowComponent>
          <RowComponent styles={styles.row}>
            <TextComponent text="Tiền thanh toán: " />
            <TextComponent
              text={formatPrice(
                arraySeat.length * price - (discount ? discount : 0)
              )}
            />
          </RowComponent>
          <Divider style={{ height: 1, width: "100%", marginVertical: 10 }} />
          <TextComponent text="Thông tin đón trả" title />
          <View style={{ marginTop: 15 }}>
            <TextComponent text="Bến đi" />
            <Picker
              selectedValue={pickUpPoint}
              onValueChange={(itemValue, itemIndex) =>
                setPickUpPoint(itemValue)
              }
            >
              {pickUps.map((item: Region, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
            <TextComponent text="Bến đến" />
            <Picker
              selectedValue={dropOffPoint}
              onValueChange={(itemValue, itemIndex) =>
                setDropOffPoint(itemValue)
              }
            >
              {dropOffs.map((item: Region, index) => (
                <Picker.Item
                  key={index}
                  label={item.label}
                  value={item.value}
                />
              ))}
            </Picker>
          </View>
          <View style={styles.buttomSubmit}>
            <ButtonComponent text="Đặt vé" type="primary" onPress={Payment} />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    marginTop: 15,
    justifyContent: "space-between",
  },
  buttomSubmit: {
    marginTop: 10,
  },
});

export default ConfirmOrderScreen;

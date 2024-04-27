import React, { useEffect, useState } from "react";
import { ButtonComponent, RowComponent, TextComponent } from "@/components";
import { Platform, StatusBar, View, StyleSheet, Text } from "react-native";
import { Picker } from "@react-native-picker/picker";
import defaultAPI from "@/services/defaultApi";
import { globalStyles } from "@/theme/globalStyles";
import { appColors } from "@/constants/appColors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import Swiper from "react-native-swiper";

interface Region {
  label: string;
  value: number;
}
interface Promotion {
  promotionDetailId: number;
  promotionCode: string;
  promotionLineName: string;
  promotionType: number;
  discount: number;
  conditionApply: number;
  maxDiscount: number;
}

const HomeScreen = ({ navigation }: any) => {
  const [selectedFrom, setSelectedFrom] = useState();
  const [selectedTo, setSelectedTo] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const [promotions, setPromotions] = useState([] as Promotion[]);
  const [cities, setCities] = useState([]);
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const now = new Date();
  now.setDate(now.getDate() + 1);
  const [date, setDate] = useState(now);

  function formatDate(date: Date, type: number) {
    const year = date.getFullYear(); // 2024
    const month = date.getMonth() + 1; // Tháng trong JavaScript bắt đầu từ 0
    const day = date.getDate(); // 25
    if (type === 2) {
      return `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`;
    }
    return `${day.toString().padStart(2, "0")}-${month
      .toString()
      .padStart(2, "0")}-${year}`;
  }

  const onChange = (event: DateTimePickerEvent, date?: Date) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode: React.SetStateAction<string>) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };
  const handleNavigate = () => {
    navigation.navigate("Xem vé", {
      from: selectedFrom,
      to: selectedTo,
      date: formatDate(date, 2),
    });
  };
  async function getRegion() {
    const res = await defaultAPI.HandleAPI(
      "/api/region/find",
      {
        parentId: null,
        regionStructureId: 1,
      },
      "post"
    );

    const data = res.data.valueReponse.data;
    const cityItems = data.map((item: { fullName: any; id: any }) => ({
      label: item.fullName,
      value: item.id,
    }));
    setCities(cityItems);
  }
  async function getPromotion() {
    const res = await defaultAPI.HandleAPI(
      "/api/promotion/get-current-promotion",
      {},
      "get",
      {}
    );

    const data = res.data.valueReponse.data;
    setPromotions(data);
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        await getRegion();
        await getPromotion();
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchData();
  }, []);
  function formatPrice(value: number) {
    return `${value.toLocaleString("vi-VN")} VNĐ`;
  }
  return (
    <View style={[globalStyles.container]}>
      <View
        style={{
          backgroundColor: appColors.white2,
          borderColor: appColors.orange,
          borderWidth: 2,
          height: 288 + (Platform.OS === "ios" ? 16 : 0),
          borderRadius: 20,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 52,
          marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 15,
          paddingHorizontal: 16,
          marginHorizontal: 8,
        }}
      >
        <RowComponent
          styles={{
            justifyContent: "space-between",
          }}
        >
          <TextComponent text="Điểm khởi hành" />
          <Picker
            selectedValue={selectedFrom}
            onValueChange={(itemValue, itemIndex) => setSelectedFrom(itemValue)}
            style={{ width: "70%" }}
          >
            {cities.map((item: Region, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </RowComponent>

        <RowComponent
          styles={{
            justifyContent: "space-between",
          }}
        >
          <TextComponent text="Điểm đến" />
          <Picker
            selectedValue={selectedTo}
            onValueChange={(itemValue, itemIndex) => setSelectedTo(itemValue)}
            style={{ width: "70%" }}
          >
            {cities.map((item: Region, index) => (
              <Picker.Item key={index} label={item.label} value={item.value} />
            ))}
          </Picker>
        </RowComponent>

        <RowComponent
          styles={{
            justifyContent: "space-between",
            paddingBottom: 20,
            marginTop: 10,
          }}
        >
          <TextComponent text="Chọn ngày khởi hành" />
          <Text
            style={{ marginRight: 5, fontSize: 20 }}
            onPress={showDatepicker}
          >
            {formatDate(date, 1)}
          </Text>
        </RowComponent>

        <ButtonComponent
          onPress={handleNavigate}
          text="Tìm kiếm"
          type="primary"
          color={appColors.primary}
        />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            minimumDate={now}
            is24Hour={true}
            display="default"
            onChange={onChange}
          />
        )}
      </View>

      <View
        style={{
          flex: 0.4,
          margin: 20,
          backgroundColor: appColors.orange,
          borderRadius: 10,
        }}
      >
        <Swiper autoplay>
          {promotions.map((promotion, index) => (
            <View key={index} style={styles.slide}>
              <RowComponent>
                <TextComponent
                  styles={styles.promotionLineName}
                  text={promotion.promotionLineName}
                  title
                />
              </RowComponent>
              <RowComponent>
                <TextComponent
                  text={
                    promotion.promotionType === 1
                      ? `Giảm giá: ${promotion.discount.toLocaleString()} vnd`
                      : `Chiết khấu: ${promotion.discount}%`
                  }
                />
              </RowComponent>
              <RowComponent>
                {promotion.conditionApply && (
                  <TextComponent
                    text={`Áp dụng cho đơn hàng từ: ${formatPrice(
                      promotion.conditionApply
                    )}`}
                  />
                )}
                {promotion.maxDiscount && (
                  <TextComponent
                    text={`Giảm tối đa: ${formatPrice(
                      promotion.maxDiscount
                    )} %`}
                  />
                )}
              </RowComponent>
            </View>
          ))}
        </Swiper>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  wrapper: {},
  slide: {
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  promotionCode: {
    fontSize: 20,
    fontWeight: "bold",
  },
  promotionLineName: {
    fontSize: 16,
    marginBottom: 10,
  },
  // Add more styles if needed
});

export default HomeScreen;

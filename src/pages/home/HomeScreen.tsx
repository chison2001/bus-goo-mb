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
import { Button, Platform, StatusBar, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "@/redux/reducers/authReducer";
import { Picker } from "@react-native-picker/picker";
import defaultAPI from "@/services/defaultApi";
import { globalStyles } from "@/theme/globalStyles";
import { appColors } from "@/constants/appColors";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface Region {
  label: string;
  value: number;
}

const HomeScreen = ({ navigation }: any) => {
  const [selectedFrom, setSelectedFrom] = useState();
  const [selectedTo, setSelectedTo] = useState();
  const [selectedDate, setSelectedDate] = useState();
  const dispatch = useDispatch();
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
  useEffect(() => {
    const fetchData = async () => {
      try {
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
      } catch (error) {
        console.error("Error fetching cities:", error);
      }
    };
    fetchData();
  }, []);
  return (
    <View style={[globalStyles.container]}>
      <View
        style={{
          backgroundColor: appColors.orange,
          height: 318 + (Platform.OS === "ios" ? 16 : 0),
          borderBottomLeftRadius: 40,
          borderBottomRightRadius: 40,
          paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 52,
          paddingHorizontal: 16,
        }}
      >
        <TextComponent text="Chọn điểm khởi hành" />
        <Picker
          selectedValue={selectedFrom}
          onValueChange={(itemValue, itemIndex) => setSelectedFrom(itemValue)}
        >
          {cities.map((item: Region, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
        <TextComponent text="Chọn điểm đến" />
        <Picker
          selectedValue={selectedTo}
          onValueChange={(itemValue, itemIndex) => setSelectedTo(itemValue)}
        >
          {cities.map((item: Region, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
        <TextComponent text="Chọn ngày khởi hành" />

        <View style={{ alignItems: "center", paddingBottom: 10 }}>
          <RowComponent>
            <TextComponent
              size={20}
              text={formatDate(date, 1)}
              styles={{ marginRight: 5 }}
            />
            <Button
              onPress={showDatepicker}
              title="Chọn ngày"
              color={appColors.primary}
            />
          </RowComponent>
        </View>

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
    </View>
  );
};

export default HomeScreen;

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import React from "react";
import {
  ButtonComponent,
  ContainerComponent,
  RowComponent,
  TextComponent,
} from "../../components";
import { useDispatch, useSelector } from "react-redux";
import { authSelector, removeAuth } from "../../redux/reducers/authReducer";
import { globalStyles } from "@/theme/globalStyles";
import { Avatar, Divider, Title } from "react-native-paper";
import { appColors } from "@/constants/appColors";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const user = useSelector(authSelector);
  return (
    <ScrollView style={globalStyles.container_list}>
      <TouchableOpacity activeOpacity={0.8} style={styles.cardTop}>
        <View style={styles.userInfoSection}>
          <View style={{ flexDirection: "row" }}>
            <Avatar.Image
              source={{
                uri: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAQMAAADCCAMAAAB6zFdcAAAAM1BMVEXFzeD////Byt7L0uPByd7Q1+b7/P3j5/Dv8fbe4+3r7vTFzuDL0+P19/rn6/LZ3urW2+lU+LHUAAAFLklEQVR4nO2dC3arMAxEQXwCcfjsf7XPkLw2tEka5AEziu8CeuKpJVmyLLIskUgkEkdFbsT+HXEQKbNqOPWN59y72D9nd/z/vWqbOv/mozSY9n116vIl1acYg1++G9v+5/rzvMs+QwL/7x/O9a/lT5zL2D9uF7wAzcP1e+pP2AQi4/mZAJ6TfQ3EtY9N4D+jdQ2k6F8K4OltayDFKyP4cghmI6PzVvDnHrDuEqR9UwFPY1IEufw+C72yh8LeIUFOaxSY6K0dFt2qTXDDVJCUi0IBT2vHHmTUSWAnPjgZtBJ4p2BjJ4RIYCSHlCpEAi+CAXMowiSwIIJoguKSE7k5rD8aPWDg3gnKg8EPLrGXEUL5tGC2ijr2OkIIjAlfEJdVBLMNcmprQEnAW09YUzT5C9aNADgbfMGaPQlOgrwj1cAlDZIGGVYD2ktIpAasiRNQgzxpkOektoCMjUkDT+zFaEFqwNqohtSgiL0YHcHlVAMaoCooM6SJo/qK7RGk+yBpkGVBl2w2NAi7aEwamNEAWE5MGiQNkgZJg6RB0sCEBoj+C3YN0j5IGkyks3LKnSegdaSkQdIgaUCtwcf7RJHy02OjVG3/+knvSlxJd+uK7Emb6eqOrQVBoJvgCtu16xYasF23QXsPWDVI+yArN9CALTyW6LhAqAE8NuaEcQH2fOMbtkNS+e7IC8MaYIuJM3TnRGwxcYbvPQ+0eDBD95TFIRv3rwyx17Qa/EGRbmqSAz1xvSP2ktaDvW3MOV9xoJ0i43tftEPgc4n4U1Ls9ajAbgTOkSCh02AW1GxJ4w2gCKwSIAspF0pLmIB5BNaXvhnwnMSXMn6DqrBzBoUrqKoiXdp8B6qqWMVeSADyzijhNyDeBiinyOwSUc95uAemYZ66sl0wLYGcFPmK6gsgCTRzZJxAlJe5TQFyQiA3hQxRVuSOChPBXrEW2trBf/RDts1sg+C8iXZA1oKwc9IY++dDCDojUKcKd5T67JF6ou4C9SHBhjO4os2hiWupv1Hm0JY00LpFKx5xQmsLpjRQdisy19R/om3MsaSB9rxsSgOdBKY00E5SZOxBeoa2kGJJA+01gyEN1JmjJQ20jxnYq+p3qPNGQxqo66qtHQ3UfUlJA0MalKJ+8NnyPfh/hFzOnbpFr6vP7JeNGaALw0BJMfzemT4+IhqSYq8hFESDInNj3ky4BPSXroieLPZDAuI7nuROsUS84iAvqKmT5gWxVxEIQgJuY8BsA+6NgPmyMXVkQHXuM+cMuBEIjO98Z4K78r5pOFtVpWiRn7Qd+aop5QU9AqJuMyYVRKoNJkT58OD/cuy1vYUX4LTBvLgrzVAcXwYpthPgSjcc2ybkgjoRvKQvjqrCVl7gEU11RJMQGTeYFvicbjyaCnsrMFG3R1JBsnZjR/hEhf4gJiHi0NOg1nCOL8OejvAJ3RBTBScy7O4GHlCfXCwV4hrBkvMlQmYpZXQjWLJ7sJTyEEawZNfMsowUC/+m38kxiNtgbDCMZgfHIMUuaVEA3cYnBnx5aAu8e9xMASkYFJjoNpo/K+7oVnBPg68xuKw8zoHoPXp0pCzHg0bDV0CTa3EsjmBJjUunsB9u35Ua08wkGecmuIEIEVIReoIFwTf38JHhEQgcxuqOlx4qCBFBCnY7uKH/uhV0SHRU9CNFUO1EB0A9TMKIIczoggP+QxpRUQ0cM+MMrmiezG7x0bmoKDYCZhLqgVjf8WvhfLhkfaPnFt/di8zq6XNbfIczMqsHDW3xTdrYPFvrP7kiUsVMV4ODAAAAAElFTkSuQmCC",
              }}
              size={50}
              style={{ marginTop: 5 }}
            />
            <View style={{ marginLeft: 10, flexDirection: "column" }}>
              <Title style={styles.title}>{user.name}</Title>
              <Text style={styles.caption} numberOfLines={1}>
                {user.email}
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.cardMid}>
        <TouchableOpacity style={styles.item}>
          <Icon name="bell" color={appColors.orange} size={20} />
          <TextComponent
            styles={{ marginLeft: 10 }}
            text="Thông báo"
            size={18}
          />
        </TouchableOpacity>
        <Divider style={{ height: 1, width: "100%", marginVertical: 5 }} />
        <TouchableOpacity style={styles.item}>
          <Icon name="map-marker" color={appColors.green} size={20} />
          <TextComponent
            styles={{ marginLeft: 10 }}
            text="Địa điểm yêu thích"
            size={18}
          />
        </TouchableOpacity>
        <Divider style={{ height: 1, width: "100%", marginVertical: 5 }} />
        <TouchableOpacity style={styles.item}>
          <Icon name="circle-off-outline" color={appColors.danger} size={20} />
          <TextComponent
            styles={{ marginLeft: 10 }}
            text="Danh sách đen"
            size={18}
          />
        </TouchableOpacity>
        <Divider style={{ height: 1, width: "100%", marginVertical: 5 }} />
        <TouchableOpacity style={styles.item}>
          <Icon name="star-box-outline" color={appColors.orange} size={20} />
          <TextComponent
            styles={{ marginLeft: 10 }}
            text="Khuyến mãi"
            size={18}
          />
        </TouchableOpacity>
        <Divider style={{ height: 1, width: "100%", marginVertical: 5 }} />
        <TouchableOpacity style={styles.item}>
          <Icon name="cog" color={appColors.orange} size={20} />
          <TextComponent styles={{ marginLeft: 10 }} text="Cài đặt" size={18} />
        </TouchableOpacity>
      </View>
      <View style={styles.cardMid}>
        <TouchableOpacity
          style={styles.item}
          onPress={async function (): Promise<void> {
            await AsyncStorage.removeItem("auth");
            dispatch(removeAuth({}));
          }}
        >
          <Icon name="logout" color={appColors.gray4} size={20} />
          <TextComponent
            styles={{ marginLeft: 10 }}
            text="Đăng xuất"
            size={18}
          />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};
const styles = StyleSheet.create({
  cardTop: {
    backgroundColor: appColors.white,
    paddingVertical: 20,
  },
  cardMid: {
    backgroundColor: appColors.white,
    marginTop: 10,
    paddingVertical: 15,
  },
  item: {
    padding: 10,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 13,
    lineHeight: 14,
    // color: '#6e6e6e',
    width: "100%",
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#dedede",
    borderTopWidth: 1,
    borderBottomColor: "#dedede",
    borderBottomWidth: 1,
  },
});

export default ProfileScreen;

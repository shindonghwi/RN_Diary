import React, { useEffect, useState } from "react";
import styled from "styled-components/native";
import { Ionicons } from "@expo/vector-icons";
import colors from "../colors";
import { useDB } from "../context";
import { FlatList, TouchableOpacity, LayoutAnimation } from "react-native";

const View = styled.View`
  flex: 1;
  padding: 0px 50px;
  padding-top: 100px;
  background-color: ${colors.bgColor};
`;
const Title = styled.Text`
  color: ${colors.textColor};
  font-size: 38px;
  margin-bottom: 100px;
`;
const Btn = styled.TouchableOpacity`
  position: absolute;
  bottom: 50px;
  right: 50px;
  height: 80px;
  width: 80px;
  border-radius: 40px;
  justify-content: center;
  align-items: center;
  background-color: ${colors.btnColor};
  elevation: 5; // for android
  box-shadow: 1px 1px 50px rgba(255, 255, 255, 0.5); // for iOS
`;

const Record = styled.View`
  background-color: ${colors.cardColor};
  flex-direction: row;
  padding: 10px 20px;
  align-items: center;
  border-radius: 10px;
`;

const Emotion = styled.Text`
  font-size: 24px;
  margin-right: 10px;
`;
const Message = styled.Text`
  font-size: 18px;
  font-weight: 400;
`;

const Separator = styled.View`
  height: 10px;
`;

const Home = ({ navigation: { navigate } }) => {
  const realm = useDB();

  const [feelings, setFeelings] = useState([]);

  useEffect(() => {
    const feelings = realm.objects("Feeling");
    feelings.addListener((feelings, changes) => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
      setFeelings(feelings.sorted("_id", true));
    });
    return () => {
      feelings.removeAllListeners();
    };
  }, []);

  const onPress = (id) => {
    realm.write(() => {
      const feeling = realm.objectForPrimaryKey("Feeling", id);
      console.log(feeling);
      realm.delete(feeling);
    });
  };

  return (
    <View>
      <Title>My journal</Title>
      <FlatList
        data={feelings}
        contentContainerStyle={{ paddingVertical: 10 }}
        ItemSeparatorComponent={Separator}
        keyExtractor={(feeling) => feeling._id + ""}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => onPress(item._id)}>
            <Record>
              <Emotion>{item.emotion}</Emotion>
              <Message>{item.message}</Message>
            </Record>
          </TouchableOpacity>
        )}
      />
      <Btn onPress={() => navigate("Write")}>
        <Ionicons name="add" color="white" size={40} />
      </Btn>
    </View>
  );
};
export default Home;

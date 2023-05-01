import { View, Text, Button } from "react-native";

const List = ({ navigation}: any) => {
    return (
        <View>
            <Text>List</Text>
            <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
        </View>
    )
}

export default List;
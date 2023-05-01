import { addDoc, collection, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { View, Text, Button, ScrollView, FlatList, Touchable, TouchableOpacity } from "react-native";
import { AntDesign } from '@expo/vector-icons';
import { FIREBASE_DB } from "../../../firebaseConfig.ts";


type bank = {
    id?: string,
    bankName: string,
    url: string,
    age: number,
    description: string
}

type bankList = [
    bank?: bank
]

const List = ({ navigation}: any) => {
    const [banks, setBanks] = useState<bankList>([]);

    const renderBank = ({item}: any) => {
        return (
            <View>
                <Text>{item?.bankName}</Text>
                <Text>{item?.url}</Text>
                <Text>{item?.age}</Text>
                <Text>{item?.description}</Text>
                <TouchableOpacity>
                    {item && <AntDesign name="edit" size={24} color="black" />}
                </TouchableOpacity>
                <TouchableOpacity>
                    {item && <AntDesign name="delete" size={24} color="red" />}
                </TouchableOpacity>
            </View>
        )
    }

    useEffect(()=>{
        const bdRef = collection(FIREBASE_DB, 'Banks');

        const suscriber = onSnapshot(bdRef, {
            next: (snapshot) => {
                const banks: bankList = [];
                snapshot.docs.forEach((doc: any)=>{
                    banks.push({
                        id: doc.id,
                        ...doc.data()
                    })
                });
                setBanks(banks);
            },
        });
        return () => suscriber();
    })
    return (
        <ScrollView>
            <Text>List</Text>
            <Button onPress={() => navigation.navigate('Details')} title="Open Details" />
            {banks.length > 0 && (
                <View>
                    <FlatList
                    data={banks}
                    renderItem={renderBank}
                    keyExtractor={(bank: any) => bank?.id}
                    />
                </View>
            )}
        </ScrollView>

        
    )
}

export default List;
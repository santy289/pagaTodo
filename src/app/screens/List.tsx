import { addDoc, collection, deleteDoc, doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { View, Text, Button, ScrollView, FlatList, TouchableOpacity, StyleSheet, Modal, TextInput } from "react-native";
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

const List = ({ navigation }: any) => {

    const [banks, setBanks] = useState<bankList>([]);
    const [newId, serNewId] = useState('');
    const [isModalVisible, setModalVisible] = useState(false);
    const [isCreateModalVisible, setCreateModalVisible] = useState(false);
    const [document, setDocument] = useState<bank>({
    bankName: 'x',
    url: 'x',
    age: 0,
    description: 'x'
    });

    const openCreateModal = () => {
        setDocument({
            bankName: '',
            url: '',
            age: 0,
            description: ''
        });
        setCreateModalVisible(true);
    };

    const closeCreateModal = () => {
        setCreateModalVisible(false);
    };

    const hanlderAdd = () => {
        addDoc(collection(FIREBASE_DB, 'Banks'), {  
            bankName: document.bankName,
            url: document.url,
            age: document.age,
            description: document.description});
        closeCreateModal();
    }

    const renderBank = ({ item }: any) => {

    serNewId(item.id)

    const openModal = () => {
        setDocument({
            bankName: item.bankName,
            url: item.url,
            age: item.age,
            description: item.description
        });
        serNewId(item.id)
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const handlerSave = () => {
        const docRef = doc(FIREBASE_DB, `Banks/${newId}`)
        updateDoc(docRef,{  
        bankName: document.bankName,
        url: document.url,
        age: document.age,
        description: document.description})
        closeModal();
        }

    const handlerDelete = () => {
        const docRef = doc(FIREBASE_DB, `Banks/${newId}`)
        deleteDoc(docRef);
    }
    return (
        <View style={styles.bankContainer}>
        <Modal visible={isModalVisible}>
        <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Create Bank</Text>
            </View>
            <View>
                <Text style={styles.label}>Bank Name</Text>
                <TextInput
                style={styles.input}
                value={document.bankName}
                onChangeText={(text) => setDocument({ ...document, bankName: text })}
                />
            </View>
            <View>
                <Text style={styles.label}>URL</Text>
                <TextInput
                style={styles.input}
                value={document.url}
                onChangeText={(text) => setDocument({ ...document, url: text })}
                />
            </View>
            <View>
                <Text style={styles.label}>Age</Text>
                <TextInput
                style={styles.input}
                value={document.age.toString()}
                onChangeText={(text) => {
                    const age = text !== '' ? parseInt(text) : 0;
                    setDocument({ ...document, age });
                }}
                keyboardType="numeric"
                />
            </View>
            <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                style={styles.input}
                value={document.description}
                onChangeText={(text) => setDocument({ ...document, description: text })}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={handlerSave} />
                <Button title="Cancel" onPress={closeModal} />
            </View>
            </View>
        </View>
        </Modal>
        <Text style={styles.bankName}>{item?.bankName}</Text>
        <Text style={styles.bankUrl}>{item?.url}</Text>
        <Text style={styles.bankAge}>{item?.age}</Text>
        <Text style={styles.bankDescription}>{item?.description}</Text>
        <View style={styles.iconContainer}>
            <TouchableOpacity onPress={openModal} >
            {item && <AntDesign name="edit" size={24} color="black" />}
            </TouchableOpacity>
            <TouchableOpacity onPress={handlerDelete} >
            {item && <AntDesign name="delete" size={24} color="red" />}
            </TouchableOpacity> 
        </View>
        </View>
    )
    }

    useEffect(() => {
    const bdRef = collection(FIREBASE_DB, 'Banks');

    const suscriber = onSnapshot(bdRef, {
        next: (snapshot) => {
        const banks: bankList = [];
        snapshot.docs.forEach((doc: any) => {
            banks.push({
            id: doc.id,
            ...doc.data()
            })
        });
        setBanks(banks);
        },
    });
    return () => suscriber();
    }, [])

    return (
    <ScrollView style={styles.container}>
        <Modal visible={isCreateModalVisible}>
        <View style={styles.modalContainer}>
            <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>Create Bank</Text>
            </View>
            <View>
                <Text style={styles.label}>Bank Name</Text>
                <TextInput
                style={styles.input}
                value={document.bankName}
                onChangeText={(text) => setDocument({ ...document, bankName: text })}
                />
            </View>
            <View>
                <Text style={styles.label}>URL</Text>
                <TextInput
                style={styles.input}
                value={document.url}
                onChangeText={(text) => setDocument({ ...document, url: text })}
                />
            </View>
            <View>
                <Text style={styles.label}>Age</Text>
                <TextInput
                style={styles.input}
                value={document.age.toString()}
                onChangeText={(text) => {
                    const age = text !== '' ? parseInt(text) : 0;
                    setDocument({ ...document, age });
                }}
                keyboardType="numeric"
                />
            </View>
            <View>
                <Text style={styles.label}>Description</Text>
                <TextInput
                style={styles.input}
                value={document.description}
                onChangeText={(text) => setDocument({ ...document, description: text })}
                />
            </View>
            <View style={styles.buttonContainer}>
                <Button title="Save" onPress={hanlderAdd} />
                <Button title="Cancel" onPress={closeCreateModal} />
            </View>
            </View>
        </View>
        </Modal>
        <Text style={styles.title}>List</Text>
        <Button onPress={openCreateModal} title="Create Document" />
        {banks.length > 0 && (
        <View style={styles.bankListContainer}>
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

    const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: '#F7F9FC',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    bankListContainer: {
        marginTop: 16,
    },
    bankContainer: {
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 16,
        marginBottom: 16,
        borderRadius: 8,
    },
    bankName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    bankUrl: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 8,
    },
    bankAge: {
        fontSize: 16,
        color: 'gray',
        marginBottom: 8,
    },
    bankDescription: {
        fontSize: 16,
        marginBottom: 16,
        fontWeight: '300'
    },
    iconContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        marginTop: 8,
    },  
    label: {
        fontSize: 16,
        marginBottom: 8,
        fontWeight: 'bold',
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 16,
        width: 300,
        shadowColor: 'rgba(0, 0, 0, 0.2)',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 1,
        shadowRadius: 4,
        elevation: 2,
        backgroundColor: 'white',
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: '10%',
        justifyContent: 'space-around',
        width: '100%',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F7F9FC',
    },
    contentContainer: {
        width: '80%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    });

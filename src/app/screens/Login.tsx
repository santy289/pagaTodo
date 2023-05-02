import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { addDoc, collection } from "firebase/firestore";
import { FIREBASE_DB } from "../../../firebaseConfig";
import axios from "axios";

const Login = ({ navigation }: any) => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const auth = getAuth();

  const validatePassword = () => {
    if (password !== confirmPassword) {
      // Las contraseñas no coinciden, mostrar mensaje de error o tomar alguna acción
      console.log("Las contraseñas no coinciden");
      return false;
    }
    return true;
  };

  const handleLogin = async () => {
    try {
      const user: any = await signInWithEmailAndPassword(auth, email, password);
      if (user){
        setShowLoginModal(false);
        await AsyncStorage.setItem('user', user.user.uid);
        navigation.navigate("List", { id: user.user.uid });
      }  
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.code, error.message);
      if (error.code == 'auth/wrong-password') {
        alert('Usuario o contraseña incorrectos');
      }
    }
  };

  const handleSignup = async () => {
    if (validatePassword()) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential) {
        try {
            const response = await axios.get('https://dev.obtenmas.com/catom/api/challenge/banks');
            const banks = response.data;
            await Promise.all(banks.map(async (bank: any) => {
                await addDoc(collection(FIREBASE_DB, userCredential.user.uid), { ...bank });
            }));
            setShowSignupModal(false);
            await AsyncStorage.setItem('user', userCredential.user.uid);
            navigation.navigate("List", { id: userCredential.user.uid });
          } catch (error) {
            console.error('Error al obtener la lista de bancos:', error);
          }
      }
    } catch (error: any) {
      console.error('Error al iniciar sesión:', error.code, error.message);
      if (error.code === 'auth/email-already-in-use') {
        alert('El email ya se encuentra en uso');
      } else if (error.code ==='auth/weak-password'){
        alert('La contraseña debe tener al menos 6 caracteres');
      }
    }
    } else {
        alert('Las contraseñas no coinciden');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Tienes una cuenta?</Text>
        <>
          <TouchableOpacity style={styles.button} onPress={() => setShowLoginModal(true)} >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
          </TouchableOpacity>
          <Modal visible={showLoginModal} onRequestClose={() => setShowLoginModal(false)}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Iniciar sesión</Text>
              <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TouchableOpacity style={styles.button} onPress={handleLogin} >
                <Text style={styles.buttonText}>Iniciar sesión</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setShowLoginModal(false)} >
                <Text style={styles.buttonText}>Regresar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
        <>
          <Text style={styles.text}>¿No tienes una cuenta? </Text>
          <TouchableOpacity onPress={() => setShowSignupModal(true)}>
            <Text style={styles.link}>Crear cuenta</Text>
          </TouchableOpacity>
          <Modal visible={showSignupModal} onRequestClose={() => setShowSignupModal(false)}>
            <View style={styles.modalContainer}>
              <Text style={styles.title}>Crear cuenta</Text>
              <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
              />
              <TextInput
                placeholder="Contraseña"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={styles.input}
              />
              <TextInput
                secureTextEntry
                placeholder="Confirmar Contraseña"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                style={styles.input}
               />
              <TouchableOpacity style={styles.button} onPress={handleSignup} >
                <Text style={styles.buttonText}>Crear cuenta</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.button} onPress={() => setShowSignupModal(false)}>
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#55e6c3',
    textAlign: 'center',
    marginBottom: 40,
  },
  link: {
    fontSize: 18,
    color: "#55e6c3",
    textDecorationLine: 'underline',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 16,
  },
  input: {
    width: 300,
    height: 50,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 16,
  },
  text: {
    marginTop: 30,
  },
  button: {
    backgroundColor: '#55e6c3',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
},
buttonText: {
    minWidth: 100,
    textAlign: 'center',
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
},
});

export default Login;

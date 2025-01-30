import React, { useEffect, useState } from "react";
import { View, Button, Text, TextInput, Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                navigation.replace("MovieList"); // ログイン済みなら映画一覧へ
            }
        });
        return () => unsubscribe();
    }, []);

    // ログイン処理
    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
            return;
        }
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace("MovieList");
        } catch (error) {
            Alert.alert("ログイン失敗", error.message);
        }
    };

    // 新規登録処理
    const handleRegister = async () => {
        if (!email || !password) {
            Alert.alert("エラー", "メールアドレスとパスワードを入力してください");
            return;
        }
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            Alert.alert("登録成功", "アカウントが作成されました。ログインしてください。");
        } catch (error) {
            Alert.alert("登録失敗", error.message);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>ログイン</Text>
            <TextInput
                placeholder="メールアドレス"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <TextInput
                placeholder="パスワード"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <Button title="ログイン" onPress={handleLogin} />
            <Button title="新規登録" onPress={handleRegister} />
        </View>
    );
}

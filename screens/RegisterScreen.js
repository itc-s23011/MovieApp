import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../firebaseConfig"; // Firebase設定をインポート

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState(""); // ユーザー名
    const [error, setError] = useState(""); // エラーメッセージ

    // 新規登録処理
    const handleRegister = () => {
        if (!email || !password || !username) {
            setError("すべてのフィールドを入力してください。");
            return;
        }

        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                const user = userCredential.user;

                // Firestoreなどでユーザー名を追加保存する場合はここに処理を追加します

                // ユーザー名を設定
                updateProfile(user, { displayName: username })
                    .then(() => {
                        // ユーザー名を設定した後、映画一覧画面に遷移
                        navigation.replace("MovieList");
                    })
                    .catch((error) => {
                        setError(error.message);
                    });
            })
            .catch((error) => {
                setError(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>新規登録</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="ユーザー名"
                value={username}
                onChangeText={setUsername}
            />
            <TextInput
                style={styles.input}
                placeholder="メールアドレス"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <TextInput
                style={styles.input}
                placeholder="パスワード"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="新規登録" onPress={handleRegister} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#202328",
        padding: 20,
    },
    title: {
        color: "#fff",
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 40,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        color: "#fff",
    },
    errorText: {
        color: "red",
        marginBottom: 10,
    },
});

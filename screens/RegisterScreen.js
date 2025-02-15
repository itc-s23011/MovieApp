import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, ActivityIndicator } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

    // Firebaseエラーメッセージを日本語化
    const getFirebaseErrorMessage = (error) => {
        if (error.code === "auth/email-already-in-use") {
            return "このメールアドレスは既に登録されています。";
        }
        if (error.code === "auth/invalid-email") {
            return "メールアドレスの形式が正しくありません。";
        }
        if (error.code === "auth/weak-password") {
            return "パスワードは6文字以上にしてください。";
        }
        return "登録に失敗しました。もう一度お試しください。";
    };

    // ユーザー登録処理
    const handleRegister = async () => {
        if (!username.trim() || !email.trim() || !password.trim()) {
            Alert.alert("エラー", "全ての項目を入力してください。");
            return;
        }
        if (password.length < 6) {
            Alert.alert("エラー", "パスワードは6文字以上にしてください。");
            return;
        }

        setLoading(true);
        try {
            // Firebase Authentication でユーザー作成
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            navigation.reset({
                index: 0,
                routes: [{ name: "映画" }],
            });

            Alert.alert("成功", "登録が完了しました！");

            // Firestore にユーザー情報を保存
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email,
                username: username,
                timestamp: serverTimestamp(),
            });

        } catch (error) {
            console.error("登録エラー:", error);
            Alert.alert("エラー", getFirebaseErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
            <Text style={{ fontSize: 20, marginBottom: 20 }}>新規登録</Text>
            <TextInput
                placeholder="ユーザー名"
                value={username}
                onChangeText={setUsername}
                style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <TextInput
                placeholder="メールアドレス"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <TextInput
                placeholder="パスワード (6文字以上)"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <Button title="登録" onPress={handleRegister} disabled={loading} />
                    <Button title="ログイン" onPress={() => navigation.replace("Login")} color="gray" disabled={loading} />
                </>
            )}
        </View>
    );
}

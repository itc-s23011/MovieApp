import React, { useEffect, useState } from "react";
import { View, Button, Text, TextInput, Alert, ActivityIndicator } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);

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
        if (!email.trim() || !password.trim()) {
            Alert.alert("エラー", "メールアドレスとパスワードを入力してください。");
            return;
        }
        if (password.length < 6) {
            Alert.alert("エラー", "パスワードは6文字以上にしてください。");
            return;
        }

        setLoading(true);
        try {
            await signInWithEmailAndPassword(auth, email, password);
            navigation.replace("MovieList");
        } catch (error) {
            let errorMessage = "ログインに失敗しました。";
            if (error.code === "auth/user-not-found") {
                errorMessage = "ユーザーが見つかりません。新規登録をしてください。";
            } else if (error.code === "auth/wrong-password") {
                errorMessage = "パスワードが間違っています。";
            } else if (error.code === "auth/invalid-email") {
                errorMessage = "無効なメールアドレスです。";
            }
            Alert.alert("ログイン失敗", errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={{ flex: 1, padding: 20 }}>
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
                    placeholder="パスワード (6文字以上)"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
                />

                {loading ? (
                    <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
                ) : (
                    <Button title="ログイン" onPress={handleLogin} disabled={loading} />
                )}
            </View>

            <View style={{ marginBottom: 60, alignItems: "center" }}>
                <Button
                    title="新規登録"
                    onPress={() => navigation.navigate("Register")}
                    disabled={loading}
                />
            </View>
        </View>
    );
}

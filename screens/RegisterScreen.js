import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system"; // 追加
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../firebaseConfig";  // Firebase Firestore のみ利用

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("エラー", "写真のアクセス許可が必要です。");
            }
        })();
    }, []);

    // 画像を選択してデバイスに保存
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            const localUri = result.assets[0].uri;
            const fileName = localUri.split('/').pop();
            const newPath = `${FileSystem.documentDirectory}${fileName}`;

            try {
                await FileSystem.moveAsync({
                    from: localUri,
                    to: newPath,
                });
                setImage(newPath);  // ローカルパスを保存
            } catch (error) {
                console.error("画像の保存に失敗:", error);
                Alert.alert("エラー", "画像の保存に失敗しました。");
            }
        }
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
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Firebase Auth のユーザープロフィールを更新（Firebase Storage は使用しない）
            await updateProfile(user, {
                displayName: username, // ユーザー名を保存
            });

            // Firestore にユーザー情報を保存
            await setDoc(doc(db, "users", user.uid), {
                userName: username,
                email: user.email,
                localPhotoPath: image,  // ローカル保存した画像のパス
                createdAt: new Date()
            });

            Alert.alert("成功", "登録が完了しました！");

            // ナビゲーションを `MainDrawer` にリセット（「映画」画面へ遷移）
            navigation.reset({
                index: 0,
                routes: [{ name: "映画" }],
            });
        } catch (error) {
            console.error(error);
            Alert.alert("エラー", error.message);
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
            <Button title="画像を選択" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />}

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <Button title="登録" onPress={handleRegister} />
                    <Button
                        title="ログイン"
                        onPress={() => navigation.replace("Login")}
                        color="gray"
                    />
                </>
            )}
        </View>
    );
}

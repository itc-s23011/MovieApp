import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Alert } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../firebaseConfig";

export default function RegisterScreen({ navigation }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [image, setImage] = useState(null);

    useEffect(() => {
        (async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== "granted") {
                Alert.alert("エラー", "写真のアクセス許可が必要です。");
            }
        })();
    }, []);

    // 画像を選択
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    // ユーザー登録処理
    const handleRegister = async () => {
        try {
            // Firebase Auth で新規登録
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 画像が選択されている場合、Firebase Storage にアップロード
            if (image) {
                const response = await fetch(image);
                const blob = await response.blob();
                const storageRef = ref(storage, `profilePictures/${user.uid}`);
                await uploadBytes(storageRef, blob);

                // 画像の URL を取得
                const imageUrl = await getDownloadURL(storageRef);

                // 画像 URL をユーザー情報に追加
                // ここで Firestore にユーザー情報を保存する処理を追加できます
                console.log("画像URL:", imageUrl);
            }

            Alert.alert("成功", "登録が完了しました！");
            navigation.navigate("Home"); // ホーム画面に遷移など

        } catch (error) {
            console.error(error);
            Alert.alert("エラー", error.message);
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
                placeholder="パスワード"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ width: 300, height: 40, borderWidth: 1, marginBottom: 10, paddingHorizontal: 10 }}
            />
            <Button title="画像を選択" onPress={pickImage} />
            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />}
            <Button title="登録" onPress={handleRegister} />
        </View>
    );
}

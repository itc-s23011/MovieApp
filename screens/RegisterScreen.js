import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, Image, Alert, ActivityIndicator } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage, db } from "../firebaseConfig";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

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
                // 変更: ユーザーに設定で許可するよう促す
                Alert.alert("エラー", "写真のアクセス許可が必要です。設定から許可してください。");
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

        // 変更: ユーザーが画像選択をキャンセルした場合にエラーにならないようにする
        if (!result.canceled && result.assets?.length > 0) {
            setImage(result.assets[0].uri);
        }
    };

    // Firebase Storage に画像をアップロード
    const uploadImage = async (uid) => {
        if (!image) return null;
        try {
            const response = await fetch(image);
            const blob = await response.blob();
            const storageRef = ref(storage, `profilePictures/${uid}`);
            await uploadBytes(storageRef, blob);
            return await getDownloadURL(storageRef);
        } catch (error) {
            console.error("画像アップロードエラー:", error);
            return null; // 変更: 画像アップロードが失敗しても登録処理を継続する
        }
    };

    // Firebaseエラーメッセージを日本語化
    const getFirebaseErrorMessage = (error) => {
        // 変更: Firebaseのエラーメッセージを日本語に変換
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

            // プロフィール画像をアップロードし、URL を取得
            const imageUrl = await uploadImage(user.uid);

            // Firestore にユーザー情報を保存
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: email,
                username: username,
                profileImage: imageUrl || null, // 変更: 画像がない場合は null を保存
                timestamp: serverTimestamp(), // 変更: Firestoreのサーバータイムスタンプを使用
            });

            Alert.alert("成功", "登録が完了しました！");
            navigation.reset({
                index: 0,
                routes: [{ name: "映画" }],
            });

        } catch (error) {
            console.error("登録エラー:", error);
            Alert.alert("エラー", getFirebaseErrorMessage(error)); // 変更: エラーメッセージを日本語化
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
            <Button title="画像を選択" onPress={pickImage} disabled={loading} />
            {image && <Image source={{ uri: image }} style={{ width: 100, height: 100, marginTop: 10 }} />}

            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" style={{ marginTop: 20 }} />
            ) : (
                <>
                    <Button title="登録" onPress={handleRegister} disabled={loading} /> {/* 変更: ローディング中は無効化 */}
                    <Button title="ログイン" onPress={() => navigation.replace("Login")} color="gray" disabled={loading} /> {/* 変更: ローディング中は無効化 */}
                </>
            )}
        </View>
    );
}

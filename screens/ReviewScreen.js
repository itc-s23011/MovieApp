import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc, doc, onSnapshot } from "firebase/firestore";

export default function ReviewScreen({ route, navigation }) {
    const { movieId } = route.params;
    const [rating, setRating] = useState(0);
    const [reviewText, setReviewText] = useState("");
    const [username, setUsername] = useState(""); // ✅ 変数名統一

    // ⭐ Firestore からログインユーザーの情報を取得
    useEffect(() => {
        if (auth.currentUser) {
            const uid = auth.currentUser.uid;
            const userDocRef = doc(db, "users", uid);

            const unsubscribe = onSnapshot(userDocRef, (docSnapshot) => {
                if (docSnapshot.exists()) {
                    setUsername(docSnapshot.data().username);
                    console.log("取得したユーザー名:", docSnapshot.data().username);
                }
            });
             console.log('erro')
             console.log(auth.currentUser.uid);
            return () => unsubscribe(); // クリーンアップ関数
        }
    }, []);

    // ⭐ Firestore にレビューを投稿
    const submitReview = async () => {
        if (!rating || reviewText.trim() === "") {
            alert("評価とレビューを入力してください。");
            return;
        }

        if (!auth.currentUser) {
            alert("ログインしてください。");
            return;
        }

        try {
            await addDoc(collection(db, "reviews"), {
                userId: auth.currentUser.uid, // ✅ 修正：ログイン中のユーザーIDを使用
                username: username, // ✅ Firestore に保存するユーザー名
                movieId: movieId,
                rating: rating,
                reviewText: reviewText,
                timestamp: new Date(),
            });

            alert("レビューが投稿されました！");
            navigation.goBack(); // ✅ 投稿後に前の画面に戻る
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>レビューを書く</Text>

            {/* ⭐ 星評価 UI */}
            <View style={styles.starContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity key={star} onPress={() => setRating(star)}>
                        <FontAwesome
                            name={star <= rating ? "star" : "star-o"}
                            size={32}
                            color={star <= rating ? "gold" : "gray"}
                        />
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.textInput}
                placeholder="映画の感想を入力..."
                placeholderTextColor="#ccc"
                multiline
                value={reviewText}
                onChangeText={setReviewText}
            />

            {/* ✅ 投稿ボタン */}
            <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
                <Text style={styles.buttonText}>投稿する</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#202328",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 10,
    },
    starContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    textInput: {
        height: 100,
        borderColor: "#ccc",
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#444",
        color: "#fff",
        padding: 10,
        marginBottom: 10,
    },
    submitButton: {
        backgroundColor: "#ffcc00",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#202328",
    },
});

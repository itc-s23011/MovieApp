import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import {
  collection,
  addDoc,
  doc,
  deleteDoc,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";

export default function ReviewScreen({ route, navigation }) {
  const { movieId, mode } = route.params;
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [username, setUsername] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // Firestore からログインユーザーの情報を取得
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
      return () => unsubscribe();
    }
  }, []);

  // mode が "view" の場合のみ、Firestore からレビューをリアルタイム取得
  useEffect(() => {
    if (mode === "view") {
      const reviewsQuery = query(
        collection(db, "reviews"),
        where("movieId", "==", movieId),
        orderBy("timestamp", "desc")
      );
      const unsubscribe = onSnapshot(reviewsQuery, (querySnapshot) => {
        const reviewsList = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsList);
        setLoading(false);
      });
      return () => unsubscribe();
    }
  }, [mode]);

  // Firestore にレビューを投稿する関数
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
        userId: auth.currentUser.uid,
        username: username,
        movieId: movieId,
        rating: rating,
        reviewText: reviewText,
        timestamp: new Date(),
      });
      alert("レビューが投稿されました！");
      navigation.goBack();
    } catch (error) {
      console.error("Error submitting review:", error);
    }
  };

  // レビュー削除の関数
  const deleteReview = async (reviewId) => {
    Alert.alert(
      "レビュー削除",
      "本当にこのレビューを削除しますか？",
      [
        {
          text: "キャンセル",
          style: "cancel",
        },
        {
          text: "削除する",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDoc(doc(db, "reviews", reviewId));
              Alert.alert("レビューが削除されました。");
            } catch (error) {
              console.error("Error deleting review:", error);
              Alert.alert("削除に失敗しました。");
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (mode === "write") {
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
        <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
          <Text style={styles.buttonText}>投稿する</Text>
        </TouchableOpacity>
      </View>
    );
  } else if (mode === "view") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>レビュー一覧</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#ffcc00" />
        ) : reviews.length > 0 ? (
          <FlatList
            data={reviews}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.reviewItem}>
                <View style={styles.reviewHeader}>
                  <Text style={styles.reviewUser}>{item.username}</Text>
                  {/* ログイン中のユーザーが投稿したレビューの場合にのみ削除ボタンを表示 */}
                  {auth.currentUser &&
                    auth.currentUser.uid === item.userId && (
                      <TouchableOpacity onPress={() => deleteReview(item.id)}>
                        <FontAwesome name="trash" size={20} color="red" />
                      </TouchableOpacity>
                    )}
                </View>
                <View style={styles.starContainer}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <FontAwesome
                      key={star}
                      name={star <= item.rating ? "star" : "star-o"}
                      size={20}
                      color={star <= item.rating ? "gold" : "gray"}
                    />
                  ))}
                </View>
                <Text style={styles.reviewText}>{item.reviewText}</Text>
              </View>
            )}
          />
        ) : (
          <Text style={styles.noReviewsText}>まだレビューがありません。</Text>
        )}
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text>Invalid mode</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#202328", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", color: "#fff", marginBottom: 10 },
  starContainer: { flexDirection: "row", marginVertical: 10 },
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
  buttonText: { fontSize: 18, fontWeight: "bold", color: "#202328" },
  reviewItem: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  reviewHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  reviewUser: { fontSize: 16, fontWeight: "bold", color: "#ffcc00" },
  reviewText: { fontSize: 16, color: "#fff", marginTop: 5 },
  noReviewsText: { fontSize: 18, color: "#ccc", textAlign: "center", marginTop: 20 },
});

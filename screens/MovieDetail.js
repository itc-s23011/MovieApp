import React, { useState } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Poster from "../components/Poster";
import Vote from "../components/Vote";
import WatchProviders from "../components/WatchProviders";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

export default function MovieDetail({ route, navigation }) {
  const { movie } = route.params;
  const [favoriteAdded, setFavoriteAdded] = useState(false);

  // ハートボタンを押したらお気に入りに登録する処理
  const handleFavorite = async () => {
    if (!auth.currentUser) {
      Alert.alert("お気に入り登録", "お気に入り登録するにはログインが必要です。");
      return;
    }
    try {
      await addDoc(collection(db, "favorites"), {
        userId: auth.currentUser.uid,
        movieId: movie.id,
        title: movie.title,
        poster_path: movie.poster_path,
        addedAt: new Date(),
      });
      setFavoriteAdded(true);
      Alert.alert("お気に入り", "この映画がお気に入りに追加されました！");
    } catch (error) {
      console.error("Error adding favorite:", error);
      Alert.alert("エラー", "お気に入り登録に失敗しました。");
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Poster posterPath={movie.poster_path} imageWidth={780} imageHeight={480} />
      <View style={styles.textBox}>
        <Text style={styles.title}>{movie.title}</Text>
        <Vote vote_average={movie.vote_average} vote_count={movie.vote_count} />
        <Text style={styles.movieReleaseDate}>{movie.release_date}</Text>
        <Text style={styles.overview}>{movie.overview}</Text>

        {/* 視聴リンク情報 */}
        <WatchProviders movieId={movie.id} />

        {/* ここからお気に入り登録ボタン */}
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
          <FontAwesome name={favoriteAdded ? "heart" : "heart-o"} size={32} color="red" />
        </TouchableOpacity>

        {/* 既存のレビュー関連ボタン */}
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.navigate("ReviewScreen", { movieId: movie.id, mode: "write" })}
        >
          <Text style={styles.reviewButtonText}>レビューを書く</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.navigate("ReviewScreen", { movieId: movie.id, mode: "view" })}
        >
          <Text style={styles.reviewButtonText}>レビューを見る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#202328" },
  textBox: { paddingHorizontal: 30, paddingVertical: 5 },
  title: { color: "#fff", fontSize: 26, fontWeight: "bold" },
  movieReleaseDate: { color: "#ccc", marginBottom: 10 },
  overview: { color: "#fff", fontSize: 18 },
  favoriteButton: { marginTop: 15, alignItems: "center" },
  reviewButton: {
    marginTop: 15,
    paddingVertical: 10,
    backgroundColor: "#ffcc00",
    alignItems: "center",
    borderRadius: 5,
  },
  reviewButtonText: { color: "#202328", fontSize: 18, fontWeight: "bold" },
});

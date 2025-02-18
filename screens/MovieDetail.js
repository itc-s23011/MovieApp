import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from "react-native";
import Poster from "../components/Poster";
import Vote from "../components/Vote";
import WatchProviders from "../components/WatchProviders";
import { FontAwesome } from "@expo/vector-icons";
import { auth, db } from "../firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import axios from "axios";
import { requests } from "../request";

// ✅ DeepL API を使った翻訳関数
const translateText = async (text) => {
  if (!text || text.trim() === "") return text;

  const API_KEY = "d8c17c36-34f4-4922-9f38-ca863c7ba582:fx"; // 🔹 DeepL APIキーを取得して設定
  const url = "https://api-free.deepl.com/v2/translate";

  try {
    const response = await axios.post(
      url,
      new URLSearchParams({
        auth_key: API_KEY,
        text: text,
        target_lang: "JA", // 🔹 日本語に翻訳
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    return response.data.translations[0].text || text;
  } catch (error) {
    console.error("DeepL 翻訳エラー:", error.message);
    return text; // ✅ 翻訳エラー時は元の英語をそのまま表示
  }
};

export default function MovieDetail({ route, navigation }) {
  const { movie } = route.params;
  const [movieDetails, setMovieDetails] = useState(movie);
  const [loading, setLoading] = useState(false);
  const [favoriteAdded, setFavoriteAdded] = useState(false);

  useEffect(() => {
    async function fetchMovieDetails() {
      if (!movie || !movie.title || !movie.overview) {
        setLoading(true);
        try {
          const responseJa = await axios.get(requests.MOVIE_DETAILS(movie.id, "ja"));
          let movieData = responseJa.data;

          if (!movieData.title || !movieData.overview) {
            const responseEn = await axios.get(requests.MOVIE_DETAILS(movie.id, "en"));
            let movieDataEn = responseEn.data;

            movieData = {
              ...movieDataEn,
              title: movieData.title || movieDataEn.title,
              overview: movieData.overview || movieDataEn.overview,
            };

            // ✅ `overview` が英語なら日本語に翻訳
            if (movieData.original_language === "en" && movieData.overview) {
              const translatedOverview = await translateText(movieData.overview);
              movieData.overview = translatedOverview;
            }
          }

          setMovieDetails(movieData);
        } catch (error) {
          console.error("映画詳細の取得エラー:", error);
          Alert.alert("エラー", "映画の詳細が取得できませんでした。");
        } finally {
          setLoading(false);
        }
      }
    }

    fetchMovieDetails();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  if (!movieDetails) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>映画の詳細情報が取得できませんでした。</Text>
      </View>
    );
  }

  const displayTitle = movieDetails.title || "タイトル不明";
  const displayOverview = movieDetails.overview || "概要情報がありません。";
  const displayReleaseDate = movieDetails.release_date || "公開日不明";

  const handleFavorite = async () => {
    if (!auth.currentUser) {
      Alert.alert("お気に入り登録", "お気に入り登録するにはログインが必要です。");
      return;
    }
    try {
      await addDoc(collection(db, "favorites"), {
        userId: auth.currentUser.uid,
        movieId: movieDetails.id,
        title: displayTitle,
        poster_path: movieDetails.poster_path,
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
      <Poster posterPath={movieDetails.poster_path} imageWidth={780} imageHeight={480} />
      <View style={styles.textBox}>
        <Text style={styles.title}>{displayTitle}</Text>
        <Vote vote_average={movieDetails.vote_average || 0} vote_count={movieDetails.vote_count || 0} />
        <Text style={styles.movieReleaseDate}>{displayReleaseDate}</Text>
        <Text style={styles.overview}>{displayOverview}</Text>

        {/* 視聴リンク情報 */}
        <WatchProviders movieId={movieDetails.id} />

        {/* お気に入り登録ボタン */}
        <TouchableOpacity style={styles.favoriteButton} onPress={handleFavorite}>
          <FontAwesome name={favoriteAdded ? "heart" : "heart-o"} size={32} color="red" />
        </TouchableOpacity>

        {/* ✅ 追加: レビューを書くボタン */}
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.navigate("ReviewScreen", { movieId: movieDetails.id, mode: "write" })}
        >
          <Text style={styles.reviewButtonText}>レビューを書く</Text>
        </TouchableOpacity>

        {/* ✅ 追加: レビューを見るボタン */}
        <TouchableOpacity
          style={styles.reviewButton}
          onPress={() => navigation.navigate("ReviewScreen", { movieId: movieDetails.id, mode: "view" })}
        >
          <Text style={styles.reviewButtonText}>レビューを見る</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#202328" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#202328" },
  errorText: { color: "white", fontSize: 20, textAlign: "center", marginTop: 20 },
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

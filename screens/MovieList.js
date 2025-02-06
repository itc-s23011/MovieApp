import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Button, ActivityIndicator } from 'react-native';
import { requests } from '../request';
import axios from 'axios';
import { useState, useEffect } from 'react';
import MovieFlatList from '../components/MovieFlatList';
import { auth } from '../firebaseConfig';
import { getAuth, signOut, onAuthStateChanged } from 'firebase/auth';

export default function MovieList({ navigation }) {
  const [picupMovies, setPicupMovies] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 認証状態を監視し、未ログインなら Login 画面へ遷移
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        navigation.replace("Login");
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    async function getPickUpMovie() {
      try {
        const result = await axios.get(requests.NOW_PLAYING);
        const number = Math.floor(Math.random() * (result.data.results.length - 1) + 1);
        setPicupMovies(result.data.results[number]);
      } catch (error) {
        console.log(error);
      }
    }

    getPickUpMovie();
  }, []);

  // ログアウト処理
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.replace("Login"); // ログアウト後にログイン画面へ
    } catch (error) {
      console.error("ログアウトエラー:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#fff" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("MovieDetail", { movie: picupMovies })}>
        <View style={styles.pickupContainer}>
          <Image style={styles.pickupImage} source={{ uri: `https://image.tmdb.org/t/p/w780${picupMovies.poster_path}` }} />
          <Text style={styles.pickupTitle}>{picupMovies.title}</Text>
        </View>
      </TouchableOpacity>

      <MovieFlatList url={requests.NOW_PLAYING} listName={'公開中の映画'} navigation={navigation} />
      <MovieFlatList url={requests.COMMING_SOON} listName={'公開予定の映画'} navigation={navigation} />
      <MovieFlatList url={requests.POPULARS} listName={'人気の映画'} navigation={navigation} />
      <MovieFlatList url={requests.TOP_RATED} listName={'高評価の映画'} navigation={navigation} />

      {/* ログアウトボタン */}
      <View style={styles.logoutContainer}>
        <Button title="ログアウト" onPress={handleLogout} color="#ff4444" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202328',
  },
  pickupContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pickupImage: {
    height: 350,
    width: '45%',
    resizeMode: 'contain',
  },
  pickupTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    width: '45%',
    marginLeft: 5,
  },
  listName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  movieContainer: {
    width: 130,
    marginBottom: 30,
  },
  movieImage: {
    height: 200,
    marginRight: 10,
    resizeMode: 'contain',
  },
  movieTitle: {
    color: '#ccc',
    fontSize: 14,
  },
  logoutContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#202328",
  },
});

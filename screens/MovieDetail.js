import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Poster from "../components/Poster";
import Vote from "../components/Vote";
import { FontAwesome } from "@expo/vector-icons";
import { db } from "../firebaseConfig";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

export default function MovieDetail(props) {
    const { movie } = props.route.params;
    const [rating, setRating] = useState(0);
    const [averageRating, setAverageRating] = useState(0);


    // ⭐ Firestore にデータを送信
    const submitRating = async (selectedRating) => {
        setRating(selectedRating);
        try {
            await addDoc(collection(db, "reviews"), {
                userId: "user123", // ユーザーID（後で認証を導入）
                movieId: movie.id,
                rating: selectedRating,
                timestamp: new Date(),
            });
        } catch (error) {
            console.error("Error submitting rating:", error);
        }
    };

    // ⭐ Firestore から映画の平均評価を取得
    // const fetchAverageRating = async () => {
    //     try {
    //         const reviewsQuery = query(collection(db, "reviews"), where("movieId", "==", movie.id));
    //         const querySnapshot = await getDocs(reviewsQuery);
    //         const ratings = querySnapshot.docs.map(doc => doc.data().rating);
    //         const avgRating = ratings.length ? (ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1) : "0";
    //         setAverageRating(avgRating);
    //     } catch (error) {
    //         console.error("Error fetching rating:", error);
    //     }
    // };

    return (
        <ScrollView style={styles.container}>
            {/* ポスター表示 */}
            <Poster posterPath={movie.poster_path} imageWidth={780} imageHeight={480} />
            <View style={styles.textBox}>
                <Text style={styles.title}>{movie.title}</Text>
                <Vote vote_average={movie.vote_average} vote_count={movie.vote_count} />
                <Text style={styles.movieReleaseDate}>{movie.release_date}</Text>
                <Text style={styles.overview}>{movie.overview}</Text>

                {/* ⭐ 星評価 UI ⭐ */}
                <View style={styles.starContainer}>
                    {[1, 2, 3, 4, 5].map((star) => (
                        <TouchableOpacity key={star} onPress={() => submitRating(star)}>
                            <FontAwesome
                                name={star <= rating ? "star" : "star-o"}
                                size={32}
                                color={star <= rating ? "gold" : "gray"}
                            />
                        </TouchableOpacity>
                    ))}
                </View>
                <Text style={styles.ratingText}>あなたの評価: {rating}</Text>
                <Text style={styles.ratingText}>平均評価: {averageRating}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#202328",
    },
    textBox: {
        paddingHorizontal: 30,
        paddingVertical: 5,
    },
    title: {
        color: "#fff",
        fontSize: 26,
        fontWeight: "bold",
    },
    movieReleaseDate: {
        color: "#ccc",
        marginBottom: 10,
    },
    overview: {
        color: "#fff",
        fontSize: 18,
    },
    starContainer: {
        flexDirection: "row",
        marginVertical: 10,
    },
    ratingText: {
        color: "#fff",
        fontSize: 18,
        marginTop: 5,
    },
});

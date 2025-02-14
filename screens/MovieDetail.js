import React from "react";
import { Text, View, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Poster from "../components/Poster";
import Vote from "../components/Vote";

export default function MovieDetail({ route, navigation }) {
    const { movie } = route.params;

    return (
        <ScrollView style={styles.container}>
            {/* ポスター表示 */}
            <Poster posterPath={movie.poster_path} imageWidth={780} imageHeight={480} />
            <View style={styles.textBox}>
                <Text style={styles.title}>{movie.title}</Text>
                <Vote vote_average={movie.vote_average} vote_count={movie.vote_count} />
                <Text style={styles.movieReleaseDate}>{movie.release_date}</Text>
                <Text style={styles.overview}>{movie.overview}</Text>

                {/* ⭐ レビューを書くボタン → ReviewScreen へ遷移 */}
                <TouchableOpacity
                    style={styles.reviewButton}
                    onPress={() => navigation.navigate("ReviewScreen", { movieId: movie.id })}
                >
                    <Text style={styles.reviewButtonText}>レビューを書く</Text>
                </TouchableOpacity>
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
    reviewButton: {
        marginTop: 15,
        paddingVertical: 10,
        backgroundColor: "#ffcc00",
        alignItems: "center",
        borderRadius: 5,
    },
    reviewButtonText: {
        color: "#202328",
        fontSize: 18,
        fontWeight: "bold",
    },
});

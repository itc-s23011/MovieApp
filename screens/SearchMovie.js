import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { requests } from '../request';
import axios from 'axios';
import Poster from "../components/Poster";
import Vote from "../components/Vote";

// ✅ DeepL API を使った翻訳関数
const translateText = async (text) => {
    if (!text || text.trim() === "") return text;

    const API_KEY = "d8c17c36-34f4-4922-9f38-ca863c7ba582:fx"; // 🔹 DeepL APIキーを設定
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

export default function SearchMovie({ navigation }) {
    const [text, onChangeText] = useState("");
    const [movies, setSearchMovies] = useState([]); // ✅ 初期値を `[]` に変更
    const numColumns = 3;

    async function searchMovies() {
        try {
            const results = await axios.get(requests.SEARCH + text);

            if (results.data.results.length === 0) {
                alert("検索結果がありません。");
                setSearchMovies([]);
                return;
            }

            // ✅ `overview` を日本語に翻訳する
            const moviesWithTranslation = await Promise.all(
                results.data.results.map(async (movie) => {
                    if (movie.original_language === "en" && movie.overview) {
                        movie.overview = await translateText(movie.overview);
                    }
                    return movie;
                })
            );

            setSearchMovies(moviesWithTranslation);
        } catch (error) {
            console.log("検索エラー:", error);
            alert("映画の検索中にエラーが発生しました。");
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.searchForm}>
                <Ionicons name="search" size={30} color="#ccc" />
                <TextInput
                    style={styles.input}
                    onChangeText={onChangeText}
                    value={text}
                    placeholder='映画名'
                    placeholderTextColor={'#ccc'}
                    keyboardAppearance='dark'
                    borderBottomWidth='1'
                    autoFocus={true}
                    onSubmitEditing={searchMovies}
                />
            </View>
            <FlatList
                data={movies}
                keyExtractor={(item) => item.id?.toString()}
                numColumns={numColumns}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => navigation.navigate("MovieDetail", { movie: item })}>
                        <View style={styles.movieContainer}>
                            <Poster posterPath={item.poster_path} imageWidth={300} imageHeight={180} />
                            <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
                            <Vote vote_average={item.vote_average ?? 0} vote_count={item.vote_count ?? 0} />
                            <Text style={styles.movieReleaseDate}>{item.release_date ?? "日付不明"}</Text>
                        </View>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202328',
        alignItems: 'center'
    },
    searchForm: {
        flexDirection: 'row',
        marginTop: 10
    },
    input: {
        width: '45%',
        height: 30,
        fontSize: 18,
        color: '#ccc',
        marginLeft: 5,
        padding: 5,
        borderColor: 'gray'
    },
    movieContainer: {
        width: 110,
        marginHorizontal: 5
    },
    movieTitle: {
        color: '#ccc',
        fontSize: 14
    },
    movieReleaseDate: {
        color: '#ccc',
        marginBottom: 10
    }
});

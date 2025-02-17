import { StyleSheet, View, TextInput, FlatList, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { requests } from '../request';
import axios from 'axios';
import Poster from "../components/Poster";
import Vote from "../components/Vote";

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

            setSearchMovies(results.data.results);
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

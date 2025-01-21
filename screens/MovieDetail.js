import { Text, View, ScrollView, StyleSheet } from "react-native";
import Poster from "../components/Poster";
import Vote from "../components/Vote";

export default function MovieDetail(props) {
    const { movie } = props.route.params;
    return (
        <ScrollView style={styles.container} >
            <Poster posterPath={movie.poster_path} imageWidth={780} imageHeight={480}></Poster>
            <View>
                <Text style={styles.title}>{movie.title}</Text>
                <Vote vote_average={movie.vote_average/2} vote_count={movie.vote_count}></Vote>
                <Text style={styles.movieReleaseDate}>{movie.release_date}</Text>
                <Text style={styles.overview}>{movie.overview}</Text>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#202328'
    },
    textBox: {
        paddingHorizontal:30,
        paddingVertical: 5
    },
    title: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold'
    },
    movieReleaseDate: {
        color: '#ccc',
        marginBottom: 10
    },
    overview: {
        color: '#fff',
        fontSize: 18

    }

})

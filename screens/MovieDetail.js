import { Text, View, ScrollView, StyleSheet, Image } from "react-native";
import Star from "react-native-stars";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function MovieDetail(props) {
    const { movie } = props.route.params;
    return (
        <ScrollView style={styles.container} >
            <Image style={styles.movieImage} source={{uri: `https://image.tmdb.org/t/p/w780${movie.poster_path}`}}></Image>
            <View>
                <Text style={styles.title}>{movie.title}</Text>
                <View style={styles.vote}>
                    <Star
                        default={(movie.vote_average/2)}
                        count={5}
                        half={true}
                        fullStar={<Ionicons name="star-sharp" style={styles.star}></Ionicons>}
                        emptyStar={<Ionicons name="star-outline" style={styles.star}></Ionicons>}
                        halfStar={<Ionicons name="star-half-sharp" style={styles.star}></Ionicons>}
                        >
                    </Star>
                <Text style={styles.voteCount}>{movie.vote_count}</Text>
                </View>
                
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
    },
    movieImage: {
        height: 480,
        resizeMode: 'contain'
    },
    vote: {
        flexDirection: 'row',
        marginTop: 10,
        alignItems: 'center'
    },
    voteCount: {
        color: '#ccc',
        marginLeft: 3
    },
    star: {
        color: 'yellow',
        backgroundColor: 'transparent',
        textShadowColor: 'black',
        textShadowOffset: {width: 1, height: 1},
        textShadowRadius: 2,
    }
})

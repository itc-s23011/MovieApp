import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Poster from './Poster';

export default function MovieFlatList(props) {
    const url = props.url;
    const listName = props.listName;
    const navigation = props.navigation;

    const [movies, setMovies] = useState({});

  useEffect(() => {
    async function getMovies() {
      try {
        const results = await axios.get(url);
        setMovies(results.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    getMovies();
  }, []);
  return (
    <View>
      <Text style={styles.listName}>{listName}</Text>

      <FlatList
        data={movies}
        keyExtractor={item => item.id}
        horizontal={true}
        flashScrollIndicators
        renderItem={({ item }) => (
        <TouchableOpacity onPress={() => navigation.navigate("MovieDetail", {movie: item})}>
            <View style={styles.movieContainer}>
                <Poster posterPath={item.poster_path} imageWidth={300} imageHeight={200}></Poster>
            <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
            </View>
        </TouchableOpacity>
        )}>
      </FlatList>

    </View>
  );
}

const styles = StyleSheet.create({
  listName: {
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  movieContainer: {
    width: 130,
    marginBottom:30
  },
  movieTitle: {
    color: '#ccc', 
    fontSize: 14
  }
});
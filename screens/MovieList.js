import { StyleSheet, Text, View, ScrollView, FlatList, Image, TouchableOpacity } from 'react-native';
import { requests } from '../request';
import axios from 'axios';
import { useState, useEffect } from 'react';
import MovieFlatList from '../components/MovieFlatList';

export default function MovieList({ navigation }) {

  const [picupMovies, setPicupMovies] = useState({});

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
  return (
    <ScrollView style={styles.container}>
    <TouchableOpacity onPress={() => navigation.navigate("MovieDetail", {movie: picupMovies})}>
      <View style={styles.pickupContainer}>
        <Image style={styles.pickupImage} source={{uri: `https://image.tmdb.org/t/p/w780${picupMovies.poster_path}`}}></Image>
        <Text style={styles.pickupTitle}>{picupMovies.title}</Text>
      </View>
    </TouchableOpacity>
      <MovieFlatList url={requests.NOW_PLAYING} listName={'公開中の映画'} navigation={navigation}></MovieFlatList>
      <MovieFlatList url={requests.COMMING_SOON} listName={'公開予定の映画'} navigation={navigation}></MovieFlatList>
      <MovieFlatList url={requests.POPULARS} listName={'人気の映画'} navigation={navigation}></MovieFlatList>
      <MovieFlatList url={requests.TOP_RATED} listName={'高評価の映画'} navigation={navigation}></MovieFlatList>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202328'
  },
  pickupContainer: {
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center'
  },
  pickupImage: {
    height: 350, 
    width: '45%',
    resizeMode: 'contain'
  },
  pickupTitle: {
    color: '#fff', 
    fontSize: 24, 
    fontWeight: 'bold', 
    width: '45%', 
    marginLeft: 5
  },
  listName: {
    color: '#fff', 
    fontSize: 18, 
    fontWeight: 'bold',
  },
  movieContainer: {
    width: 130,
    marginBottom:30
  },
  movieImage: {
    height: 200,
    marginRight: 10,
    resizeMode: 'contain'
  },
  movieTitle: {
    color: '#ccc', 
    fontSize: 14
  }
});
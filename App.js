import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, FlatList, Image } from 'react-native';
import { requests } from './request';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function App() {
  const [nowPlaying, setNowPlaying] = useState({});
  const [commingSoon, setCommingSoon] = useState({});
  const [populars, setPopulars] = useState({});
  const [topRated, setTopRated] = useState({});
  const [picupMovies, setPicupMovies] = useState({});

  useEffect(() => {
    async function getMovies() {
      try {
        const nowPlayingMovies = await axios.get(requests.NOW_PLAYING);
        setNowPlaying(nowPlayingMovies.data.results);

        const commingSoonMovies = await axios.get(requests.COMMING_SOON);
        setCommingSoon(commingSoonMovies.data.results);

        const popularsMovies = await axios.get(requests.POPULARS);
        setPopulars(popularsMovies.data.results);

        const topRatedMovies = await axios.get(requests.TOP_RATED);
        setTopRated(topRatedMovies.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    async function getPickUpMovie() {
      try {
        const result = await axios.get(requests.NOW_PLAYING);
        const number = Math.floor(Math.random() * (result.data.results.length - 1) + 1);
        setPicupMovies(result.data.results[number]);
      } catch (error) {
        console.log(error);
      }
    }
    getMovies();
    getPickUpMovie();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickupContainer}>
        <Image style={styles.pickupImage} source={{uri: `https://image.tmdb.org/t/p/w780${picupMovies.poster_path}`}}></Image>
        <Text style={styles.pickupTitle}>{picupMovies.title}</Text>
      </View>

      <Text style={styles.listName}>公開中の映画</Text>


      <FlatList
        data={nowPlaying}
        keyExtractor={item => item.id}
        horizontal={true}
        flashScrollIndicators
        renderItem={({ item }) => (
        <View style={styles.movieContainer}>
          <Image style={styles.movieImage} source={{uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`}}></Image>
          <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
        </View>
        )}>
      </FlatList>
      <Text style={styles.listName}>公開予定の映画</Text>


      <FlatList
        data={commingSoon}
        keyExtractor={item => item.id}
        horizontal={true}
        flashScrollIndicators
        renderItem={({ item }) => (
        <View style={styles.movieContainer}>
          <Image style={styles.movieImage} source={{uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`}}></Image>
          <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
        </View>
        )}>
      </FlatList>

      <Text style={styles.listName}>人気の映画</Text>

      <FlatList
        data={populars}
        keyExtractor={item => item.id}
        horizontal={true}
        flashScrollIndicators
        renderItem={({ item }) => (
        <View style={styles.movieContainer}>
          <Image style={styles.movieImage} source={{uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`}}></Image>
          <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
        </View>
        )}>
      </FlatList>

      <Text style={styles.listName}>高評価の映画</Text>

      <FlatList
        data={topRated}
        keyExtractor={item => item.id}
        horizontal={true}
        flashScrollIndicators
        renderItem={({ item }) => (
        <View style={styles.movieContainer}>
          <Image style={styles.movieImage} source={{uri: `https://image.tmdb.org/t/p/w300${item.poster_path}`}}></Image>
          <Text numberOfLines={1} style={styles.movieTitle}>{item.title}</Text>
        </View>
        )}>
      </FlatList>
      <StatusBar style="auto" />
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
    fontWeight: 'bold'
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
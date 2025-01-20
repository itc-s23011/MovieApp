import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, ScrollView, FlatList, Image } from 'react-native';
import { requests } from './request';
import axios from 'axios';
import { useState, useEffect } from 'react';

export default function App() {
  const [movies, setMovies] = useState({});

  useEffect(() => {
    async function getMovies() {
      try {
        const request = await axios.get(requests.NOW_PLAYING);
        setMovies(request.data.results);
        console.log(request.data.results);
      } catch (error) {
        console.log(error);
      }
    }
    getMovies();
  }, []);
 
  return (
    <ScrollView style={styles.container}>
      <View style={styles.pickupContainer}>
        <View style={styles.pickupImage}></View>
        <Text style={styles.pickupTitle}>映画のタイトル</Text>
      </View>

      <Text style={styles.listName}>公開中の映画</Text>


      <FlatList
        data={movies}
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


      {/* <View style={{backgroundColor: 'blue', width: '100%', flexDirection: 'row'}}>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
      </View> */}

      <Text style={styles.listName}>公開予定の映画</Text>

      <View style={{backgroundColor: 'blue', width: '100%', flexDirection: 'row'}}>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
      </View>

      <Text style={styles.listName}>人気の映画</Text>

      <View style={{backgroundColor: 'blue', width: '100%', flexDirection: 'row'}}>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
      </View>

      <Text style={styles.listName}>高評価の映画</Text>

      <View style={{backgroundColor: 'blue', width: '100%', flexDirection: 'row'}}>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
        <View>
          <View style={styles.movieImage}></View>
          <Text style={styles.movieTitle}>映画のタイトル</Text>
        </View>
      </View>
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
    backgroundColor: 'red',
    width: '100%', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center'
  },
  pickupImage: {
    backgroundColor: 'gray',
    height: 350, 
    width: '45%'
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
    marginBottom: 5
  },
  movieContainer: {
    width: 130
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
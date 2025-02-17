import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, StyleSheet, Image, Linking } from "react-native";

//a//
const TMDB_API_KEY = "551c2d4f95bbc4929d5ff3ebab76e620";
const BASE_URL = "https://api.themoviedb.org/3";

export default function WatchProviders({ movieId }) {
  const [providers, setProviders] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const response = await fetch(
          `${BASE_URL}/movie/${movieId}/watch/providers?api_key=${TMDB_API_KEY}`
        );
        const data = await response.json();
        if (data.results && data.results.JP) {
          setProviders(data.results.JP);
        } else {
          setProviders(null);
        }
      } catch (error) {
        console.error("Error fetching providers:", error);
        setProviders(null);
      }
      setLoading(false);
    };

    fetchProviders();
  }, [movieId]);

  if (loading) {
    return <ActivityIndicator size="small" color="#ffcc00" />;
  }

  if (!providers) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>この映画は現在、視聴リンク情報がありません。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>視聴リンク</Text>
      {/* ここでは、全体のリンクも表示 */}
      <TouchableOpacity style={styles.mainLinkButton} onPress={() => Linking.openURL(providers.link)}>
        <Text style={styles.mainLinkText}>すべてのプロバイダーを見る</Text>
      </TouchableOpacity>

      {/* 各プロバイダーの情報を一覧表示 */}
      {providers.flatrate && providers.flatrate.map((provider) => (
        <TouchableOpacity
          key={provider.provider_id}
          style={styles.providerButton}
          onPress={() => {
            // ここでは、provider.link を直接利用できる場合を想定
            Linking.openURL(providers.link);
          }}
        >
          {provider.logo_path ? (
            <Image
              source={{ uri: `https://image.tmdb.org/t/p/w92${provider.logo_path}` }}
              style={styles.logo}
            />
          ) : (
            <Text style={styles.providerName}>{provider.provider_name}</Text>
          )}
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 10, marginTop: 15 },
  header: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  mainLinkButton: {
    backgroundColor: "#ffcc00",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: "center"
  },
  mainLinkText: { color: "#202328", fontWeight: "bold" },
  providerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffcc00",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  providerName: { color: "#202328", fontWeight: "bold" },
  logo: { width: 50, height: 50, resizeMode: "contain" },
  noDataText: { color: "gray", fontSize: 16 },
});

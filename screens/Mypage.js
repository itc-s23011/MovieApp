import React, { useEffect, useState } from "react";
import {
    View, Text, Image, TouchableOpacity, FlatList, StyleSheet, Alert
} from "react-native";
import { useNavigation } from "@react-navigation/native"; // Navigation を取得
import { auth } from '../firebaseConfig';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const MypageScreen = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const navigation = useNavigation(); // useNavigation フックを使用
    const username = useState()


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    console.log(userDoc.data())
                    username = userDoc.data();
                } else {
                    Alert.alert("エラー", "ユーザー情報が見つかりませんでした。");
                    console.log("エラー", "ユーザー情報が見つかりませんでした")
                }
            }
        });

        return () => unsubscribe();
    }, []);


    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate("Login"); // 画面遷移
        } catch (error) {
            Alert.alert("ログアウトエラー", error.message);
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>ログインしていません</Text>
            </View>
        );
    }

    const workList = [
        { id: "1", title: "作品A" },
        { id: "2", title: "作品B" },
        { id: "3", title: "作品C" },
    ];


    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerText}>マイページ</Text>
            </View>

            <View style={styles.profileSection}>
                <View style={styles.userInfo}>
                    <Text style={styles.userName}>{username.username}</Text>

                    <Text style={styles.userEmail}>{user.email}</Text>
                </View>
                {userData?.localPhotoPath ? (
                    <Image source={{ uri: userData.localPhotoPath }} style={styles.profileImage} />
                ) : (
                    <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} />
                )}
            </View>

            <TouchableOpacity style={styles.editButton}>
                <Text style={styles.buttonText}>プロフィールを編集</Text>
            </TouchableOpacity>

            <Text style={styles.sectionTitle}>作品一覧</Text>
            <FlatList
                data={workList}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.workItem}>
                        <Text style={styles.workTitle}>{item.title}</Text>
                    </View>
                )}
            />

            {/* ログアウトボタン */}
            <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                <Text style={styles.buttonText}>ログアウト</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 20,
        justifyContent: "space-between" // ログアウトボタンを下に配置
    },
    header: {
        alignItems: "center",
        marginBottom: 20
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold"
    },
    profileSection: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 20
    },
    userInfo: {
        flex: 1
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginLeft: 20
    },
    userName: {
        fontSize: 20,
        fontWeight: "bold"
    },
    userEmail: {
        fontSize: 16,
        color: "gray"
    },
    editButton: {
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20
    },
    buttonText: {
        color: "white",
        fontSize: 16
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    workItem: {
        padding: 10,
        backgroundColor: "#fff",
        marginBottom: 10,
        borderRadius: 5
    },
    workTitle: {
        fontSize: 16
    },
    logoutButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20
    }
});

export default MypageScreen;
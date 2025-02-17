import React, { useEffect, useState } from "react";
import {
    View, Text, Image, TouchableOpacity, StyleSheet, Alert, Modal, TextInput
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { auth } from '../firebaseConfig';
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig";

const MypageScreen = () => {
    const [user, setUser] = useState(null);
    const [userData, setUserData] = useState(null);
    const [username, setUsername] = useState("");
    const [newUsername, setNewUsername] = useState(""); // 新しいユーザー名を保存する state
    const [modalVisible, setModalVisible] = useState(false); // モーダルの表示管理
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
            setUser(currentUser);
            if (currentUser) {
                const userDoc = await getDoc(doc(db, "users", currentUser.uid));
                if (userDoc.exists()) {
                    setUserData(userDoc.data());
                    setUsername(userDoc.data().username);
                } else {
                    Alert.alert("エラー", "ユーザー情報が見つかりませんでした。");
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = async () => {
        try {
            await auth.signOut();
            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("ログアウトエラー", error.message);
        }
    };

    // **ユーザー名を変更する処理**
    const handleUpdateUsername = async () => {
        if (!newUsername.trim()) {
            Alert.alert("エラー", "ユーザー名を入力してください。");
            return;
        }

        try {
            const userDocRef = doc(db, "users", user.uid);
            await updateDoc(userDocRef, { username: newUsername });

            // 状態を更新して即時反映
            setUsername(newUsername);
            setNewUsername("");
            setModalVisible(false);
            Alert.alert("成功", "ユーザー名が変更されました！");
        } catch (error) {
            Alert.alert("エラー", "ユーザー名の変更に失敗しました。");
        }
    };

    if (!user) {
        return (
            <View style={styles.container}>
                <Text style={styles.headerText}>ログインしていません</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <View style={styles.header}>
                    <Text style={styles.headerText}>マイページ</Text>
                </View>

                <View style={styles.profileSection}>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{username}</Text>
                        <Text style={styles.userEmail}>{user.email}</Text>
                    </View>
                    {userData?.localPhotoPath ? (
                        <Image source={{ uri: userData.localPhotoPath }} style={styles.profileImage} />
                    ) : (
                        <Image source={{ uri: "https://via.placeholder.com/100" }} style={styles.profileImage} />
                    )}
                </View>

                {/* プロフィール編集ボタン */}
                <TouchableOpacity style={styles.editButton} onPress={() => setModalVisible(true)}>
                    <Text style={styles.buttonText}>プロフィールを編集</Text>
                </TouchableOpacity>

                <Text style={styles.sectionTitle}>作品一覧</Text>
            </View>

            <View style={styles.logoutContainer}>
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Text style={styles.buttonText}>ログアウト</Text>
                </TouchableOpacity>
            </View>

            {/* ユーザー名変更モーダル */}
            <Modal
                visible={modalVisible}
                animationType="slide"
                transparent={true}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>ユーザー名を変更</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="新しいユーザー名"
                            value={newUsername}
                            onChangeText={setNewUsername}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.saveButton} onPress={handleUpdateUsername}>
                                <Text style={styles.buttonText}>保存</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>キャンセル</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f9f9f9",
        padding: 20,
    },
    content: {
        flex: 1,
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
        fontSize: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10
    },
    logoutContainer: {
        justifyContent: "flex-end",
    },
    logoutButton: {
        backgroundColor: "red",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginTop: 20
    },
    modalContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(0,0,0,0.5)",
    },
    modalContent: {
        width: 300,
        backgroundColor: "white",
        padding: 20,
        borderRadius: 10,
        alignItems: "center",
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 10,
    },
    input: {
        width: "100%",
        borderWidth: 1,
        borderColor: "gray",
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    },
    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
    },
    saveButton: {
        flex: 1,
        backgroundColor: "#007bff",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginRight: 5,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
        marginLeft: 5,
    }
});

export default MypageScreen;
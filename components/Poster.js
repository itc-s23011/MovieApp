import Ionicons from "@expo/vector-icons/Ionicons";
import { Image,View } from "react-native";

export default function Poster(props) {
    let posterPath = props.posterPath;
    const imageWidth = props.imageWidth;
    const imageHeight = props.imageHeight;

    if (posterPath === null) {
        return (
            <View style={{height: imageHeight, alignItems: 'center', justifyContent: 'center'}}>
                <Ionicons name="image-outline" size={24} color="#ccc" />
            </View>
        )
    } else {
        return (
            <Image style={{height: imageHeight, resizeMode: 'contain'}} source={{uri: `https://image.tmdb.org/t/p/w${imageWidth}${posterPath}`}}></Image>
        )
    }
}

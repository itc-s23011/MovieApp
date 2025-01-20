const BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = '551c2d4f95bbc4929d5ff3ebab76e620';
export const requests = {
    NOW_PLAYING : `${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=ja&page=1`
}
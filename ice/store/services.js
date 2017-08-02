import axios from 'axios'

const baseUrl=''

const apiUrl='http://rapapi.org/mockjsdata/23570'

class Services{
    getWechatSignature(url){
        return axios.get(`${baseUrl}/wechat-signature?url=${url}`)
    }
    getUserByOAuth(url){
        return axios.get(`${baseUrl}/wechat-oauth?url=${url}`)
    }
    fetchHouses(){
        return axios.get(`${apiUrl}/wiki/houses`)
    }
    fetchCities(){
        return axios.get(`${apiUrl}/wiki/cities`)
    }
    fetchCharacters(){
        return axios.get(`${apiUrl}/wiki/charcters`)
    }
}

export default new Services()
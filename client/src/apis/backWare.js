import axios from 'axios';
import config from '../config.json'

//const BASE_URL = 'http://localhost:3000/api/';
const BASE_URL_API = config.BASE_URL_API

export default axios.create({
    baseURL: BASE_URL_API+"api/",
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    }
})
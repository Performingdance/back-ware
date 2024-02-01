import axios from 'axios';


//const BASE_URL = 'http://localhost:3000/api/';
const BASE_URL = 'https://api.3gger.synology.me/api/';

export default axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    }
})
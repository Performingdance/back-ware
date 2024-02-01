import axios from 'axios';


//const BASE_URL = 'http://localhost:3000/api/';
const BASE_URL = 'https://back-ware-api.onrender.com';

export default axios.create({
    baseURL: BASE_URL,
    timeout: 1000,
    headers: {
        'Content-Type': 'application/json',
    }
})
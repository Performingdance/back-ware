import axios from 'axios';


//const BASE_URL = 'http://localhost:3000/api/';
const BASE_URL = 'https://back-ware-api.onrender.com/api/';

export default axios.create({
    baseURL: BASE_URL,
    timeout: 2000,
    headers: {
        'Content-Type': 'application/json',
    }
})
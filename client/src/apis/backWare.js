import axios from 'axios';


//const BASE_URL = 'http://localhost:3000/api/';
const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export default axios.create({
    baseURL: BASE_URL,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json',
    }
})
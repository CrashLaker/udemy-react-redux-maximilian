import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://udemy-react-myburger-8cae3-default-rtdb.firebaseio.com/'
})

export default instance;
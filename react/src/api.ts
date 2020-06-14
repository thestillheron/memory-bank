const baseUrl = process.env.API_ADDRESS;
import axios from 'axios';

if (!baseUrl) {
  throw new Error('Not configured');
}

const finalCharacter = baseUrl.slice(baseUrl.length - 1);
let washedUrl = finalCharacter === '/' ? baseUrl : `${baseUrl}/`;
axios.defaults.baseURL = washedUrl;
axios.defaults.headers = {
  'content-type': 'application/json',
};

export default axios;

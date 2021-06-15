import axios from "axios";


const baseUrl = "/api/blogs";
let token = null;


const setToken = newToken => {
  token = `Bearer ${newToken}`;
}


const getAll = async () => {
  const response = await axios.get(baseUrl);
  return response.data;
};


const create = async blogDetails => {
  const config = {
    headers: { Authorization: token }
  };

  return await axios.post(baseUrl, blogDetails, config);
};


const exports = { getAll, create, setToken };
export default exports;
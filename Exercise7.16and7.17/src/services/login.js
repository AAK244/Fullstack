import axios from "axios";
import blogService from "./blogs";
const baseUrl = "http://localhost:3001/api/login";

const login = async (credentials) => {
  const response = await axios.post(baseUrl, credentials);
  const user = response.data;

  blogService.setToken(user.token);

  return user;
};

export default { login };

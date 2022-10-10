import axios from "axios";

const getFileList = async (config?: any) => {
  return await axios.get("http://localhost:8000/api/v1/files/list", config);
};

export default getFileList;

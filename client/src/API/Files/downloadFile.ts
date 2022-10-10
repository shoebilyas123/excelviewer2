import axios from "axios";

interface IParams {
  filename: string;
  token: string;
}

const downloadFile = async (params: IParams) => {
  const { filename, token } = params;
  return await axios.get(
    `http://localhost:8000/api/v1/files/download/${filename}`,
    {
      headers: {
        authorization: `Bearer ${token}`,
      },
    }
  );
};

export default downloadFile;

import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import downloadFile from '../API/Files/downloadFile';
import getFileList from '../API/Files/getFileList';
import Editor from '../Components/Editor';
import Sidebar from '../Components/Sidebar';
import Spinner from '../Components/Spinner';
import { getConfig } from '../Helpers/auth';
import useLoading from '../Hooks/useLoading';
import { RootState } from '../Store/store';
import EditorWrapper from '../Components/Editor/EditorWrapper';

const Home = () => {
  const { loading, startLoading, stopLoading } = useLoading();
  const {
    user: { accessToken, name },
  } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!accessToken) {
      navigate('/register');
    } else {
      toast.success(`Logged in as ${name}`, { position: 'bottom-right' });
    }
  }, [accessToken]);

  const [list, setList] = React.useState<string[]>([]);
  const [filteredList, setFilteredList] = React.useState<string[]>([]);
  const [fileData, setFileData] = React.useState<any>(null);

  const downloadFileHandler = async (filename: string) => {
    try {
      setFileData(null);
      startLoading();
      const { data } = await downloadFile({ filename, token: accessToken });
      setFileData(data);
      stopLoading();
    } catch (error) {
      stopLoading();
      console.log(error);
    }
  };

  const fileListHandler = async () => {
    const config = getConfig({ token: accessToken });
    const { data } = await getFileList(config);
    console.log(data);
    setList((data.files as Array<string>).map((file) => file.substring(25)));
  };

  const closeFileHandler = () => setFileData(null);

  React.useEffect(() => {
    fileListHandler();
  }, []);

  return (
    <div className="flex">
      {!list ? (
        <p>Loading...</p>
      ) : (
        <Sidebar
          list={list}
          onSelect={downloadFileHandler}
          onReload={fileListHandler}
        />
      )}
      <div
        className={`w-full overflow-hidden flex ${
          (loading || !fileData) && 'items-center justify-center'
        }`}
      >
        {!fileData || loading ? (
          <div className="text-xl font-bold text-zinc-700">
            {loading ? <Spinner /> : 'No File Selected'}
          </div>
        ) : (
          // <Editor
          //   fileData={fileData}
          //   onCloseFile={closeFileHandler}
          //   onReload={(fName: string) => downloadFileHandler(fName)}
          // />
          <EditorWrapper
            filename={fileData.filename}
            fileData={fileData.file}
            {...{
              onReload: (fName: string) => downloadFileHandler(fName),
              onCloseFile: closeFileHandler,
            }}
          />
        )}
      </div>
    </div>
  );
};

export default Home;

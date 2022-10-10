import axios from "axios";
import React from "react";
import { toast } from "react-toastify";
import { AiOutlineReload } from "react-icons/ai";
import { IoCloudUploadSharp } from "react-icons/io5";
import { BsFileEarmarkXFill, BsThreeDotsVertical } from "react-icons/bs";
import { FaUserCircle } from "react-icons/fa";
import { HiOutlineLogout } from "react-icons/hi";

import Button from "../Button";
import Modal from "../Modal";
import Spinner from "../Spinner";
import useLoading from "../../Hooks/useLoading";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../Store/Slice/auth";
import { useNavigate } from "react-router-dom";
import { RootState } from "../../Store/store";

interface IProps {
  list: string[];
  onSelect: (name: string) => void;
  onReload: () => void;
}

const Sidebar: React.FC<IProps> = ({ list, onSelect, onReload }) => {
  const { loading, startLoading, stopLoading } = useLoading();
  const [isModalVisible, setIsModalVisible] = React.useState<boolean>(false);
  const [selectedFile, setSelectedFile] = React.useState<File | null>();
  const [showUserDropdown, setShowUserDropdown] =
    React.useState<boolean>(false);
  const {
    user: { accessToken },
  } = useSelector((state: RootState) => state.auth);

  const openModal = () => setIsModalVisible(true);
  const closeModal = () => setIsModalVisible(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (!accessToken) navigate("/register");
  }, [accessToken]);

  const uploadFileHandler = async () => {
    try {
      startLoading();
      const form = new FormData();
      // @ts-ignore
      form.append("file", selectedFile);

      await axios.post("http://localhost:8000/api/v1/files/upload", form, {
        headers: {
          authorization: `Bearer ${accessToken}`,
        },
      });

      stopLoading();
      setSelectedFile(null);
      closeModal();
      onReload();
      toast.success("File uploaded successfully!");
    } catch (error) {
      stopLoading();
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="flex flex-col h-screen p-3 bg-white shadow-r-lg shadow w-75">
      {isModalVisible && (
        <Modal>
          <div className="w-fit min-h-[250px] bg-white shadow-lg opacity-100 flex flex-col p-2 justify-between rounded">
            <div>Upload A New File</div>
            <input
              type="file"
              onChange={(e) =>
                setSelectedFile((e.target.files && e?.target?.files[0]) || null)
              }
            />
            <div className="flex space-x-3 flex-row items-center justify-start">
              <Button
                className="bg-zinc-200 hover:bg-zinc-300 text-zinc-900"
                onClick={closeModal}
              >
                Cancel
              </Button>
              <Button className="space-x-2" onClick={uploadFileHandler}>
                {loading && <Spinner className="w-4 h-4" />}
                <p>Upload</p>
              </Button>
            </div>
          </div>
        </Modal>
      )}
      <div className="space-y-3">
        <div className="flex items-center relative">
          <h2 className="text-xl font-bold px-2">Excel Viewer</h2>
          <FaUserCircle
            className="text-2xl text-zinc-600 hover:text-zinc-800 cursor-pointer"
            onClick={() => {
              setShowUserDropdown((prev) => !prev);
            }}
          />
          {showUserDropdown && (
            <div
              className="absolute bg-slate-200 shadow-md flex flex-col -right-14 top-4 py-2 rounded"
              onMouseLeave={() => setShowUserDropdown(false)}
            >
              <span
                className="flex items-center px-2 hover:bg-slate-50 py-1 cursor-pointer"
                onClick={() => dispatch(logout())}
              >
                <p>Logout</p>
                <HiOutlineLogout />
              </span>
            </div>
          )}
        </div>

        <div className="flex flex-row items-left">
          <Button
            className="w-fit mx-2 space-x-1 flex items-center justify-center"
            onClick={openModal}
          >
            <IoCloudUploadSharp />
            <p>Upload</p>
          </Button>

          <Button
            className="w-fit mx-2 flex items-center justify-center bg-zinc-200 hover:bg-zinc-300"
            onClick={onReload}
          >
            <AiOutlineReload />
          </Button>
        </div>

        <div className="flex-1">
          {list.length === 0 && (
            <p className="text-center mt-8 text-xl text-zinc-800 ">
              No Files. Let's upload some.
            </p>
          )}
          <ul className="pt-2 pb-4 space-y-1 text-sm">
            {list.map((item) => (
              <li className="rounded-lg flex items-center justify-between p-2 hover:bg-slate-100 cursor-pointer">
                <div
                  className="flex items-center space-x-2 text-ellipsis whitespace-nowrap "
                  onClick={() => onSelect(item)}
                >
                  <BsFileEarmarkXFill className="text-green-700 text-xl " />
                  <span className="text-bold">{item}</span>
                </div>
                <BsThreeDotsVertical className="text-zinc-400 hover:text-zinc-500" />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

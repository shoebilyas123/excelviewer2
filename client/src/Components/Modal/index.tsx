import ReactDOM from "react-dom";
import Overlay from "../Overlay";

const ModalContent: React.FC<React.HTMLProps<HTMLElement>> = ({ children }) => {
  return (
    <>
      <Overlay />
      <div className="fixed top-0 left-0 flex bg-black items-center justify-center w-screen h-screen">
        {children}
      </div>
    </>
  );
};

interface IProps extends React.HTMLProps<HTMLElement> {
  onClose?: () => void;
}

const Modal: React.FC<IProps> = ({ children }) => {
  const domNode = document.body.querySelector("#modal");
  console.log(domNode);

  return domNode
    ? ReactDOM.createPortal(<ModalContent>{children}</ModalContent>, domNode)
    : null;
};

export default Modal;

import ReactDOM from "react-dom";

const OverlayJSX: React.FC<React.HTMLProps<HTMLElement>> = ({}) => {
  return (
    <div className="fixed top-0 left-0 flex bg-black opacity-15 items-center justify-center w-screen h-screen"></div>
  );
};

const Overlay: React.FC<{}> = () => {
  const domNode = document.body.querySelector("#overlay");
  return domNode ? ReactDOM.createPortal(<OverlayJSX />, domNode) : null;
};

export default Overlay;

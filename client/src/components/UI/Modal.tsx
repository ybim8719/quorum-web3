import ReactDOM from "react-dom";
import classes from "./Modal.module.css";
import LoadingIndicator from "./LoadingIndicator";

interface iBackdrop {
  onClose: () => void | null;
}
const Backdrop = ({ onClose }: iBackdrop) => {
  return <div className={classes.backdrop} onClick={onClose} />;
};

const ModalOverlay = ({ children }: any) => {
  return (
    <div className={classes.modal}>
      <div className={classes.content}>{children}</div>
    </div>
  );
};

export const LoadingModal = () => {
  return (
    <>
      {ReactDOM.createPortal(
        <>
          <Backdrop onClose={() => { }} />
          <ModalOverlay>
            <h2>Transaction being processed...</h2>
            <LoadingIndicator />
          </ModalOverlay>
        </>,
        document.getElementById("overlays") as Element,
      )}
    </>
  );
};

export const Modal = ({ onClose, children }: any) => {
  return (
    <>
      {ReactDOM.createPortal(
        <>
          <Backdrop onClose={onClose} />
          <ModalOverlay>
            {children}
            <button className={classes["close-button"]} onClick={onClose}>
              Close
            </button>
          </ModalOverlay>
        </>,
        document.getElementById("overlays") as Element,
      )}
    </>
  );
}


export const NonClosableModal = ({ children }: any) => {
  return (
    <>
      {ReactDOM.createPortal(
        <>
          <ModalOverlay>
            {children}
          </ModalOverlay>
        </>,
        document.getElementById("overlays") as Element,
      )}
    </>
  );

};

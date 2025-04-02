// import classes from './SwitchToNextStepButton.module.css';

interface ISwitchToNextStepButton {
  btnDescription: string;
  onValidate: () => void;
}

const SwitchToNextStepButton = ({ btnDescription, onValidate }: ISwitchToNextStepButton) => {
  return (
    <div className="section">
      <p>{btnDescription}</p>
      <button className="nes-btn is-primary" onClick={onValidate}>
        OK
      </button>
    </div>
  );
};

export default SwitchToNextStepButton;

// import classes from './SwitchToNextStepButton.module.css';

interface ISwitchToNextStepButton {
  btnDesription: string;
  onValidate: () => void;
}

const SwitchToNextStepButton = ({ btnDesription, onValidate }: ISwitchToNextStepButton) => {
  return (
    <div>
      <p>{btnDesription}</p>
      <button className="nes-btn is-primary" onClick={onValidate}>
        OK
      </button>
    </div>
  );
};

export default SwitchToNextStepButton;

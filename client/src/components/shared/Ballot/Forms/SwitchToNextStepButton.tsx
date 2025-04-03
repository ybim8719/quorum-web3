// import classes from './SwitchToNextStepButton.module.css';

interface ISwitchToNextStepButton {
  instructions: string;
  onValidate: () => void;
}

const SwitchToNextStepButton = ({ instructions, onValidate }: ISwitchToNextStepButton) => {
  return (
    <div>
      <p>{instructions}</p>
      <button className="nes-btn is-primary" onClick={onValidate}>
        OK
      </button>
    </div>
  );
};

export default SwitchToNextStepButton;

import classes from "./LoadingIndicator.module.css";

export default function LoadingIndicator() {
  return (
    <div className={classes["lds-ring"]}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
}

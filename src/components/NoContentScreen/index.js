import emptyIcon from "../../assets/icons/empty.svg";
import styles from "./index.module.css";

const NoContentScreen = () => {
  return (
    <div className={styles.container}>
      <img src={emptyIcon} alt="empty icon" className={styles.icon} />
      <span className={styles.title}>There is nothing in here</span>
      <p className={styles.description}>Fill me up</p>
    </div>
  );
};

export default NoContentScreen;

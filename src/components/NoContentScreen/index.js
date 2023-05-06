import styles from "./index.module.css";

const NoContentScreen = () => {
  return (
    <div className={styles.container}>
      <span className={styles.title}>There is nothing in here</span>
      <p className={styles.description}>Fill me up</p>
    </div>
  );
};

export default NoContentScreen;

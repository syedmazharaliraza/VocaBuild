import soundIcon from "../../assets/icons/sound.svg";
import linkIcon from "../../assets/icons/link.svg";
import trashIcon from "../../assets/icons/trash.svg";
import openNewTab from "../../utils/openNewTab";
import styles from "./CardContent.module.css";

const CardContent = ({ data, index, total, deleteWord }) => {
  console.log(data);
  return (
    <div className={styles.container}>
      <div className={styles.card_header}>
        <img src={soundIcon} alt="sound icon" className={styles.soundIcon} />
        <span className={styles.card_index}>{`(${index + 1}/${total})`}</span>
      </div>
      <div className={styles.card_body}>
        <h2 className={styles.card_body__word}>
          <a href={data.url} onClick={() => openNewTab(data.url)}>
            {data.word} <img src={linkIcon} alt="link icon" />
          </a>
        </h2>
        <p className={styles.card_body__word}>{data.meaning}</p>
      </div>

      <div className={styles.card_footer}>
        <img
          src={trashIcon}
          alt="delete icon"
          className={styles.trashIcon}
          onClick={() => deleteWord(data.word)}
        />
      </div>
    </div>
  );
};

export default CardContent;

import NoContentScreen from "../NoContentScreen";
import Card from "./Card";
import styles from "./index.module.css";

const ContentList = ({
  dateValue,
  selectedWords,
  setSelectedWords,
  savedWords,
}) => {
  return (
    <div className={styles.container}>
      <p className={styles.date}>
        {dateValue.toLocaleDateString("en-US", {
          month: "long",
          day: "numeric",
          year: "numeric",
        })}
      </p>
      {savedWords.length > 0 ? (
        <div className={styles.cardWrapper}>
          {savedWords.map((each) => (
            <Card
              key={each.id}
              data={each}
              selectedWords={selectedWords}
              setSelectedWords={setSelectedWords}
            />
          ))}
        </div>
      ) : (
        <NoContentScreen />
      )}
    </div>
  );
};

export default ContentList;

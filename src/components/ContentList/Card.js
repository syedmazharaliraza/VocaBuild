import { useState } from "react";
import soundIcon from "../../assets/icons/sound.svg";
import styles from "./Card.module.css";
import { Checkbox } from "@mantine/core";

const Card = ({ data, setSelectedWords, selectedWords }) => {
  const [expanded, setExpanded] = useState(false);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };

  const handleWordSelect = (id) => {
    setSelectedWords((prevIds) => {
      if (prevIds.includes(id)) {
        return prevIds.filter((prevId) => prevId !== id);
      } else {
        return [...prevIds, id];
      }
    });
  };

  function playAudio() {
    setIsAudioPlaying(true);
    const pronunciation = new Audio(data.audio);
    pronunciation.pause();
    pronunciation.currentTime = 0;
    pronunciation.play();
    pronunciation.onended = () => setIsAudioPlaying(false);
  }

  let meaning = data.meaning;
  if (meaning.length > 55) {
    meaning = expanded ? data.meaning : data.meaning.slice(0, 55) + "...";
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.wordContainer}>
          <span>{data.word}</span>
          {data.audio && (
            <img
              src={soundIcon}
              alt="sound icon"
              className={`${styles.soundIcon} ${
                isAudioPlaying && styles.active
              }`}
              onClick={playAudio}
            />
          )}
        </div>
        <Checkbox
          color="teal"
          size="xs"
          checked={selectedWords.includes(data.id)}
          onChange={() => handleWordSelect(data.id)}
          styles={{
            input: {
              backgroundColor: "#f1f1f1",
              borderColor: "#f1f1f1",
            },
          }}
        />
      </div>
      <div className={styles.body}>
        <span className={styles.meaning}>{meaning}</span>
        {meaning.length > 55 && (
          <span className={styles.readMore} onClick={handleClick}>
            {expanded ? "Read less" : "Read more"}
          </span>
        )}
      </div>
    </div>
  );
};

export default Card;

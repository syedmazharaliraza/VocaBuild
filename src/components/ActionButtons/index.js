import deleteIcon from "../../assets/icons/trash.svg";
import calendarIcon from "../../assets/icons/calendar.svg";
import styles from "./index.module.css";
import { Tooltip } from "@mantine/core";
import { useState } from "react";
import { DatePicker } from "@mantine/dates";

const ActionButtons = ({
  dateValue,
  setDateValue,
  selectedWords,
  setSelectedWords,
  deleteWord,
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  return (
    <div className={styles.container}>
      {showDatePicker && (
        <DatePicker
          value={dateValue}
          onChange={(value) => {
            setDateValue(value);
            setShowDatePicker(false);
          }}
          className={styles.datePicker}
          maxDate={new Date()}
        />
      )}
      <Tooltip label="Delete words" position="top" withArrow>
        <button disabled={selectedWords.length === 0}>
          <img
            src={deleteIcon}
            alt="delete icon"
            style={{ opacity: selectedWords.length > 0 ? 1 : 0.6 }}
            onClick={() => {
              deleteWord(selectedWords);
              setSelectedWords([]);
            }}
          />
        </button>
      </Tooltip>
      <Tooltip label="Change date" position="top" withArrow>
        <button
          onClick={function () {
            setShowDatePicker((preVal) => !preVal);
          }}
        >
          <img src={calendarIcon} alt="calendar icon" />
        </button>
      </Tooltip>
    </div>
  );
};

export default ActionButtons;

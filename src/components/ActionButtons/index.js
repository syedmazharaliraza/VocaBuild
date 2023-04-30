import calendarIcon from "../../assets/icons/calendar.svg";
import githubIcon from "../../assets/icons/github.svg";
import { Switch, Tooltip } from "@mantine/core";
import { DatePicker } from "@mantine/dates";
import { useEffect, useMemo, useState } from "react";
import { startWatchingMouseup } from "../../constants/messageTypes";
import { sendMessageToScript } from "../../utils/messageSender";
import useChromeStorage from "../../hooks/useChromeStorage";
import openNewTab from "../../utils/openNewTab";
import styles from "./index.module.css";

const ActionButtons = ({ isHovering, datevalue, setDateValue }) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [checked, setChecked] = useChromeStorage("extension_active", false);

  const icons = useMemo(
    () => [
      {
        label: "Select date",
        img: calendarIcon,
        alt: "calender icon",
        onclick: function () {
          console.log("hi");
          setShowDatePicker((preVal) => !preVal);
        },
      },
      {
        label: "Contribute",
        img: githubIcon,
        alt: "github icon",
        onclick: () => {
          openNewTab();
        },
      },
    ],
    []
  );

  useEffect(() => {
    sendMessageToScript({
      type: startWatchingMouseup,
      value: checked,
    });
  }, [checked]);

  return (
    <div className={`${styles.container} ${isHovering && styles.display}`}>
      {showDatePicker && isHovering && (
        <DatePicker
          value={datevalue}
          onChange={(value) => {
            setDateValue(value);
            setShowDatePicker(false);
          }}
          className={styles.datePicker}
          maxDate={new Date()}
        />
      )}
      <Tooltip
        label={`Turn ${checked ? "off" : "on"} VocaBuild`}
        position="right"
        withArrow
      >
        <div>
          <Switch
            size="xs"
            checked={checked}
            onChange={(event) => setChecked(event.currentTarget.checked)}
          />
        </div>
      </Tooltip>

      {icons.map((icon) => (
        <Tooltip label={icon.label} position="right" withArrow>
          <div className={styles.icon} onClick={icon.onclick}>
            <img src={icon.img} alt={icon.alt} />
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

export default ActionButtons;

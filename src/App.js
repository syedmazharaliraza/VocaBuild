import { useState } from "react";
import ActionButtons from "./components/ActionButtons";
import Cards from "./components/Cards";

import styles from "./App.module.css";

export default function App() {
  const [isHovering, setIsHovering] = useState(false);
  const [datevalue, setDateValue] = useState(new Date());
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };
  return (
    <div
      className={styles.container}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <ActionButtons
        isHovering={isHovering}
        datevalue={datevalue}
        setDateValue={setDateValue}
      />
      <Cards datevalue={datevalue} />
    </div>
  );
}

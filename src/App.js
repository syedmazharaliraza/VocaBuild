import { useState } from "react";
import styles from "./App.module.css";
import Topbar from "./components/Topbar";
import ContentList from "./components/ContentList";
import ActionButtons from "./components/ActionButtons";
import useSavedWords from "./hooks/useSavedWords";

export default function App() {
  const [dateValue, setDateValue] = useState(new Date());
  const [selectedWords, setSelectedWords] = useState([]);
  const { savedWords, deleteWord } = useSavedWords(dateValue);
  return (
    <div className={styles.container}>
      <Topbar />
      <ContentList
        dateValue={dateValue}
        savedWords={savedWords}
        selectedWords={selectedWords}
        setSelectedWords={setSelectedWords}
      />
      <ActionButtons
        dateValue={dateValue}
        setDateValue={setDateValue}
        selectedWords={selectedWords}
        deleteWord={deleteWord}
        setSelectedWords={setSelectedWords}
      />
    </div>
  );
}

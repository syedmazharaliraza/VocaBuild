/* global chrome */
import { useState, useEffect } from "react";

const useSavedWords = () => {
  const [savedWords, setSavedWords] = useState([]);

  useEffect(() => {
    chrome.storage.local.get({ vocabuildSavedWords: [] }, (data) => {
      setSavedWords(data.vocabuildSavedWords);
    });

    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local" && changes.vocabuildSavedWords) {
        setSavedWords(changes.vocabuildSavedWords.newValue);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, []);

  return savedWords;
};

export default useSavedWords;

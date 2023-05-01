/* global chrome */
import { useState, useEffect } from "react";

const useSavedWords = (date) => {
  const [savedWords, setSavedWords] = useState([]);

  const deleteWord = (word) => {
    chrome.storage.local.get({ vocabuildSavedWords: [] }, (data) => {
      console.log(data + "-9");
      console.log(word + "-10");
      const filteredWords = data.vocabuildSavedWords.filter(
        (w) => w.word !== word
      );
      console.log(filteredWords + "-12");
      chrome.storage.local.set({ vocabuildSavedWords: filteredWords });
      setSavedWords(filteredWords);
    });
  };

  useEffect(() => {
    chrome.storage.local.get({ vocabuildSavedWords: [] }, (data) => {
      const filteredWords = data.vocabuildSavedWords.filter(
        (word) => word.date === date
      );
      setSavedWords(filteredWords);
    });

    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local" && changes.vocabuildSavedWords) {
        const filteredWords = changes.vocabuildSavedWords.newValue.filter(
          (word) => word.date === date
        );
        setSavedWords(filteredWords);
      }
    };

    chrome.storage.onChanged.addListener(handleStorageChange);

    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };
  }, [date]);

  return { savedWords, deleteWord };
};

export default useSavedWords;

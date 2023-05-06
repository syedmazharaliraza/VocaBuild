/* global chrome */

import { useEffect, useState } from "react";

const useSavedWords = (date) => {
  const [savedWords, setSavedWords] = useState([]);

  const deleteWord = (ids) => {
    chrome?.storage?.local?.get({ vocabuildSavedWords: [] }, (data) => {
      const filteredWords = data.vocabuildSavedWords.filter(
        (w) => !ids.includes(w.id)
      );
      chrome?.storage?.local?.set({ vocabuildSavedWords: filteredWords });
      setSavedWords(filteredWords);
    });
  };

  useEffect(() => {
    const dateString = date.toLocaleDateString();
    chrome?.storage?.local?.get({ vocabuildSavedWords: [] }, (data) => {
      const filteredWords = data.vocabuildSavedWords.filter(
        (word) => word.date === dateString
      );
      setSavedWords(filteredWords);
    });

    const handleStorageChange = (changes, areaName) => {
      if (areaName === "local" && changes?.vocabuildSavedWords) {
        const filteredWords = changes.vocabuildSavedWords.newValue.filter(
          (word) => word.date === dateString
        );
        setSavedWords(filteredWords);
      }
    };

    chrome?.storage?.onChanged?.addListener(handleStorageChange);

    return () => {
      chrome?.storage?.onChanged?.removeListener(handleStorageChange);
    };
  }, [date]);

  return { savedWords, deleteWord };
};

export default useSavedWords;

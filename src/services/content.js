/* global chrome */
import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { saveMeaning, startWatchingMouseup } from "../constants/messageTypes";
import { nanoid } from "nanoid";

const WordTooltip = ({ word, url }) => {
  const [loading, setLoading] = useState(true);
  const [wordData, setWordData] = useState({
    result: "",
    audio: "",
    error: false,
  });
  const [isWordSaved, setIsWordSaved] = useState(false);

  const handleSaveWord = () => {
    chrome.runtime.sendMessage({
      type: saveMeaning,
      value: {
        word,
        url,
        meaning: wordData.result,
        audio: wordData?.audio,
        date: new Date().toLocaleDateString(),
        id: nanoid(),
      },
    });
    setIsWordSaved(true);
  };

  const fetchWordMeaning = useMemo(() => {
    const cache = {};
    return async (word) => {
      if (cache[word]) {
        return cache[word];
      }
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      );
      const resJson = await response.json();
      if (resJson?.message) {
        return { result: resJson?.message, error: true };
      }
      const data = {
        result: resJson[0]?.meanings[0]?.definitions[0]?.definition,
        audio: resJson[0]?.phonetics[0]?.audio,
      };
      cache[word] = data.result;
      return data;
    };
  }, []);

  useEffect(() => {
    setWordData({
      result: "",
      audio: "",
      error: false,
    });
    setIsWordSaved(false);
    fetchWordMeaning(word)
      .then((res) => {
        setWordData((preVal) => ({
          ...preVal,
          ...res,
        }));
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.error("Error parsing API response: " + error.message);
      });
  }, [word, fetchWordMeaning]);

  return (
    <div className="vocab--tooltip">
      <span className="word">{word}</span>
      {loading ? (
        <div className="loader"></div>
      ) : (
        <>
          <p className="meaning">{wordData.result}</p>
          {!wordData.error && (
            <button className="save-btn" onClick={handleSaveWord}>
              {`${isWordSaved ? "Saved!" : "Save"}`}
            </button>
          )}
        </>
      )}
    </div>
  );
};

const isTooltipClicked = (e) =>
  e.target.parentElement.classList.contains("vocab--tooltip") ||
  e.target.classList.contains("vocab--tooltip");

function capitalize(word) {
  if (word.length < 2) return;
  return word[0].toUpperCase() + word.slice(1).toLowerCase();
}

const handleMouseUp = (e) => {
  if (isTooltipClicked(e)) return;

  const selectedText = capitalize(window.getSelection().toString().trim());
  if (selectedText?.length <= 1 || selectedText.split(/\s+/)?.length > 1)
    return;

  const baseUrl = window.location.href.split("#")[0];
  const url = e.target.id ? `${baseUrl}#${e.target.id}` : baseUrl;

  const range = window.getSelection().getRangeAt(0);
  const tooltip = document.createElement("div");
  tooltip.classList.add("vocab--root");
  tooltip.style.top = `${
    range.getBoundingClientRect().top + window.scrollY - tooltip.offsetHeight
  }px`;
  tooltip.style.left = `${
    range.getBoundingClientRect().left +
    range.getBoundingClientRect().width / 2 -
    tooltip.offsetWidth / 2
  }px`;

  document.body.appendChild(tooltip);

  const root = ReactDOM.createRoot(tooltip);
  root.render(<WordTooltip word={selectedText} url={url} />);

  // Removing tooltip once new word is selected
  const removeTooltip = (event) => {
    if (isTooltipClicked(event)) {
      return document.addEventListener("mousedown", removeTooltip, {
        once: true,
      });
    }
    chrome.storage.local.get({ extension_active: true }, (data) => {
      if (data.extension_active) {
        document.addEventListener("mouseup", handleMouseUp);
      }
    });
    tooltip.remove();
  };
  document.addEventListener("mousedown", removeTooltip, { once: true });
};

function handleStorageChange(changes) {
  if (changes.extension_active && changes.extension_active.newValue) {
    document.addEventListener("mouseup", handleMouseUp);
  } else {
    document.removeEventListener("mouseup", handleMouseUp);
  }
}

chrome.storage.onChanged.addListener(handleStorageChange);
chrome.storage.local.get({ extension_active: true }, (data) => {
  if (data.extension_active) {
    document.addEventListener("mouseup", handleMouseUp);
  }
});

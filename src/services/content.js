/* global chrome */
import React, { useState, useEffect, useMemo } from "react";
import ReactDOM from "react-dom/client";
import { saveMeaning, startWatchingMouseup } from "../constants/messageTypes";

const WordTooltip = ({ word, url }) => {
  const [loading, setLoading] = useState(true);
  const [meaning, setMeaning] = useState("");
  const [isWordSaved, setIsWordSaved] = useState(false);
  const [error, setError] = useState("");

  const handleSaveWord = () => {
    chrome.runtime.sendMessage({
      type: saveMeaning,
      value: {
        word,
        meaning,
        url,
        date: new Date().toLocaleString().slice(0, 8),
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
      if (resJson.message) {
        return setError(resJson.message);
      }
      const result = resJson[0].meanings[0].definitions[0].definition;
      cache[word] = result;
      return result;
    };
  }, []);

  useEffect(() => {
    setError("");
    setMeaning("");
    setIsWordSaved(false);
    fetchWordMeaning(word)
      .then((result) => {
        setMeaning(result);
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
          <p className="meaning">{error ? error : meaning}</p>
          {!error && (
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
  if (selectedText.length <= 1 || selectedText.split(/\s+/).length > 1) return;

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
    if (isTooltipClicked(event))
      return document.addEventListener("mousedown", removeTooltip, {
        once: true,
      });
    document.addEventListener("mouseup", handleMouseUp);
    tooltip.remove();
  };
  document.addEventListener("mousedown", removeTooltip, { once: true });
};

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
  if (message.type === startWatchingMouseup) {
    if (message.value) {
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.removeEventListener("mouseup", handleMouseUp);
    }
  }
});

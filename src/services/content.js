/* global chrome */
import { saveMeaning, startWatchingMouseup } from "../constants/messageTypes";

const handleSaveWord = ({ word, meaning, url }) => {
  chrome.runtime.sendMessage({
    type: saveMeaning,
    value: {
      word,
      meaning,
      url,
      date: new Date().toLocaleString().slice(0, 8),
    },
  });
};

const handleMeaningGeneration = (word, meaning, url) => {
  const tooltip = document.querySelector(".vocab--tooltip");
  tooltip.removeChild(document.querySelector(".vocab--tooltip .loader"));
  const meaningElement = document.createElement("p");
  meaningElement.classList.add("meaning");
  meaningElement.textContent = meaning;
  tooltip.appendChild(meaningElement);
  const saveBtn = document.createElement("button");
  saveBtn.classList.add("save-btn");
  saveBtn.textContent = "Save";
  saveBtn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSaveWord({ word, meaning, url });
    saveBtn.textContent = "Saved!";
  });
  tooltip.appendChild(saveBtn);
};

const fetchWordMeaning = async (word, API_KEY) => {
  const response = await fetch(
    `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${API_KEY}`,
    {
      method: "GET",
    }
  );
  return response;
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
  let element = e.target;
  let id = element.id;
  while (!id && element.parentNode) {
    element = element.parentNode;
    id = element.id;
  }
  const baseUrl = window.location.href.split("#")[0];
  const url = id ? `${baseUrl}#${id}` : baseUrl;
  const range = window.getSelection().getRangeAt(0);
  const tooltip = document.createElement("div");
  tooltip.classList.add("vocab--tooltip");
  tooltip.style.top = `${
    range.getBoundingClientRect().top + window.scrollY - tooltip.offsetHeight
  }px`;
  tooltip.style.left = `${
    range.getBoundingClientRect().left +
    range.getBoundingClientRect().width / 2 -
    tooltip.offsetWidth / 2
  }px`;
  document.body.appendChild(tooltip);
  const wordSpan = document.createElement("span");
  wordSpan.classList.add("word");
  wordSpan.textContent = selectedText;
  tooltip.appendChild(wordSpan);
  const loader = document.createElement("div");
  loader.className = "loader";
  tooltip.appendChild(loader);

  // Fetchimg word meaning
  chrome.storage.local.get({ API_KEY: "" }, (data) => {
    fetchWordMeaning(selectedText, data.API_KEY)
      .then((response) => response.json())
      .then((res) => {
        console.log(res + "-90");
        console.log(res[0]["def"][0]["sseq"][0][0][1]["dt"][0][1] + "-91");
        return handleMeaningGeneration(
          selectedText,
          res[0]["def"][0]["sseq"][0][0][1]["dt"][0][1].replace(/\{.*?\}/g, ""),
          url
        );
      })
      .catch((error) =>
        console.error("Error parsing API response: " + error.message)
      );
  });

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

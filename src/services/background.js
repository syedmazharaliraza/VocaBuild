/* global chrome */
import { saveMeaning } from "../constants/messageTypes";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === saveMeaning) {
    chrome.storage.local.get({ vocabuildSavedWords: [] }, (data) => {
      let savedWords = data.vocabuildSavedWords;
      console.log(savedWords, message.value);
      const existingWord = savedWords.find(
        (w) => w.word === message.value.word
      );
      if (existingWord) {
        existingWord.meaning = message.value.meaning;
        existingWord.date = message.value.date;
        existingWord.url = message.value.url;
      } else {
        savedWords.push({
          word: message.value.word,
          meaning: message.value.meaning,
          date: message.value.date,
          url: message.value.url,
        });
      }

      chrome.storage.local.set({ vocabuildSavedWords: savedWords }, () => {
        console.log("Saved word:", message.value);
      });
    });
  }
});

const injectScriptsToTabId = (scripts, tabId) => {
  scripts?.forEach((script) => {
    if (!script.js) return;
    chrome.scripting.executeScript(
      {
        target: { tabId, allFrames: true },
        files: script.js,
      },
      () => void chrome.runtime.lastError
    );
  });
};

chrome.runtime.onInstalled.addListener(() => {
  const scripts = chrome.runtime.getManifest().content_scripts;
  scripts &&
    chrome.windows.getAll((windows) => {
      if (!windows) return;

      windows?.forEach((window) => {
        chrome.tabs.query(
          {
            windowId: window.id,
          },
          (tabs) => {
            tabs.forEach((tab) => {
              tab.id && injectScriptsToTabId(scripts, tab.id);
            });
          }
        );
      });
    });
});

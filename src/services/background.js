/* global chrome */
import { saveMeaning } from "../constants/messageTypes";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === saveMeaning) {
    chrome.storage.local.get({ vocabuildSavedWords: [] }, (data) => {
      let savedWords = data.vocabuildSavedWords;
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

      chrome.storage.local.set({ vocabuildSavedWords: savedWords }, () => {});
    });
  }
});

let injectedTabs = [];

const injectScriptsToTabId = (scripts, tabId) => {
  if (injectedTabs.includes(tabId)) {
    return;
  }
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
  injectedTabs.push(tabId);
};

chrome.runtime.onInstalled.addListener(() => {
  // Fetching API KEY and storing it chrome.storage
  fetch("https://vocabuild-api-key-default-rtdb.firebaseio.com/api_key.json")
    .then((res) => res.json())
    .then((res) => {
      return chrome.storage.local.set({ API_KEY: res.value }, (data) => {});
    });
});

chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (!injectedTabs.includes(tabId)) {
    const scripts = chrome.runtime.getManifest().content_scripts;
    injectScriptsToTabId(scripts, tabId);
    injectedTabs.push(tabId);
  }
});

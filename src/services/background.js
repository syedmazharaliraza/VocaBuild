/* global chrome */
import { saveMeaning } from "../constants/messageTypes";

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === saveMeaning) {
    chrome.storage.local.get({ vocabuildSavedWords: [] }, (data) => {
      let savedWords = data.vocabuildSavedWords;
      const existingWord = savedWords.find(
        (w) => w.word === message.value.word
      );

      if (existingWord) {
        for (let prop in message.value) {
          if (prop !== "id" && prop !== "word") {
            existingWord[prop] = message.value[prop];
          }
        }
      } else {
        savedWords.push({
          ...message.value,
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

chrome.tabs.onActivated.addListener(({ tabId }) => {
  if (!injectedTabs.includes(tabId)) {
    const scripts = chrome.runtime.getManifest().content_scripts;
    injectScriptsToTabId(scripts, tabId);
    injectedTabs.push(tabId);
  }
});

chrome.runtime.onInstalled.addListener(async () => {
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

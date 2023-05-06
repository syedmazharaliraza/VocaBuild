/* global chrome */

export const sendMessageToScript = (message) => {
  chrome?.tabs?.query({ active: true, currentWindow: true }, (tabs) => {
    const activeTab = tabs[0];
    chrome?.tabs?.sendMessage(activeTab?.id, message);
  });
};

/* global chrome */

const openNewTab = (url) => {
  chrome?.tabs?.create({ url });
};

export default openNewTab;

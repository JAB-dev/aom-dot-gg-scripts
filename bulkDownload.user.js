// ==UserScript==
// @name        Download all loaded recordings
// @namespace   Violentmonkey Scripts
// @match       https://www.aom.gg/*
// @grant       none
// @version     1.0
// @author      -
// @description 09/09/2024, 23:06:21
// ==/UserScript==


(function() {
  'use strict';

  // Create the button
  const downloadAllButton = document.createElement('button');
  downloadAllButton.textContent = 'Download All';
  downloadAllButton.style.padding = '8px 12px';
  downloadAllButton.style.margin = '0 8px';
  downloadAllButton.style.border = '1px solid #ccc';
  downloadAllButton.style.borderRadius = '4px';
  downloadAllButton.style.cursor = 'pointer';

  // Add click listener to the button
  downloadAllButton.addEventListener('click', () => {
    const downloadButtons = document.querySelectorAll('svg.lucide.lucide-download.ml-1.cursor-pointer.text-primary');
    let delay = 150; // Delay between clicks, nessacary to prevent abuse of download backend

    downloadButtons.forEach(svg => {
      setTimeout(() => {
        const clickEvent = new MouseEvent('click', {
          view: window,
          bubbles: true,
          cancelable: true
        });
        svg.dispatchEvent(clickEvent);
      }, delay);

    });
  });
  let downloadButtonAdded = false;
  const intervalId = setInterval(() => {
    const targetDiv = document.querySelector('div.text-primary');

    if (targetDiv && !downloadButtonAdded) {
      targetDiv.appendChild(downloadAllButton);
      downloadButtonAdded = true;
      clearInterval(intervalId);
    }
  }, 500);
})();

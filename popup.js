document.addEventListener('DOMContentLoaded', function () {
  const showTranscriptButton = document.getElementById('showTranscript');
  const hideTranscriptButton = document.getElementById('hideTranscript');
  const copyTranscriptButton = document.getElementById('copyTranscript');

  copyTranscriptButton.addEventListener('click', copyTranscript);
  showTranscriptButton.addEventListener('click', showTranscript);
  hideTranscriptButton.addEventListener('click', hideTranscript);

  showTranscriptButton.addEventListener('click', () => {
    copyTranscriptButton.style.display = 'block';
  });

  hideTranscriptButton.addEventListener('click', () => {
    copyTranscriptButton.style.display = 'none';
  });
});

function hideMessage(messageElement, delay) {
  setTimeout(() => {
    messageElement.textContent = '';
  }, delay);
}

function showAndHideMessages(messageElement, message, delay) {
  messageElement.textContent = message;
  hideMessage(messageElement, delay);
}

function copyTranscript() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        const segmentsContainer = document.querySelector('#segments-container');
        if (segmentsContainer) {
          const transcriptElements = segmentsContainer.querySelectorAll('yt-formatted-string');
          const transcriptText = Array.from(transcriptElements).map(element => element.innerText).join('\n');
          return transcriptText;
        }
        return null;
      },
    }, function (result) {
      const transcriptText = result[0]?.result;

      if (transcriptText) {
        // Copy the transcriptText to the clipboard
        const textarea = document.createElement('textarea');
        textarea.value = transcriptText;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        // Display the copied text message in the popup
        const messageElement = document.getElementById('copyMessage');
        showAndHideMessages(messageElement, 'Transcript copied to clipboard.', 1500);
      }
    });
  });
}

function showTranscript() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        const transcriptPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
        if (transcriptPanel) {
          transcriptPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_EXPANDED');
          return true;
        }
        return false;
      },
    }, function (result) {
      const messageElement = document.getElementById('showTranscriptMessage');
      const message = result[0].result ? 'Transcript is now visible.' : 'Transcript is not available for this video.';
      showAndHideMessages(messageElement, message, 1500);

      // Hide copy button if no transcript available
      document.getElementById('copyTranscript').style.display = result[0].result ? 'block' : 'none';
    });
  });
}

function hideTranscript() {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const activeTab = tabs[0];

    chrome.scripting.executeScript({
      target: { tabId: activeTab.id },
      function: () => {
        const transcriptPanel = document.querySelector('ytd-engagement-panel-section-list-renderer[target-id="engagement-panel-searchable-transcript"]');
        if (transcriptPanel) {
          transcriptPanel.setAttribute('visibility', 'ENGAGEMENT_PANEL_VISIBILITY_HIDDEN');
          return true;
        }
        return false;
      },
    }, function (result) {
      if (result[0].result) {
        // Display the message in the popup
        const messageElement = document.getElementById('hideTranscriptMessage');
        showAndHideMessages(messageElement, 'Transcript is now hidden.', 1500);
      }
    });
  });
}
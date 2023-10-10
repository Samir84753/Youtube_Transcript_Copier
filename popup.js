document.addEventListener('DOMContentLoaded', function () {
  document.getElementById('copyTranscript').addEventListener('click', copyTranscript);
});

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
      },
    }, function (result) {
      const transcriptText = result[0].result;
      
      // Copy the transcriptText to the clipboard
      const textarea = document.createElement('textarea');
      textarea.value = transcriptText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);

      // Display the copied text message in the popup
      const messageElement = document.getElementById('copyMessage');
      messageElement.textContent = 'Transcript copied to clipboard.';
    });
  });
}

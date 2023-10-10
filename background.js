// background.js

// Listen for a message from the content script
chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'textCopied') {
      const transcriptText = message.transcriptText;
  
      // Display the message in the console (you can update this to show it in your popup or elsewhere)
      console.log('Text Copied:', transcriptText);
    }
  });
  
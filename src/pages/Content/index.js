// import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

// printLine("Using the 'printLine' function from the Print Module");
document.addEventListener('click', (event) => {
  const clickedElement = event.target;

  // Send a message to the background script with the clicked element
  chrome.runtime.sendMessage({
    action: 'elementClicked',
    element: clickedElement,
  });
});

chrome.runtime.sendMessage({ action: 'getAutocaptureState' }, (response) => {
  console.log(response);
  if (response && response.automated_capture) {
    //render dialog box
    const script = document.createElement('script');
    script.src = chrome.runtime.getURL('dialogbox.bundle.js');
    script.onload = async () => {
      script.remove(); // Clean up the injected script tag.
      const confirmButton = await document.getElementById('snapshot-capture');
      const snapshotNameInput = await document.getElementById(
        'snapshot-name-input'
      );
      confirmButton.addEventListener('click', () => {
        takeSnapshot(snapshotNameInput);
      });

      loopWithTimeouts(12, 1000);
    };
    document.head.appendChild(script);
  }
});

//check for snapshot timer
async function loopWithTimeouts(iterations, delay) {
  if (iterations <= 0) {
    console.log('Loop finished!');
    return; // Exit the loop when all iterations are done
  }

  // Your loop logic here...
  const snapshotTimer = await document.getElementById('snapshot-timer');
  const snapshotNameInput = await document.getElementById(
    'snapshot-name-input'
  );
  const snapshotDialog = await document.getElementById(
    'percy-dialog-container'
  );

  if (snapshotTimer.innerText === '0') {
    takeSnapshot(snapshotNameInput);
    snapshotDialog.style.display = 'none';
    return;
  }
  console.log('Iteration:', iterations);

  // Schedule the next iteration after the specified delay
  setTimeout(() => {
    loopWithTimeouts(iterations - 1, delay);
  }, delay);
}

// Function to send message to capture snapshot
function takeSnapshot(snapshotNameInput) {
  chrome.runtime.sendMessage({
    action: 'snapshot',
    name: snapshotNameInput.value,
  });
}

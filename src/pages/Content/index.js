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

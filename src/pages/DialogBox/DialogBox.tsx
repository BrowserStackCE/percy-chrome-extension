// dialogBox.tsx
import React, { useEffect, useState } from 'react';
import './dialogBox.css'; // Import the CSS file for styling (dialogBox.css).

const DialogBox: React.FC = () => {
  const [inputValue, setInputValue] = useState('Sample Text'); // Initial value for the input field.
  const [snapshotTimer, setSnashotTimer] = useState(3); // Initial value for the input field.
  const [isEditable, setIsEditable] = useState(false); // State to control the editable state.
  const [isDialogVisible, setIsDialogVisible] = useState(true); // State to control the visibility of the dialog.
  const [autocaptureMessageVisible, setAutocaptureMessageVisible] =
    useState(true);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
  };

  const handleEditClick = () => {
    setIsEditable(true);
  };

  const handleTickClick = () => {
    setIsDialogVisible(false);
    // Save the input value or perform any other actions.
  };

  const handleCancelClick = () => {
    setIsEditable(false);
    setIsDialogVisible(false); // Hide the dialog panel when the "Cancel" button is clicked.
    // Optionally, you can reset the input value if needed.
  };

  useEffect(() => {
    setInputValue(document.title);
  }, []);

  useEffect(() => {
    //SetInterval would be better here
    if (snapshotTimer > 0) {
      const timer = setTimeout(() => {
        setSnashotTimer((prevTimer) => prevTimer - 1);
      }, 1000);

      // Clear the timer when the component unmounts
      return () => clearTimeout(timer);
    }
  }, [snapshotTimer]);

  // useEffect(() => {
  //   if (snapshotTimer === 0) {
  //     setAutocaptureMessageVisible(false);
  //   }
  // }, [snapshotTimer]);

  return isDialogVisible ? (
    <div id="percy-dialog-container" className="dialog-container">
      <div className="message">Percy snapshot name:</div>
      <input
        id="snapshot-name-input"
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        readOnly={!isEditable} // Use readOnly attribute to make the input non-editable when isEditable is false.
        className={
          isEditable ? 'input-field-editable' : 'input-field-non-editable'
        }
        placeholder="Enter your text"
      />
      <div className="button-group">
        {isEditable ? (
          <></>
        ) : (
          <button
            id="edit-snapshot-name"
            className="icon-button edit-button"
            onClick={handleEditClick}
          >
            <span role="img" aria-label="edit-icon">
              ✏️
            </span>
          </button>
        )}
        <button
          id="snapshot-capture"
          className="icon-button confirm-button"
          onClick={handleTickClick}
        >
          <span role="img" aria-label="confirm-icon">
            ✅
          </span>
        </button>
        <button className="icon-button" onClick={handleCancelClick}>
          <span role="img" aria-label="cancel-icon">
            ❌
          </span>
        </button>
      </div>
      <div className="autocapture-message">
        Autocapturing snapshot in
        <div id="snapshot-timer">{snapshotTimer}</div>
      </div>
    </div>
  ) : null;
};

export default DialogBox;

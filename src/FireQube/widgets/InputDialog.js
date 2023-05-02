import React, { useState } from 'react';
import { Dialog } from 'react-bootstrap/Dialog';
import Button  from 'react-bootstrap/Button';
const InputDialog = ({ title, message, buttonText, onConfirm, visible, onHide }) => {
  const [inputValue, setInputValue] = useState('');

  const handleConfirmClick = () => {
    onConfirm(inputValue);
    setInputValue('');
    onHide();
  };

  const handleCancelClick = () => {
    setInputValue('');
    onHide();
  };

  const handleInputValueChange = (event) => {
    setInputValue(event.value);
  };

  return (
    <Dialog
      title={title}
      visible={visible}
      onHiding={onHide}
      showCloseButton={true}
      width={350}
    >
      <div className="form-group">
        <label>{message}</label>
        <input
          className="form-control"
          value={inputValue}
          onChange={handleInputValueChange}
        />
      </div>
      <div className="d-flex justify-content-end">
        <Button
          text={buttonText}
          type="success"
          onClick={handleConfirmClick}
          disabled={!inputValue}
        />
        <Button
          text="Cancel"
          onClick={handleCancelClick}
        />
      </div>
    </Dialog>
  );
};

export default InputDialog;
import React from 'react';
import ReactDOM from 'react-dom';
import DialogBox from './DialogBox';

const portalRoot = document.createElement('div');
document.body.appendChild(portalRoot);

ReactDOM.render(<DialogBox />, portalRoot);

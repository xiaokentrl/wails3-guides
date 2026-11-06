import React from 'react';
import { createRoot } from 'react-dom/client';
import '../../ui/tokens/tokens.css';
import '../../ui/playground/playground.css';

const root = document.getElementById('root');
window.addEventListener('error', (e) => {
  document.title = 'ERR: ' + e.message;
  root.innerHTML = '<pre style="color:#d64545;white-space:pre-wrap;padding:16px;font-family:monospace">' +
    (e.filename ? e.filename + ':' + e.lineno + '\n' : '') +
    'Error: ' + e.message + '\n' + (e.error && e.error.stack ? e.error.stack : '') + '</pre>';
});
window.addEventListener('unhandledrejection', (e) => {
  document.title = 'REJ: ' + ((e.reason && e.reason.message) || String(e.reason));
});

import('../../ui/playground/PlaygroundApp')
  .then((m) => {
    createRoot(root).render(React.createElement(m.PlaygroundApp));
  })
  .catch((err) => {
    document.title = '启动错误';
    root.innerHTML =
      '<pre style="color:#d64545;white-space:pre-wrap;padding:16px;font-family:monospace">启动错误:\n' +
      (err && err.stack ? err.stack : String(err)) +
      '</pre>';
  });

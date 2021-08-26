'use strict';

function saveOptions() {
  var token = document.getElementById('oauth_token').value;
  chrome.storage.sync.set({
    oauthToken: token
  }, function() {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    document.getElementById('oauth_token').value = '';
    setTimeout(function() {
      setTokenStatus(token);
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    oauthToken: ''
  }, function(items) {
      setTokenStatus(items.oauthToken);
  });
}

function setTokenStatus(token) {
    var status = document.getElementById('status');
    
    if (token !== '') {
        status.textContent = 'An OAuth Token is present.  Enter a new one (or blank) to overwrite.';
    }
    else {
        status.textContent = '';
    }
}

if (document) {
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('save').addEventListener('click',
      saveOptions);
}
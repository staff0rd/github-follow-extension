'use strict';

function saveOptions() {
  var token = document.getElementById('oauth_token').value;
  chrome.storage.sync.set({
    oauthToken: token
  }, function () {
    var status = document.getElementById('status');
    status.textContent = 'Options saved.';
    setTimeout(function () {
      status.textContent = '';
    }, 750);
  });
}

function restoreOptions() {
  chrome.storage.sync.get({
    oauthToken: ''
  }, function (items) {
    document.getElementById('oauth_token').value = items.oauthToken;
  });
}
document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('save').addEventListener('click', saveOptions);
//# sourceMappingURL=options.js.map

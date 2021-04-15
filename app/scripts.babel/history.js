'use strict';
/*jshint -W069 */
var oauthToken;
chrome.storage.sync.get({
    oauthToken: ''
}, function(items) {
    oauthToken = items.oauthToken;
    check();
});

document.addEventListener('DOMNodeInserted', nodeInsertedCallback);

var timeout;
function nodeInsertedCallback(event) {
	var id = $(event.relatedNode).attr('id');
	if (id === 'js-repo-pjax-container') {
		if (timeout){
			clearTimeout(timeout);
		}
    	timeout = setTimeout(check, 200);
	}
}

function check() {
	var split = $('title').text().split(' - ');
	var ownerRepo = split[1];
	var fileName = split[0].replace('History for ', '');
	var sha = $('clipboard-copy').last().attr('value');
	findMove(sha, fileName, ownerRepo);
}

function findMove(sha, fileName, ownerRepo) {
	var url = 'https://api.github.com/repos/:owner/:repo/commits/:sha'.replace(':sha', sha).replace(':owner/:repo', ownerRepo);
	get(url).done(function(data) {
		var file = findFile(data.files, fileName);
		console.log(file.status, fileName);
		if (file.status === 'renamed') {
			var previousFileName = file['previous_filename'];
			var parentSha = data.parents[0].sha;
			follow(parentSha, previousFileName, ownerRepo);
		}
	});
}

function follow(sha, fileName, ownerRepo) {
	var url = 'https://api.github.com/repos/:owner/:repo/commits?sha=:sha&path=:path'
		.replace(':owner/:repo', ownerRepo)
		.replace(':sha', sha)
		.replace(':path', fileName);

	get(url).done(function(data) {
		var fileSha = data[0].sha;
		var link = '/:owner/:repo/commits/:sha/:fileName'
			.replace(':owner/:repo', ownerRepo)
			.replace(':sha', fileSha)
			.replace(':fileName', fileName);

		// var iconUrl = chrome.extension.getURL('images/icon-16.png'); 
		// var style = '<style>.icon-follow { background-image: url(:iconUrl); background-position: center center; width:16px; height:16px; display: inline-block;</style>'
		// 	.replace(':iconUrl', iconUrl);

		var template = [
			'<div class="TimelineItem TimelineItem--condensed">',
			'<div class="TimelineItem-badge">',
            '<svg class="octicon octicon-git-commit" height="16" viewBox="0 0 16 16" version="1.1" width="16" aria-hidden="true"><path fill-rule="evenodd" d="M10.5 7.75a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm1.43.75a4.002 4.002 0 01-7.86 0H.75a.75.75 0 110-1.5h3.32a4.001 4.001 0 017.86 0h3.32a.75.75 0 110 1.5h-3.32z"></path></svg>',
          	'</div>',
			'<div class="TimelineItem-body">',
			'<h2 class="f5 text-normal">',
			'<strong>Renamed</strong> to :fileName',
			'<a class="btn right" href=":link">Follow</a>',
			'</h2>',
			'</div>',
			'</div>'
			].join('')
			.replace(':fileName', fileName)
			.replace(':link', link);

		$('.js-navigation-container.mt-3').append(template);
	});
}

function get(url) {

	var headers = {
	        'Accept':'application/vnd.github.v3+json'
	};

	if (oauthToken) {
		headers['Authorization'] = 'token ' + oauthToken;
	}

    return $.ajax({
	    type: 'GET',
	    url: url,
	    headers: headers
	});
}

function findFile(files, fileName) {
    for (var i = 0, len = files.length; i < len; i++) {
        if (files[i].filename === fileName) {
            return files[i];
        }
    }
    return null;
}
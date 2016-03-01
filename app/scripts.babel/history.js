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
	var sha = $('.commit-links-group:last button').attr('data-clipboard-text');
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

		var template = ['<div id="github-follow" class="commit-group-title"><span class="octicon octicon-git-commit"></span>'
				,'<strong>Renamed</strong> to :fileName <a class="btn right" href=":link">Follow</a></div>'
			].join('')
			.replace(':fileName', fileName)
			.replace(':link', link);

		$('.commits-listing').append(template);
	});
}

function get(url) {
    return $.ajax({
	    type: 'GET',
	    url: url,
	    headers: {
	        'Accept':'application/vnd.github.v3+json',
            'Authorization': 'token ' + oauthToken
	    }
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
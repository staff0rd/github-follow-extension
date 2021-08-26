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

const log = (message) => console.log(`[Follow for GitHub] ${message}`);

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
		log(`${fileName} was ${file.status}`);
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

		// Drive File Move from Material Design - https://fonts.google.com/icons?icon.query=move
		const moveIcon = 'M20,6h-8l-2-2H4C2.9,4,2,4.9,2,6v12c0,1.1,0.9,2,2,2h16c1.1,0,2-0.9,2-2V8C22,6.9,21.1,6,20,6z M20,18H4V6h5.17l1.41,1.41 L11.17,8H20V18z M12.16,12H8v2h4.16l-1.59,1.59L11.99,17L16,13.01L11.99,9l-1.41,1.41L12.16,12z';

		var template = [
			'<div class="TimelineItem TimelineItem--condensed">',
			'<div class="TimelineItem-badge" style="height: 14px">',
            `<svg class="octicon octicon-git-commit" style="margin-left: -20px;margin-top: -25px;" height="2" viewBox="0 0 2 2" version="1.1" width="2" aria-hidden="true"><path fill-rule="evenodd" d="${moveIcon}"></path></svg>`,
          	'</div>',
			'<div class="TimelineItem-body" style="margin-top:0">',
			'<h2 class="f5 text-normal">',
			'<strong>Renamed</strong> to :fileName',
			'<a class="btn" style="margin-left: 12px" href=":link">Follow</a>',
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
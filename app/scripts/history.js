'use strict';
/*jshint -W069 */

var commitList = $('.commits-listing');

var split = $('title').text().split(' - ');
var ownerRepo = split[1];
var fileName = split[0].replace('History for ', '');
var sha = $('.commit-links-group:last button').attr('data-clipboard-text');

findMove(sha, fileName);

function findMove(sha, fileName) {
	var url = 'https://api.github.com/repos/:owner/:repo/commits/:sha'.replace(':sha', sha).replace(':owner/:repo', ownerRepo);
	get(url).done(function (data) {
		var file = findFile(data.files, fileName);
		console.log(file.status, fileName);
		if (file.status === 'renamed') {

			var previousFileName = file['previous_filename'];
			var parentSha = data.parents[0].sha;
			commitList.append('<div class="commit-group-title"><span class="octicon octicon-git-commit"></span>Following rename to :rename</div>'.replace(':rename', previousFileName));
			follow(parentSha, previousFileName);
		}
	});
}

function follow(sha, fileName) {
	var url = 'https://api.github.com/repos/:owner/:repo/commits?sha=:sha&path=:path'.replace(':owner/:repo', ownerRepo).replace(':sha', sha).replace(':path', fileName);

	get(url).done(function (data) {
		console.log(data);
		$.each(data, function (index, value) {
			var date = value.commit.committer.date;
			commitList.append('<div class="commit-group-title"><span class="octicon octicon-git-commit"></span>Commits on :date</div>'.replace(':date', formatDate(date)));
			commitList.append(getCommitGroup(value));
		});
		var last = data[data.length - 1];
		findMove(last.sha, fileName);
	});
}

function getCommitGroup(data, fileName) {
	//console.log(data);
	return ['<ol class="commit-group table-list table-list-bordered">', '<li class="commit commits-list-item table-list-item js-navigation-item js-details-container js-socket-channel js-updatable-content" data-channel="@@channel" data-url="@@url">', '<div class="table-list-cell commit-avatar-cell">', '<div class="avatar-parent-child">', '<a href="/@@author" data-skip-pjax="true" rel="contributor"><img alt="@@@author" class="avatar" height="36" src="@@author-avatar&amp;s=72" width="36"></a>', '@@committer-avatar', '</div>', '</div>', '<div class="table-list-cell">', '<p class="commit-title ">', '<a href="/aspnet/Mvc/commit/@@sha" class="message" data-pjax="true" title="@@message">@@message-left</a>', '@@expander', '</p>', '<div class="commit-meta">', '<a href="/aspnet/Mvc/commits/dev/@@fileName?author=@@author" aria-label="View all commits by @@author-name" class="commit-author tooltipped tooltipped-s" rel="contributor">@@author</a>', ' authored <time datetime="@@authored is="relative-time" title="@@authored-title">@@authored-relative</time>', '@@committer-info', '</div>', '@@commit-desc', '</div>', '<div class="commit-links-cell table-list-cell">', '<div class="commit-links-group btn-group">', '<button aria-label="Copy the full SHA" class="js-zeroclipboard btn btn-outline zeroclipboard-button tooltipped tooltipped-s" data-clipboard-text="@@sha" data-copied-hint="Copied!" type="button"><span class="octicon octicon-clippy"></span></button>', '<a href="/aspnet/Mvc/commit/@@sha#diff-bb376303b1c9cd0a99e60f7c0d64b212" class="sha btn btn-outline">', '@@sha-sm', '</a>', '</div>', '<a href="/aspnet/Mvc/tree/@@sha/@@fileName" aria-label="Browse the repository at this point in the history" class="btn btn-outline tooltipped tooltipped-s" rel="nofollow"><span class="octicon octicon-code"></span></a>', '</div>', '</li>', '</ol>'].join('').replace(/@@fileName/g, fileName).replace('@@expander', getExpander(data.commit.message)).replace('@@sha-sm', data.sha.substr(0, 7)).replace(/@@sha/g, data.sha).replace('@@message-left', left(data.commit.message)).replace('@@message', data.commit.message).replace('@@commit-desc', getCommitDesc(data.commit.message)).replace('@@committer-avatar', getCommitterAvatar(data)).replace('@@committer-info', getCommitterInfo(data)).replace(/@@committer/g, data.committer.login).replace('@@author-avatar', data.author['avatar_url']).replace('@@authored-relative', formatDate(data.commit.author.date)).replace(/@@authored/g, data.commit.author.date).replace(/@@author/g, data.author.login);
	// @@channel aspnet/Mvc:commit:c713aa92cac3f60ea40a0e858941e10da5886b6f
	// @@url /aspnet/Mvc/commit/c713aa92cac3f60ea40a0e858941e10da5886b6f/show_partial?partial=commits%2Fcommits_list_item
	// @@authored-relative 8 days ago
	// @@authored-title 26 Sep 2015, 00:35 GMT+10
	// @@author-name Stefán Jökull Sigurðarson
	// @@committer-name Doug Bunting
}

var committerInfoTemplate = ['<span class="committer">', '<span class="octicon octicon-arrow-right"></span> <a href="/aspnet/Mvc/commits/dev/@@fileName?author=@@committer" aria-label="View all commits by @@committer-name" class="commit-author tooltipped tooltipped-s" rel="contributor">@@committer</a>', ' committed <time datetime="2015-09-29T16:53:48Z" is="relative-time" title="30 Sep 2015, 02:53 GMT+10">4 days ago</time>', '</span>'].join('');

function getCommitterInfo(data) {
	if (data.committer.login !== data.author.login) {
		console.log(data.commit.login, data.author.login);
		return committerInfoTemplate;
	}
	return '';
}

var committerAvatarTemplate = '<a href="/@@committer" data-skip-pjax="true" rel="contributor"><img alt="@@@committer" class="avatar-child" height="16" src="@@commiterAvatar&amp;s=32" width="16"></a>';

function getCommitterAvatar(data) {
	if (data.committer.login !== data.author.login) {
		return committerAvatarTemplate.replace('@@commiterAvatar', data.committer['avatar_url']).replace(/@@committer/g, data.committer.login);
	}
	return '';
}

var ellipsisLength = 69;
function left(str) {
	var lines = str.match(/[^\r\n]+/g);
	if (lines[0].length > ellipsisLength) {
		return lines[0].substr(0, ellipsisLength) + '…';
	} else {
		return lines[0];
	}
}

var commitDescTemplate = '<div class="commit-desc"><pre>@@message</pre></div>';
function getCommitDesc(str) {
	var message = right(str);
	if (message.length > 0) {
		return commitDescTemplate.replace('@@message', message);
	}
	return '';
}

var expanderTemplate = '<span class="hidden-text-expander inline"><a href="#" class="js-details-target">…</a></span>';
function getExpander(str) {
	if (right(str).length) {
		return expanderTemplate;
	}
	return '';
}

function right(str) {
	var lines = str.match(/[^\r\n]+/g);
	if (lines[0].length > ellipsisLength) {
		return '…' + lines[0].substr(ellipsisLength) + '\r\n\r\n' + joinLines(lines);
	}
	return joinLines(lines);
}

function joinLines(arr) {
	if (arr.length > 1) {
		var lines = [];
		for (var i = 1; i < arr.length; i++) {
			lines.push(arr[i]);
		}
		return lines.join('\r\n');
	}
	return '';
}

function get(url) {
	return $.ajax({
		type: 'GET',
		url: url,
		headers: {
			'Accept': 'application/vnd.github.v3+json'
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

var monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function formatDate(dateStr) {
	var date = new Date(dateStr);
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	return monthNames[monthIndex] + ' ' + day + ', ' + year;
}
//# sourceMappingURL=history.js.map

'use strict';

var commitList = $('.commits-listing');

var split = $('title').text().split(' - ');
var ownerRepo = split[1];
var fileName = split[0].replace('History for ', '');
var sha = $('.commit-links-group:last button').attr('data-clipboard-text');

findMove(sha, fileName);

function findMove(sha, fileName) {
	var url = 'https://api.github.com/repos/:owner/:repo/commits/:sha'.replace(':sha', sha).replace(':owner/:repo', ownerRepo);
	get(url).done(function(data) {
		var file = findFile(data.files, fileName);
		console.log(file.status, fileName);
		if (file.status === 'renamed') {
			var previousFileName = file['previous_filename'];
			var parentSha = data.parents[0].sha;
			commitList.append('<div class="commit-group-title"><span class="octicon octicon-git-commit"></span>Following rename to :rename</div>'
				.replace(':rename', previousFileName));
			//follow(parentSha, previousFileName);
		}
	});
}

function get(url) {
	return $.ajax({
	    type: 'GET',
	    url: url,
	    headers: {
	        'Accept':'application/vnd.github.v3+json'
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

var monthNames = [ 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec' ];

function formatDate(dateStr) {
	var date = new Date(dateStr);
	var day = date.getDate();
	var monthIndex = date.getMonth();
	var year = date.getFullYear();
	return (monthNames[monthIndex] + ' ' + day + ', ' + year);
}
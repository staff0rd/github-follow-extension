'use strict';

var commit = $('.commit-meta span:contains(parent) a');
var tooltip = 'rel="nofollow" aria-label="View the whole file at version @p"'.replace('@p', commit.text());
var button = '<a href="@link" class="btn btn-sm tooltipped tooltipped-n" @attr >Left</a>'.replace('@attr', tooltip);

$('.file-info a:contains(→)').each(function() { 
	var oldFile = $(this).attr('title').split(' → ')[0];
	var link = commit.attr('href').replace('commit', 'blob') + '/' + oldFile;
	var parent = $(this).parent().parent();

	parent.find('.file-actions a').text('Right');
	$(button.replace('@link', link)).insertAfter(parent.find('.show-file-notes'));
});
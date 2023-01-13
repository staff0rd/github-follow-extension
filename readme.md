# ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

**This extension is no longer needed**

Since [June 2022](https://github.blog/changelog/2022-06-06-view-commit-history-across-file-renames-and-moves/) GitHub have (finally!) implemented this feature themselves. This extension is no longer required.
# ⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️

<h2>Follow for Github</h2>

This extension currently:

- adds a _File moved_ line and _Follow_ button to Commit histories cut short by file movement and;
- changes the _View_ button into _Left_ and _Right_ buttons on diffs that are file movements.

<h4>Commit History</h4>

Clicking the _Follow_ button navigates to the commit history prior to the file rename.

<h4>Diffs</h4>

Clicking the _Left_ button will move you to the full file as it existed in its previous location in the parent commit. Clicking the _Right_ button does what the old _View_ button did, and moves you to the full file on the current commit.

Please let me know if you have any issues [here](https://github.com/staff0rd/github-follow-extension/issues/new).

<h2>Screenshots</h2>

![Commit History](https://raw.github.com/staff0rd/github-follow-extension/master/images/screenshot1.png)

![Commit Diffs](https://raw.github.com/staff0rd/github-follow-extension/master/images/screenshot2.png)

<h2>Installation</h2>

Via [Chrome Web Store](https://chrome.google.com/webstore/detail/github-follow/agalokjhnhheienloigiaoohgmjdpned)

<h2>Build</h2>

```
npm i -g grunt-cli@1.3.2 bower
bower install
grunt
```

<h2>Develop</h2>

In `chrome://extensions`, load an unpacked extension, browse to the `/app` directory in this repo.

Make your changes in `app/scripts.babel`. Running grunt in watch mode will have chrome auto-refresh the extension while you make changes;

```
grunt watch
```

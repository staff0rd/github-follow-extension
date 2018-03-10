<h2>Github Follow</h2>

This extension currently:

* adds a *File moved* line and *Folow* button to Comit histories cut short by file movement and;
* changes the *View* button into *Left* and *Right* buttons on diffs that are file movements.

<h4>Commit History</h4>
Clicking the *Follow* button navigates to the commit history prior to the file rename. 

<h4>Diffs</h4>
Clicking the *Left* button will move you to the full file as it existed in its previous location in the parent commit.  Clicking the *Right* button does what the old *View* button did, and moves you to the full file on the current commit.

Please let me know if you have any issues [here](https://github.com/staff0rd/github-follow-extension/issues/new).

<h2>Screenshots</h2>

![Commit History](https://raw.github.com/staff0rd/github-follow-extension/master/images/screenshot1.png)

![Commit Diffs](https://raw.github.com/staff0rd/github-follow-extension/master/images/screenshot2.png)

<h2>Installation</h2>

Via [Chrome Web Store](https://chrome.google.com/webstore/detail/github-follow/agalokjhnhheienloigiaoohgmjdpned)

<h2>Build</h2>

```
grunt
```

<h2>Develop</h2>

In `chrome://extensions`, load an unpacked extension, browse to the `/app` directory in this repo.

Make your changes in `app/scripts.babel`.  Running grunt in watch mode will have chrome auto-refresh the extension while you make changes;

```
grunt -watch
```

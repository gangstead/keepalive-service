# What to work on

- Many routes are stubbed out and/or tests are skipped.  Those are all fair game.
- There are also huge swaths of functionality that needs to be added like CI, code coverage, docs.  There might be an open `help wanted` issue.  If you'd like to claim something it can be assigned to you.
- If you are fixing a bug make sure an [issue](https://github.com/gangstead/keepalive-service/issues) is filed first.  You probably did find a bug, but sometimes bugs are just well disguised features so checking the issues first might save you a bunch of work.
- Related repos - in the future there will be related repos for a web app, mobile apps, integrations with other services.  If you have an idea let's work on it.

# How to contribute

A good pull request checks most of the boxes.  A great one checks all of them:
[ ] Pass lint rules - having a consistent coding style makes the project easier to grok and maintain.
[ ] Pass existing unit tests - don't break anything
[ ] Introduce new unit tests or enhance existing ones (and pass them) - **hint** write the tests first.  Make sure the code in it's current state fails the new tests you wrote before you write any new code.
[ ] Increase code coverage - code coverage doesn't prove your code works, but it's a good first move to at least run the code.  100% project code coverage may never happen, but aim for the horizon.
[ ] Update the README.  In almost every case, except maybe bug fixes, the docs should be updated.  A good README is the envy of many open source projects.
[ ] Be linked to an issue

Currently if you run the unit tests `npm run dcr test` it will also do the linting.  Coverage, Automated CI testing and other rules are in progress.

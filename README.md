# raffaelesgarro.github.io

This is the source code of the site [www.zybnet.com](http://www.zybnet.com)

# Development

This blog is developed with Hugo and uses the hyde-y theme. To start the server:

    hugo server -w

Note that the markdown sources are kept in the `src` branch of GitHub, becase
the content of `master` is served by GitHub Pages.

# Deployment

 1. Stop the development server
 2. Build the site with `hugo`
 3. Copy the `public` directory somewhere
 4. `git checkout -f master`
 5. Replace the content of the directory with the files in `public` and commit
 6. `git rebase -i --root`
 7. `git push -f origin master`

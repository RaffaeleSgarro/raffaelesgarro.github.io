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
 3. Move to the `public` directory and delete any `.git`
 4. `git init .`
 5. `git add .`
 6. `git commit -m "Deploy"`
 7. `git remote add origin git@github.com:RaffaeleSgarro/raffaelesgarro.github.io.git`
 8. `git push -f origin master`

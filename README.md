# raffaelesgarro.github.io

This is the source code of the site [www.zybnet.com](http://www.zybnet.com)

# Development

This blog is developed with [Hugo V.0.19](https://github.com/gohugoio/hugo/releases/tag/v0.19) and uses
the hyde-y theme. To start the server:

    hugo server -w

# Deployment

Source files are compiled to `public/` and deployed to GitHub Pages by a GitHub action so
just push your commit. Note that sources are kept in the `src` branch because the content
of `master` used to be served by GitHub Pages.

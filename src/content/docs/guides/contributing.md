---
title: Contributing guide
sidebar:
  label: Contributing
  order: 9
---

This guide outlines how to make contributions to this website.

## Technology

This website makes use of [Astro](https://docs.astro.build/) (a web framework) and [Starlight](https://starlight.astro.build/) (a documentation theme for Astro) to transform markdown and configuration files to a **static website**. A [GitHub action](.github/workflows/deploy.yml) will automatically rebuild this site on GitHub Pages for each commit on the `main` branch.

To preview this site locally, use:

- `npm install` to install dependencies.
- `npm run dev` to start a local development server at `localhost:4321` where you can preview the site.

See the file [astro.config.mjs](https://github.com/b-cubed-eu/documentation/blob/main/astro.config.mjs) for site-wide configuration.

## Updating a page

The site contains two types of pages/tutorials: **source pages** and **external pages**. They differ in the way they are updated.

### Source pages

Source pages are **maintained in the [GitHub repository](https://github.com/b-cubed-eu/documentation/)** of this website.

Follow these steps to update a source page:

1. Browse to the markdown file for the page (in [`src/content/docs/<page-type>/`](https://github.com/b-cubed-eu/documentation/tree/main/src/content/docs)). You can reach the markdown file directly by clicking the `Edit page` link at the bottom of every page on this website.
2. Make changes in the markdown file (either in your browser or locally).
3. Commit your changes to a new branch (and push).
4. Create a pull request and assign a reviewer.
5. Once accepted and merged, your changes will go live on this site.

Does your page contain images or data? Place them in `public/<page-type>/<name-of-page>/`. It's best to do this locally on your new branch. To refer to images in markdown, use:

```
![Short description](/<page-type>/<name-of-page>/<name-of-image>.png)
```

Source pages are licensed under a [Creative Commons Attribution 4.0 International License](https://creativecommons.org/licenses/by/4.0/).

### External pages

External pages are **maintained elsewhere**. They are added to the website to centralize B-Cubed documentation, with a semi-automated workflow that supports:

1. `README.md` files.
2. `README.Rmd` files.
3. Vignettes, i.e. R package tutorials maintained with their source code ([example](https://github.com/b-cubed-eu/gcube/blob/main/vignettes/articles/occurrence-process.Rmd)).
4. `rst` files.

Follow these steps to update an external page:

1. Clone this repository.
2. Check if vignette is listed in [`vignettes.yml`](https://github.com/b-cubed-eu/documentation/blob/main/src/external/vignettes.yml) (organized by R package). If not, add it (use the other vignettes as examples).
3. Open `documentation.Rproj` in R Studio.
4. Pull external files and create pages for this website:
    - For `rst` files only: Open [`rst_to_md.Rmd`](https://github.com/b-cubed-eu/documentation/blob/main/src/external/rst_to_md.Rmd) and run all code. This will create markdown files in `interim`.
    - For all files: Open [`rmd_to_md.Rmd`](https://github.com/b-cubed-eu/documentation/blob/main/src/external/rmd_to_md.Rmd), select the package and run all code. Thanks to [b3doc](https://b-cubed-eu.github.io/b3doc/), this will rebuild all vignettes and put the markdown and images files in the appropriate folders.
5. Check if you encountered any errors. If yes, fix and rebuild again.
6. Commit your changes to a new branch (and push).
7. Create a pull request and assign a reviewer.
8. Once accepted and merged, your changes will go live on this site.

Do you want to include an external page that is not a vignette? [Create an issue](https://github.com/b-cubed-eu/documentation/issues).

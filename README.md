# B-Cubed documentation website

[![repostatus](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Built with Starlight](https://astro.badg.es/v2/built-with-starlight/tiny.svg)](https://starlight.astro.build)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.19632903.svg)](https://doi.org/10.5281/zenodo.19632903)

This repository contains the source files for the [B-Cubed documentation website](https://docs.b-cubed.eu/).

## Repo structure

The repository structure is that of an Astro + Starlight project, with the following directories:

```
├── src/
│   ├── content/
│   │   └── docs/          : Source markdown files
│   ├── external/          : Scripts to create markdown files from external tutorials
│   │
│   ├── assets/            : Theme assets
│   ├── layouts/           : Theme layouts
│   └── styles/            : Theme style
│
└── public/                : Static files referenced in the markdown files (figures, data)
```

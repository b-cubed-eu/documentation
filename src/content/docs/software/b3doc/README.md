---
output: github_document
title: 'b3doc: Tools for the B-Cubed Documentation Website'
lastUpdated: 2025-08-19
sidebar:
  label: Introduction
  order: 1
source: https://github.com/b-cubed-eu/b3doc/blob/main/README.Rmd
---

<!-- README.md is generated from README.Rmd. Please edit that file -->





<!-- badges: start -->
[![repo status](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Release](https://img.shields.io/github/release/b-cubed-eu/b3doc.svg)](https://github.com/b-cubed-eu/b3doc/releases)
[![b3doc status
badge](https://b-cubed-eu.r-universe.dev/b3doc/badges/version)](https://b-cubed-eu.r-universe.dev/b3doc)
[![CRAN status](https://www.r-pkg.org/badges/version/b3doc)](https://CRAN.R-project.org/package=b3doc)
[![R-CMD-check](https://github.com/b-cubed-eu/b3doc/actions/workflows/R-CMD-check.yaml/badge.svg)](https://github.com/b-cubed-eu/b3doc/actions/workflows/R-CMD-check.yaml)
[![Codecov test coverage](https://codecov.io/gh/b-cubed-eu/b3doc/graph/badge.svg)](https://app.codecov.io/gh/b-cubed-eu/b3doc)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15649519.svg)](https://doi.org/10.5281/zenodo.15649519)
[![name status badge](https://b-cubed-eu.r-universe.dev/badges/:name?color=6CDDB4)](https://b-cubed-eu.r-universe.dev/)
<!-- badges: end -->

b3doc is an R package to create Markdown pages for the [B-Cubed documentation website](https://docs.b-cubed.eu) from external R Markdown files, such as vignettes. The package has functionality to set the necessary metadata in the front matter.

To get started, see:

- [Function reference](https://b-cubed-eu.github.io/b3doc/reference/index.html): overview of all functions.

## Installation

You can install the development version of b3doc from [GitHub](https://github.com/b-cubed-eu/b3doc) with:

``` r
# install.packages("remotes")
remotes::install_github("b-cubed-eu/b3doc")
```

## Usage

Here we use b3doc to read a [vignette](https://github.com/b-cubed-eu/gcube/blob/main/vignettes/articles/occurrence-process.Rmd), run its code and output a Markdown file:

``` r
library(b3doc)

# Load packages used in the Rmd file
library(sf)
library(dplyr)
library(ggplot2)
library(tidyterra)

# Convert Rmd to Markdown
rmd_to_md(
  rmd_file = "https://raw.githubusercontent.com/b-cubed-eu/gcube/refs/heads/main/vignettes/articles/occurrence-process.Rmd",
  md_dir = "output/src/content/docs/software/gcube",
  fig_dir = "output/public/software/gcube",
  fig_url_dir = "/software/gcube/",
  title = "2. Occurrence process",
  sidebar_label = "occurrence-process",
  sidebar_order = 2
)

# Clean up (don't do this if you want to keep your files)
unlink("output", recursive = TRUE)
```


In production, this code is run as part of a [script](https://github.com/b-cubed-eu/documentation/blob/main/src/rmd_to_md/rmd_to_md.Rmd) to update the [B-Cubed documentation website](https://docs.b-cubed.eu). Its static website generator then builds the site, using the metadata we provided (such as `sidebar_label`).

## Meta

- We welcome [contributions](https://b-cubed-eu.github.io/b3doc/CONTRIBUTING.html) including bug reports.
- License: MIT
- Get [citation information](https://b-cubed-eu.github.io/b3doc/authors.html#citation) for b3doc in R doing `citation("b3doc")`.
- Please note that this project is released with a [Contributor Code of Conduct](https://b-cubed-eu.github.io/b3doc/CODE_OF_CONDUCT.html). By participating in this project you agree to abide by its terms.

## Acknowledgments

This software was developed with funding from the European Union's Horizon Europe Research and Innovation Programme under grant agreement ID No [101059592](https://doi.org/10.3030/101059592).

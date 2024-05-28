---
title: R analysis code
parent: Software development guide
nav_order: 8
authors:
- name: Pieter Huybrechts
  orcid: 0000-0002-6658-6062
last_modified: 2024-02-29
---

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {:.text-delta}
- TOC
{:toc}
</details>

{:.important-title}
> B-Cubed software requirements
> 
> - R analysis code MUST adhere to the proposed directory structure.
> - Data files MUST be placed in the `data` directory in the applicable subdirectory `raw`, `interim` or `processed`.
> - Any included files MUST adhere to the tidyverse style guide [section on file names](https://style.tidyverse.org/files.html).
> - R code meant as an analysis workflow MUST be stored in `.Rmd` or `.R` format.

An important note is that most R analysis scripts could be wrapped as a package. This has many advantages:

- Packages provide a better structure.
- Packages are easier to install and use.
- Packages allow for better documentation.
- It is much easier for others to reuse your work.
- There are a lot of tools that can help you make your work more reproducible that work better in the context of an R package.
- Within B-Cubed and the wider R community there are people ready to help, so if you’ve been waiting for an opportunity to learn: this is it.

Creating an R package might seem like a huge step if you haven’t done it before, and while there is a learning curve, it really isn’t nearly as hard as it seems. All of this to say, please don’t be afraid to start an R package instead of an analysis script as part of your analysis workflow.

For more information on packages, refer to the [R packages](/dev-guide/r-packages/) chapter.

An R analysis script/project can be started from scratch via [usethis](https://usethis.r-lib.org/):


```r
usethis::create_project("myprojectname")
```

This automates a number of steps:

- It creates a new directory for your project to live in.
- It sets the [RStudio active project](/dev-guide/r/#rstudio-projects) to the new folder.
- It creates a new subdirectory `R/ `for R code to live in.
- It creates an `.Rproj` file.
- It adds `.Rproj.user` to `.gitignore`.
- And finally it opens your new project in a new RStudio window.

As a next step you could initiate git:

```r
usethis::use_git()
```

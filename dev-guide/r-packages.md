---
title: R packages
parent: Software development guide
nav_order: 7
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
> - R Packages MUST work on all major platforms: Windows, Linux and Mac.
> - R packages MUST include a `codemeta.json` in their repository.
> - R packages MUST pass R CMD CHECK without ERRORs.
> - Code included in a package MUST NOT use `print()` or `cat()`.
> - Exported functions in R packages MUST be covered by a `testthat` unit test.
> - The package title MUST be available on CRAN.
> - The title of an R package MUST be in Title Case and MUST NOT end in a period (`.`).
> - R packages MUST have a documentation website produced by [pkgdown](https://github.com/r-lib/pkgdown).
> - All authors MUST also include an ORCID identifier in the R authors `comment` field in the DESCRIPTION file.
> - The copyright holder (the institute that will be maintaining the software) MUST be added in the `Authors` field of the DESCRIPTION file.
> - The DESCRIPTION file MUST contain a URL in the `BugReports` field to the issues page of the repository.
> - All repositories that include R code MUST have at least one vignette with examples demonstrating its use.
> - Packages MUST NOT use `Depends` but instead MUST use `Imports` or `Suggests` to declare dependencies in the DESCRIPTION file.
> - When calling a function from a dependency, the dependency MUST be explicitly mentioned using `package::function()`.

Hadley Wickham and Jennifer Bryan have written an [excellent guide on R Packages](https://r-pkgs.org/), that comes highly recommended. This document goes through all the required steps to creating a package. More advanced is the R projects [manual on writing R extensions](https://cran.r-project.org/doc/manuals/r-release/R-exts.html). Hadley Wickham has included sections on functional and object oriented programming in his book [Advanced R](https://adv-r.hadley.nz) that might come in useful.

A lot of the tooling around R packages is also useful for R analysis code formatted as a script. However, while it might look intimidating at first, authoring an R package isn’t nearly as difficult as it might seem. Below there is an included example of R commands that set up an R package, and the required documentation, create a first function, tests for that function, update the documentation and run the package tests. All of this can be done equally well for a script, but this requires a lot more manual work.

```r
# Starting a minimal R package --------

## Setup everything we need in a single line, isn't usethis amazing?
usethis::create_package("packagename")

## We will be using GIT for our version control
usethis::use_git()

# Further repository setup according to guidelines  --------

## Add an MIT licence file
usethis::use_mit_license(copyright_holder = "institution name")

## Tell the world how to contribute
usethis::use_tidy_coc()
usethis::use_tidy_contributing()

## Write a README, in Rmd format if we want to show off our code
usethis::use_readme_rmd()
## Let's use github actions for some automation
usethis::use_github_action("check-standard", badge = TRUE)
usethis::use_github_action("test-coverage", badge  = TRUE)

# Let's write our first function --------

usethis::use_r("cool_function_name")

## And add a test for it too!
usethis::use_testthat()
usethis::use_test()

## Update the documentation
devtools::document()

## Run all the tests
devtools::test()
```

## Naming your package

Naming a package or analysis script can be difficult. rOpenSci offers [a number of recommendations](https://devguide.ropensci.org/pkg_building.html#naming-your-package) on this topic. To check if your package name is available, you can use the [available](https://r-lib.github.io/available/) package, which can also inform you about possible other interpretations of the name, including possibly offensive ones.

```r
available::available("mycoolpkgname")
```

Nick Tierney also gives [an interesting overview](https://www.njtierney.com/post/2018/06/20/naming-things/) of trends in naming packages. Yihui Xie makes [an excellent case](https://yihui.org/en/2017/12/typing-names/) for easy to type names without too many case changes.

## Creating metadata for your package

[The codemeta project](https://codemeta.github.io/) defines a metadata file: codemeta.json (in JSON-LD format) that helps machines interpret information about your package. This is useful because it can ease the attribution, discoverability and reuse of your code beyond the tools already present in the R ecosystem. A `codemeta.json` makes it more likely someone will find your software who doesn’t know where to look for it, and that you’ll get credit for it when it is reused by allowing different metadata standards to be translated into each other via codemeta. The [codemeta project](https://codemeta.github.io/) makes [a strong case](https://codemeta.github.io/) for its inclusion in repositories. [And so does rOpenSci](https://docs.ropensci.org/codemetar/index.html#why-create-a-codemetajson-for-your-package).

Creating such a file is also very easy as it can be generated from the information already present in your README, DESCRIPTION and CITATION files. From the root of your package run:

```r
codemetar::write_codemeta()
```

## Console messages

Sometimes a package needs to communicate directly with its user, this is usually done through either `message()`, `warning()` or `stop()`. The [rOpenSci Packages guide](https://devguide.ropensci.org/pkg_building.html#console-messages) advises against using `print()` or `cat() `because these kinds of messages are much more difficult for the user to suppress. Additionally, these kinds of messages are also more difficult to write good tests for.

Apart from base R, the package [cli](https://cli.r-lib.org/) comes recommended for its many useful tools regarding good looking command line interfaces. Functions from cli also offer some advantages when used in assertions within functions over the popular [assertthat](https://github.com/hadley/assertthat) and `stopifnot()` from base. Please refer to the documentation of `cli_abort()` [here](https://cli.r-lib.org/reference/cli_abort.html). A practical example of how you could use cli instead of assertthat can be observed in [this commit](https://github.com/frictionlessdata/frictionless-r/commit/aad0cd8e894a5a556d2a197348ba9169c267a55b) on the [frictionless](https://docs.ropensci.org/frictionless/) R package.

## README

For general instructions, see [the README file](/dev-guide/the-readme-file/) chapter. The README file for R packages largely takes the same form as the one required for all repositories. Additionally, a number of useful tools are available to you as a developer to create a great README.

If you don’t have a README yet, you can create one with [usethis](https://usethis.r-lib.org/reference/use_readme_rmd.html):

```r
usethis::use_readme_md()
```

If you want to include code and its output in your REAMDE, you can instead create a `README.Rmd` in R markdown, and then render that to a traditional `README.md` file. Again, you can create one with [usethis](https://usethis.r-lib.org/reference/use_readme_rmd.html):

```r
usethis::use_readme_rmd()
```

This will not only create a `README.Rmd`, but also add some lines to `.Rbuildignore` and create a Git pre-commit hook to help remind you to keep `README.Rmd` and `README.md` synchronized. After you’ve made changes to `README.Rmd`, remember to update `README.md` by running:

```r
devtools::build_readme()
```

### Adding badges to the README file

[Usethis](https://usethis.r-lib.org/) includes [some useful functions](https://usethis.r-lib.org/reference/badges.html) you can use to add badges to your README file, for example for [the lifecycle](https://lifecycle.r-lib.org/articles/stages.html) of your software:

```r
usethis::use_lifecycle_badge(stage = "stable")
```

Some [other functions](https://usethis.r-lib.org/reference/use_github_action.html) within [usethis](https://usethis.r-lib.org/) will also allow you to add a badge to your README, for example you can advertize your code coverage using the test-coverage action:

```r
usethis::use_github_action("test-coverage", badge = TRUE)
```

## Documentation website

A documentation website allows (potential) users to learn about your package and its functionality without having to install it first. Luckily, prior knowledge of web development is not needed to create a documentation website for R packages. It can be generated automatically with  [pkgdown](https://github.com/r-lib/pkgdown), which will pull the information you already included in the [README file](/dev-guide/the-readme-file/) and [function documentation](/dev-guide/r-functions/#documenting-functions). [The introduction page](https://pkgdown.r-lib.org/articles/pkgdown.html) of pkgdown describes its basic use (the documentation website of pkgdown was created with pkgdown). Here’s how to get started:

```r
# Run once to configure package to use pkgdown
usethis::use_pkgdown()
# Run to build the website
pkgdown::build_site()
```

By default, your website will include a homepage and a function reference, but there are several more pages you can add. The most useful ones are articles (called “vignettes”) to explain a certain functionality or workflow in a more tutorial-like fashion:

```r
# Create a vignette
usethis::use_vignette("vignette-title")
```

Since vignettes are included in the source code, users can also consult them when offline (in RStudio):

```r
# Loading a vignette from dplyr (works offline too)
library(dplyr)
vignette("in-packages")
# This is the same page as https://dplyr.tidyverse.org/articles/in-packages.html
```

Since we are using GitHub to host our code, deploying a website is fairly straightforward:

```r
usethis::use_pkgdown_github_pages()
```

Neal Richardson posted a step by step guide on using pkgdown [on his website](https://enpiar.com/2017/11/21/getting-down-with-pkgdown/). rOpenSci also offers some guidance in their [chapter on pkgdown](https://devguide.ropensci.org/pkg_building.html#website).

## DESCRIPTION and authorship

The `DESCRIPTION` file includes, among others things, a list of all authors and contributors to the package. Apart from information about the authors, it also includes vital metadata about the version, licence and purpose of the included code. This file thus forms an important piece of metadata for the code it describes. This is also another place to refer to any external resources, such as the github repository where users can file bug reports or URLs to any external web APIs that may be called.

To uniquely identify the contributors to the software, it is very useful to include ORCID identifiers under the Authors in the description. The benefits of which are described on [this rOpenSci blog post](https://ropensci.org/blog/2018/10/08/orcid/). An example:


```r
Authors@R: person(
  "Pieter", "Huybrechts",
  email = "pieter.huybrechts@inbo.be",
  role = c("aut", "cre"),
  comment = c(ORCID = "0000-0002-6658-6062")
)
```

Further guidance on editing `DESCRIPTION` files can be found in the [chapter on package metadata](https://r-pkgs.org/description.html) in the R Packages book. A more detailed overview can be found in the R project [manual on writing R extensions](https://cran.rstudio.com/doc/manuals/r-release/R-exts.html#The-DESCRIPTION-file).

## CITATION

R packages commonly include a `CITATION` file (no extension) that provides information about how the package should be cited. See the [CITATION file section](https://devguide.ropensci.org/pkg_building.html#citation-file) in the rOpenSci Packages guide for guidance. This file can be created with:

```r
usethis::use_citation()
```

And users can retrieve its information with:

```r
citation("package-name")
```

All repositories MUST also include a `CITATION.cff` file (see [Add a CITATION.cff file](/dev-guide/code-repositories/#add-a-citationcff-file)). You can keep it in sync with the `CITATION` file using a [GitHub action](https://docs.ropensci.org/cffr/reference/cff_gha_update.html) provided by the [cffr](https://docs.ropensci.org/cffr/) package.

rOpenSci offers a useful [blog post](https://ropensci.org/blog/2021/11/16/how-to-cite-r-and-r-packages/) on how to cite R and R packages that is a good read for both software authors and users.

## LICENSE

As described in the [Create a repository](/dev-guide/code-repositories/) chapter, all software produced in the context MUST be licenced under the [MIT licence](https://mit-license.org/). The copyright holder of the software will be the institution that will be maintaining the package, not the authors of the package.

Adding this LICENSE file is easy with [usethis](https://usethis.r-lib.org/) (take care to immediately set the copyright holder, as it will default to the package authors):

```r
usethis::use_mit_license(copyright_holder = "institution name")
```

This function will also set the `License` field in the [DESCRIPTION file](#description-and-authorship). For more information on package licensing, refer to the [section on licensing](https://r-pkgs.org/license.html) in the R Packages book.

## Examples

Examples show users how to use your software, and will often be the first thing people look at when they have trouble reusing your code. Thus including them not only fills an educational niche, but also provides a nice piece of documentation.

All functions intended to be used by users (i.e. public functions) MUST have an example in their [roxygen2](https://roxygen2.r-lib.org/) documentation. But even for analysis code or workflows, including an example can be very helpful. More complex examples (or example workflows) SHOULD be included in a vignette. Every  repository that contains R code MUST at least have one vignette.

Creating a vignette is automated by [usethis](https://usethis.r-lib.org/), Keep in mind this will not work if you don’t have a [DESCRIPTION file](#description-and-authorship):

```r
usethis::use_vignette("vignette-title")
```

## Dependencies

Dependencies are other packages your package relies on. Those need to be defined in the [DESCRIPTION file](#description-and-authorship), so that they are automatically installed when a user instals your package. You can use [usethis](https://usethis.r-lib.org/) to add a dependency to your DESCRIPTION:

```r
usethis::use_package("package-to-depend-on")
```

This will add a package to the `Imports` section of the DESCRIPTION file. The function also allows you to set it to `Suggests` instead, or to declare a minimum package version. Declaring a minimum version of a dependency isn’t usually necessary and should only be done as a continuous choice. For more guidance on the tradeoffs and decisions around dependencies, read [the section on package dependencies](https://devguide.ropensci.org/pkg_building.html#pkgdependencies) in the rOpenSci Packages guide.

The difference between `Imports` and `Depends` is that while both are installed together with the package, `Depends` are also attached to the global environment, thus opening the door to all kinds of trouble. For example, if your package `Depends` on [dplyr](https://dplyr.tidyverse.org/) it will overwrite the stats function `filter()` which is loaded by default, because [dplyr](https://dplyr.tidyverse.org/) includes a `filter()` of its own. This kind of namespace conflict should be handled with caution, and avoided whenever possible. Code written by the user should behave as they expect, regardless of the order in which they load packages. Dependencies declared in `Imports` are not attached, thus avoiding this problem entirely. This principle and several other good practices are described in the [section on package dependencies](https://devguide.ropensci.org/pkg_building.html#pkgdependencies) in the rOpenSci Packages guide.

When calling a function from a dependency, the dependency MUST be explicitly mentioned using `package::function()`. This makes it easier for collaborators to understand your code and it helps when searching for functions of a specific dependency:


```r
# Bad
my_function <- function(file) {
  read_csv(file)
}

# Good
my_function <- function(file) {
  readr::read_csv(file)
}
```

For dependency recommendations, see the [dependencies section](/dev-guide/r/#dependencies) in the R chapter.

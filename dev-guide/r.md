---
title: R
authors:
- name: Pieter Huybrechts
  orcid: 0000-0002-6658-6062
last_modified: 2024-02-28
---

{:.important-title}
> B-Cubed software requirements
> 
> - R code MUST be placed in the `R/` directory of the repository.
> - Data files included in the repository MUST be placed in the `data/` directory.
> - Repositories containing R code MUST include a project file (file with `.Rproj` extension) in the root.
> - R code MUST refer to files using relative paths and MUST NOT use absolute paths.
> - R code MUST NOT make use of the packages [sp](https://cran.r-project.org/package=sp), [rgdal](https://cran.r-project.org/package=rgdal), [maptools](https://cran.r-project.org/package=maptools), [raster](https://rspatial.org/raster/pkg/1-introduction.html) or [rgeos](https://cran.r-project.org/package=rgeos) but SHOULD use [sf](https://r-spatial.github.io/sf/) and/or [terra](https://rspatial.github.io/terra/reference/terra-package.html).
> - R code MUST follow the [rOpenSci recommendations regarding commonly used dependencies](https://devguide.ropensci.org/pkg_building.html#recommended-scaffolding).
> - Dependencies on other packages MUST be declared in a DESCRIPTION file.
> - R code MUST follow the [tidyverse style guide](https://style.tidyverse.org/).
> - R code MUST NOT make use of the right side assignment operator `->`.
> - All R code MUST reach a test coverage of at least 75% calculated using [covr](https://covr.r-lib.org/).
> - Unit tests MUST be implemented using the [testthat](https://testthat.r-lib.org/) package.
> - Shiny apps SHOULD make use of [shinytest](https://rstudio.github.io/shinytest/).
> - Unit tests MUST include the name of the R file they are testing.

R is a programming language for statistical computing and data visualization.

- General guidance on how to use and write R can be found in [Adler (2012)](https://www.oreilly.com/library/view/r-in-a/9781449358204/) and [Crawley (2012)](https://doi.org/10.1002/9781118448908).
- For [R packages](/dev-guide/r-packages/), we refer to the [rOpenSci Packages guide](https://devguide.ropensci.org/) ([rOpenSci 2021](https://doi.org/10.5281/zenodo.6619350)).
- For [analysis code](/dev-guide/r-analysis-code/), we refer to the Software Carpentry’s [fundamentals for reproducible scientific analysis in R](https://swcarpentry.github.io/r-novice-gapminder/) ([Zimmerman et al. 2019](http://doi.org/10.5281/zenodo.3265164)). More resources are listed on [AGU’s Introduction to Open Science](https://data.agu.org/resources/introduction-to-open-science-agu). The British Ecological Society [guide on reproducible code](https://www.britishecologicalsociety.org/wp-content/uploads/2019/06/BES-Guide-Reproducible-Code-2019.pdf) and [Stoudt et al. (2021)](https://doi.org/10.1371/journal.pcbi.1008770) list principles, while [Sandve et al. 2013](https://doi.org/10.1371/journal.pcbi.1003285) has rules for reproducible data analysis. Specifically for Data Science we recommend [R for Data Science](https://r4ds.hadley.nz/).
- For more information on the use of RMarkdown, see [R Markdown: The Definitive Guide](https://bookdown.org/yihui/rmarkdown/) and [Guidance for AGU Authors: R Script(s)/Markdown](https://data.agu.org/resources/r-guidance-agu-authors).

## RStudio projects

R code is run in a specific context, with an associated working directory, history, etc. If that context is undefined or too broad, it can create conflicts between projects or make it hard for others to run your code.

To solve this, software MUST make the context explicit by including an [RStudio project](https://support.posit.co/hc/en-us/articles/200526207-Using-RStudio-Projects) file (file with `.Rproj` extension) in the root of the repository to make the context explicit. This file will set your and everyone’s working directory at the root of the repository. In addition, software MUST only use relative paths starting at that project root to refer to files and MUST NOT use absolute paths. The implications of using absolute paths are described in the British Ecological Society [guide on reproducible code](https://www.britishecologicalsociety.org/wp-content/uploads/2018/12/BES-Reproducible-Code.pdf). R code should strive to be as portable as possible, for example by never referring to a drive letter, network location or storage mounting point.

Further benefits of RStudio Projects are described in [this section](https://r-pkgs.org/workflow101.html#benefits-of-rstudio-projects) of the R Packages book. Software carpentry provides [a guide on project management with Rstudio](https://swcarpentry.github.io/r-novice-gapminder/02-project-intro.html).

## Dependencies

Please refer to the [rOpenSci recommendations](https://devguide.ropensci.org/pkg_building.html#pkgdependencies) regarding dependencies.

Some recommendations for common use cases:

- HTTP requests: [httr2](https://httr2.r-lib.org/), [curl](https://jeroen.r-universe.dev/curl), [crul](https://docs.ropensci.org/crul/)
- Parsing JSON: [jsonlite](https://arxiv.org/abs/1403.2805)
- Parsing XML: [xml2](https://xml2.r-lib.org/)
- Spatial data: [sf](https://r-spatial.github.io/sf/), do note that [rgdal](https://cran.r-project.org/web/packages/rgdal/index.html), [rgeos](https://cran.r-project.org/web/packages/rgeos/index.html) and [maptools](https://cran.r-project.org/web/packages/maptools/index.html) are being deprecated, we thus advise against using [sp](https://cran.r-project.org/package=sp). [terra](https://rspatial.github.io/terra/reference/terra-package.html) is preferred over [raster](https://rspatial.org/raster/pkg/1-introduction.html), as it is being retired (see this [blogpost](https://www.r-bloggers.com/2023/06/upcoming-changes-to-popular-r-packages-for-spatial-data-what-you-need-to-do/)). More information about the migration can be found on the [r-spatial website](https://r-spatial.org/r/2023/04/10/evolution3.html), and [this blogpost](https://r-spatial.org/r/2022/04/12/evolution.html) about the retirement of [sp](https://cran.r-project.org/package=sp), [rgdal](https://cran.r-project.org/package=rgdal), [maptools](https://cran.r-project.org/package=maptools) and [rgeos](https://cran.r-project.org/package=rgeos).

In general it is recommended to use packages from the tidyverse over base R functions in cases where the tidyverse alternative has significant advantages. For example the case of `readr::read_csv()` over `base::read.table()`. The [readr](https://readr.tidyverse.org/) alternative is faster, has better error handling, and is easier to use. However, certainly [a case](https://recology.info/2018/10/limiting-dependencies/) can be made for having as few dependencies as possible, and wrapping your own functions around base to get around certain limitations. The question on when exactly you should take a dependency, depends on the context. The [R Packages book](https://r-pkgs.org/dependencies-mindset-background.html#sec-dependencies-pros-cons) offers some guidance in this matter. Jeff Leek has written a blog post on his decision process: [How I decide when to trust an R package](https://simplystatistics.org/posts/2015-11-06-how-i-decide-when-to-trust-an-r-package/) and the tidyverse makes [a case](https://www.tidyverse.org/blog/2022/09/playing-on-the-same-team-as-your-dependecy/) for not using internal functions from dependencies.

Adding a dependency to your `DESCRIPTION` file is easy using [usethis](https://usethis.r-lib.org/):

```r
usethis::use_package("dplyr")
```

Refer to the [rOpenSci recommendations](https://devguide.ropensci.org/pkg_building.html#recommended-scaffolding) for common scaffolding for more suggestions.

## Code style

> Good coding style is like correct punctuation: you can manage without it, butitsuremakesthingseasiertoread. — R for Data Science

A number of useful packages exist to help you stick to the tidyverse style. To automatically modify your code to adhere to the recommendations, you can make use of [styler](https://github.com/r-lib/styler) which also exists as a plug-in for RStudio. To check your code for issues, you can use a liter, a popular choice for R is [lintr](https://lintr.r-lib.org/). More information regarding code style can be found in the rOpenSci Packages guide in the [section on code style](https://devguide.ropensci.org/pkg_building.html#code-style), the [tidyverse style guide](https://style.tidyverse.org/). Hadley Wickham also offers some insight in his [workflow](https://r4ds.hadley.nz/workflow-style) when it comes to code style.

## Testing

Have you ever written any code that turned out to not really do what you wanted it to do? Made a change to a helper function that introduced bugs in other functions or scripts using it? Or found yourself running the same little ad hoc tests in the console time and time again to see if a function is behaving as expected? These are all signs that you could benefit from using automated testing.

By writing tests that check the major functionality of your software, you are ensuring that changes along the line don’t break existing functionality. And that updates to underlying dependencies didn’t have unexpected consequences.

A general overview of the how and why of testing R code is found in R Packages book chapter [testing basics](https://r-pkgs.org/testing-basics.html). The rOpenSci Packages guides offers some helpful advice regarding tests in the [section on testing](https://devguide.ropensci.org/pkg_building.html#testing). Other interesting resources include [the blogpost](https://mtlynch.io/good-developers-bad-tests/) by Michael Lynch on why good developers write bad tests, the documentation of [testthat](https://testthat.r-lib.org/) and [covr](https://covr.r-lib.org/). And rOpenSci also offers a [book on HTTP testing](https://books.ropensci.org/http-testing/). For more information on unit testing in general, you might find "Unit Testing Principles, Practices, and Patterns" by [Khorikov (2020)](https://www.manning.com/books/unit-testing) a good resource.

### Using testthat in practise

Start using testthat for an existing R project by running:

```r
usethis::use_testthat()
```

Which will create `⁠tests/testthat/`⁠ and `tests/testthat.R`, and adds the [testthat](https://testthat.r-lib.org/) package to the `Suggests` field.

Creating a test for an existing function is automated via [usethis](https://usethis.r-lib.org/):

```r
# Explicitly refer to the file we want to test
usethis::use_test("filename_to_test")

# Or automatically if the file is already open and active in Rstudio
usethis::use_test()
```

While it is a good idea to regularly run your tests locally, it is also a good idea to automate this in the form of continuous integration:

```r
# Runs R CMD CHECK which includes running all tests
usethis::use_github_action("check-standard")

# Calculate the code coverage and report
usethis::use_github_action("test-coverage")
```

You can also add badges to your README page to signal your `R CMD CHECK` status (which includes your unit tests) and test coverage:

```r
usethis::use_github_action("check-standard", badge = TRUE)
usethis::use_github_action("test-coverage", badge = TRUE)
```

Tests can then be run by:

```r
# For a package
devtools::test()

# Or else, make sure your functions are loaded and then
testthat::test_dir("tests/testthat")
```

### Testing figures and plots

The goal of unit testing is to compare the output of a function to some expectation or expected value, however, for some outputs this isn’t very practical. One example is binary outputs such as figures or plots. While [testthat](https://testthat.r-lib.org/) offers a solution for this in the form of [snapshots](https://testthat.r-lib.org/articles/snapshotting.html) (and this is certainly a very powerful and useful feature), these snapshot tests are very sensitive to minute changes.

[vdiffr](https://vdiffr.r-lib.org/) is a package that forms an extension to [testthat](https://testthat.r-lib.org/), it converts your visual outputs to reproducible svg files that are then compared as [testthat](https://testthat.r-lib.org/) snapshots. This offers some relief, but might still result in false positive test failures. After all, if your plotting library changes its rendering slightly, the test will fail.

A final option is to use a public accessor of your plotting library, for example [ggplot2](https://ggplot2.tidyverse.org/) offers [a number](https://ggplot2.tidyverse.org/reference/ggplot_build.html?q=layer_data#details) of these assessors that allow you to test specific parts of every layer. [This post](https://www.tidyverse.org/blog/2022/09/playing-on-the-same-team-as-your-dependecy/#testing-testing) on the tidyverse blog offers more insight on why you might want to go about testing this way.

## Check your R code

There are several packages to check how well your R code is following best practices (from which many of the requirements in this document are derived):

- [pkgcheck](https://docs.ropensci.org/pkgcheck/): follows rOpenSci recommendations.
- [checklist](https://inbo.github.io/checklist/): works for R packages and analyses, follows INBO recommendations.
- [lintr](https://lintr.r-lib.org/): performs [static code analysis](https://en.wikipedia.org/wiki/Static_program_analysis) to highlight possible problems, including good practises and syntax.
- [styler](https://style.tidyverse.org/): can automatically format code according to the tidyverse style guide.
- [goodpractice](http://mangothecat.github.io/goodpractice/) informs about different good practices for packages.
- [dupree](https://russhyde.github.io/dupree/) identifies sections of code that are very similar or repeated.

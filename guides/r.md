---
title: R
parent: Guides
nav_order: 5
authors:
- name: Pieter Huybrechts
  orcid: 0000-0002-6658-6062
last_modified_date: 2024-02-28
---

# R
{: .no_toc }

Lead author: Pieter Huybrechts

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

{: .important-title }
> B-Cubed software requirements
> 
> - R code MUST be placed in the `R/` directory of the repository.
> - Data files included in the repository MUST be placed in the `data/` directory.
> - Repositories containing R code MUST include a project file (file with `.Rproj` extension) in the root.
> - R code MUST refer to files using relative paths and MUST NOT use absolute paths.
> - R code MUST NOT make use of the packages [sp](https://cran.r-project.org/package=sp), [rgdal](https://cran.r-project.org/package=rgdal), [maptools](https://cran.r-project.org/package=maptools), [raster](https://rspatial.org/raster/pkg/1-introduction.html) or [rgeos](https://cran.r-project.org/package=rgeos) but SHOULD use [sf](https://r-spatial.github.io/sf/) and/or [terra](https://rspatial.github.io/terra/reference/terra-package.html).
> - R code MUST follow the [rOpenSci recommendations regarding commonly used dependencies](https://devguide.ropensci.org/building.html#recommended-scaffolding).
> - Dependencies on other packages MUST be declared in a DESCRIPTION file.
> - R code written MUST follow [the tidyverse style guide](https://style.tidyverse.org/).
> - R code MUST NOT make use of the right side assignment operator `-->`.
> - All R code MUST reach a test coverage of at least 75% calculated using [covr](https://covr.r-lib.org/).
> - Unit tests MUST be implemented using the [testthat](https://testthat.r-lib.org/) package.
> - Shiny apps SHOULD make use of [shinytest](https://rstudio.github.io/shinytest/).
> - Unit tests MUST include the name of the R file they are testing.

R is a programming language for statistical computing and data visualization.

- General guidance on how to use and write R can be found in [Adler (2010)][adler_2010] and [Crawley (2012)][crawley_2010].
- For [R packages](/r-packages/), we refer to the [rOpenSci guide](https://devguide.ropensci.org/) ([rOpenSci 2021][ropensci_2021]).
- For [analysis code](/r-analysis-code/), we refer to the Software Carpentry’s [fundamentals for reproducible scientific analysis in R](https://swcarpentry.github.io/r-novice-gapminder/) ([Zimmerman et al. 2019][zimmerman_2019]). More resources are listed on [AGU’s Introduction to Open Science](https://data.agu.org/resources/introduction-to-open-science-agu). A number of publications list principles ([Stoudt et al. 2021][stoudt_2021], [BES 2017][bes_2017]) and rules ([Sandve et al. 2013][sandve_2013]) for reproducible data analysis. Specifically for Data Science we recommend [R for Data Science](https://r4ds.hadley.nz/) ([Wickham et al. 2023][wickham_2023]).
- For more information on the use of RMarkdown, see [R Markdown: The Definitive Guide](https://bookdown.org/yihui/rmarkdown/) ([Xie et al. 2018][xie_2018]) and [Guidance for AGU Authors: R Script(s)/Markdown](https://data.agu.org/resources/r-guidance-agu-authors).

## RStudio projects

R code is run in a specific context, with an associated working directory, history, etc. If that context is undefined or too broad, it can create conflicts between projects or make it hard for others to run your code.

To solve this, software MUST make the context explicit by including an [RStudio project](https://support.posit.co/hc/en-us/articles/200526207-Using-RStudio-Projects) file (file with `.Rproj` extension) in the root of the repository to make the context explicit. This file will set your and everyone’s working directory at the root of the repository. In addition, software MUST only use relative paths starting at that project root to refer to files and MUST NOT use absolute paths. The implications of using absolute paths are described in the British Ecological Society [guide on reproducible code](https://www.britishecologicalsociety.org/wp-content/uploads/2018/12/BES-Reproducible-Code.pdf) ([BES 2017][bes_2017]). R code should strive to be as portable as possible, for example by never referring to a drive letter, network location or storage mounting point.

Further benefits of RStudio Projects are described in [this section](https://r-pkgs.org/workflow101.html#benefits-of-rstudio-projects) of the R Packages book. Software carpentry provides [a guide on project management with Rstudio](https://swcarpentry.github.io/r-novice-gapminder/02-project-intro.html).

## Dependencies

Please refer to the [rOpenSci recommendations](https://devguide.ropensci.org/building.html#pkgdependencies) regarding dependencies.

Some recommendations for common use cases:

- HTTP requests: [httr2](https://httr2.r-lib.org/), [curl](https://jeroen.r-universe.dev/curl), [crul](https://docs.ropensci.org/crul/)
- Parsing JSON: [jsonlite](https://arxiv.org/abs/1403.2805)
- Parsing XML: [xml2](https://xml2.r-lib.org/)
- Spatial data: [sf](https://r-spatial.github.io/sf/), do note that [rgdal](https://cran.r-project.org/web/packages/rgdal/index.html), [rgeos](https://cran.r-project.org/web/packages/rgeos/index.html) and [maptools](https://cran.r-project.org/web/packages/maptools/index.html) are being deprecated, we thus advise against using [sp](https://cran.r-project.org/package=sp). t[erra](https://rspatial.github.io/terra/reference/terra-package.html) is preferred over [raster](https://rspatial.org/raster/pkg/1-introduction.html), as it is being retired (see this [blogpost](https://www.r-bloggers.com/2023/06/upcoming-changes-to-popular-r-packages-for-spatial-data-what-you-need-to-do/)). More information about the migration can be found on the [r-spatial website](https://r-spatial.org/r/2023/04/10/evolution3.html), and [this blogpost](https://r-spatial.org/r/2022/04/12/evolution.html) about the retirement of [sp](https://cran.r-project.org/package=sp), [rgdal](https://cran.r-project.org/package=rgdal), [maptools](https://cran.r-project.org/package=maptools) and [rgeos](https://cran.r-project.org/package=rgeos).

In general it is recommended to use packages from the tidyverse over base R functions in cases where the tidyverse alternative has significant advantages. For example the case of `readr::read_csv()` over `base::read.table()`. The [readr](https://readr.tidyverse.org/) alternative is faster, has better error handling, and is easier to use. However, certainly [a case](https://recology.info/2018/10/limiting-dependencies/) can be made for having as few dependencies as possible, and wrapping your own functions around base to get around certain limitations. The question on when exactly you should take a dependency, depends on the context. The [R packages handbook](https://r-pkgs.org/dependencies-mindset-background.html#sec-dependencies-pros-cons) ([Wickham & Bryan 2023][wickham_bryan_2023]) offers some guidance in this matter. Jeff Leek has written a blog post on his decision process: [How I decide when to trust an R package](https://simplystatistics.org/posts/2015-11-06-how-i-decide-when-to-trust-an-r-package/) and the tidyverse makes [a case](https://www.tidyverse.org/blog/2022/09/playing-on-the-same-team-as-your-dependecy/) for not using internal functions from dependencies.

Adding a dependency to your `DESCRIPTION` file is easy using [usethis](https://usethis.r-lib.org/):

```r
usethis::use_package("dplyr")
```

Refer to the [rOpenSci recommendations](https://devguide.ropensci.org/building.html#recommended-scaffolding) for common scaffolding for more suggestions.

## Code style

> Good coding style is like correct punctuation: you can manage without it, butitsuremakesthingseasiertoread. — R for Data Science

A number of useful packages exist to help you stick to the tidyverse style. To automatically modify your code to adhere to the recommendations, you can make use of [styler](https://github.com/r-lib/styler) which also exists as a plug-in for RStudio. To check your code for issues, you can use a liter, a popular choice for R is [lintr](https://lintr.r-lib.org/). More information regarding code style can be found in rOpenSci (2021) in the [header on code style](https://devguide.ropensci.org/building.html#code-style), [the tidyverse style guide](https://style.tidyverse.org/). Hadley Wickham ([Wickham et al. 2023][wickham_2023]) also offers some insight in his [workflow](https://r4ds.hadley.nz/workflow-style) when it comes to code style.

## Testing

Have you ever written any code that turned out to not really do what you wanted it to do? Made a change to a helper function that introduced bugs in other functions or scripts using it? Or found yourself running the same little ad hoc tests in the console time and time again to see if a function is behaving as expected? These are all signs that you could benefit from using automated testing.

By writing tests that check the major functionality of your software, you are ensuring that changes along the line don’t break existing functionality. And that updates to underlying dependencies didn’t have unexpected consequences.

A general overview of the how and why of testing R code is found in R packages ([Wickham & Bryan 2023][wickham_bryan_2023]) in [chapter testing basics.](https://r-pkgs.org/testing-basics.html) [rOpenSci (2021)][ropensci_2021] offers some helpful advice regarding tests in the [section on testing](https://devguide.ropensci.org/building.html#testing). Other interesting resources include [the blogpost](https://mtlynch.io/good-developers-bad-tests/) by Michael Lynch on why good developers write bad tests, the documentation of [testthat](https://testthat.r-lib.org/) and [covr](https://covr.r-lib.org/). And rOpenSci ([Chamberlain & Salmon 2024][chamberlain_2024]) also offers a [book](https://books.ropensci.org/http-testing/) on HTTP testing. For more information on unit testing in general, you might find "Unit Testing Principles, Practices, and Patterns" by [Khorikov (2020)][khorikov_2020] a good resource.

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

- [pkgcheck](https://docs.ropensci.org/pkgcheck/) ([Padgham et al. 2023][padgham_2023]): follows rOpenSci recommendations.
- [checklist](https://inbo.github.io/checklist/) ([Onkelinx 2023][onkelinx_2023]): works for R packages and analyses, follows INBO recommendations.
- [lintr](https://lintr.r-lib.org/) ([Hester et al. 2023][hester_2023]): performs [static code analysis](https://en.wikipedia.org/wiki/Static_program_analysis) to highlight possible problems, including good practises and syntax.
- [styler](https://style.tidyverse.org/) ([Müller & Walthert 2023][muller_walthert_2023]): can automatically format code according to the tidyverse style guide.
- [goodpractice](http://mangothecat.github.io/goodpractice/) ([Marks et al. 2022][marks_2022]) informs about different good practices for packages.
- [dupree](https://russhyde.github.io/dupree/) ([Hyde 2024][hyde_2024]) identifies sections of code that are very similar or repeated.

<!-- References -->
[adler_2010]: https://www.oreilly.com/library/view/r-in-a/9781449358204/ "R in a nutshell: A desktop quick reference. O'Reilly Media, Inc."
[bes_2017]: https://www.britishecologicalsociety.org/wp-content/uploads/2019/06/BES-Guide-Reproducible-Code-2019.pdf "British Ecological Society, Croucher M, Graham L, James T, Krystalli A, Michonneau F (2017). Reproducible code."
[chamberlain_2024]: https://doi.org/10.5281/zenodo.10608847 "Chamberlain S, Salmon M (2024). HTTP testing in R. rOpenSci."
[crawley_2010]: https://doi.org/10.1002/9781118448908 "Crawley MJ (2012). The R book. John Wiley & Sons."
[hester_2023]: https://cran.r-project.org/package=lintr "Hester J, Angly F, Hyde R, Chirico M, Ren K, Rosenstock A, Patil I (2023). lintr: A 'Linter' for R Code. R package version 3.1.1."
[hyde_2024]: https://cran.r-project.org/package=dupree "Hyde R (2024). dupree: Identify Duplicated R Code in a Project. R package version 0.3.0."
[khorikov_2020]: https://www.manning.com/books/unit-testing "Khorikov V (2020). Unit Testing Principles, Practices, and Patterns. Simon and Schuster."
[marks_2022]: https://cran.r-project.org/package=goodpractice "Marks K, de Bortoli D, Csardi G, Frick H, Jones O, Alexander H (2022). goodpractice: Advice on R Package Building. R package version 1.0.4."
[muller_walthert_2023]: https://cran.r-project.org/package=styler "Müller K, Walthert L (2023). styler: Non-Invasive Pretty Printing of R Code. R package version 1.10.2."
[onkelinx_2023]: https://inbo.github.io/checklist/ "Onkelinx, T (2023) checklist: A Thorough and Strict Set of Checks for R Packages and Source Code. Version 0.3.5."
[padgham_2023]: https://docs.ropensci.org/pkgcheck/ "Padgham M, Salmon M, Wujciak-Jens J (2023). pkgcheck: rOpenSci Package Checks."
[ropensci_2021]: https://doi.org/10.5281/zenodo.6619350 "rOpenSci, Anderson B, Chamberlain S, DeCicco L, Gustavsen J, Krystalli A, Lepore M, Mullen L, Ram K, Ross N, Salmon M, Vidoni M, Riederer E, Sparks A, Hollister J (2021). rOpenSci Packages: Development, Maintenance, and Peer Review (0.7.0)."
[sandve_2013]: https://doi.org/10.1371/journal.pcbi.1003285 "Sandve GK, Nekrutenko A, Taylor J, Hovig E (2013). Ten Simple Rules for Reproducible Computational Research. PLoS Comput Biol, 9(10), e1003285.""
[stoudt_2021]: https://doi.org/10.1371/journal.pcbi.1008770 "Stoudt S, Vásquez VN, Martinez CC (2021). Principles for data analysis workflows. PLoS Comput Biol, 17(3), e1008770."
[wickham_2023]: https://cran.r-project.org/package=forcats "Wickham H (2023). forcats: Tools for Working with Categorical Variables (Factors). R package version 1.0.0."
[wickham_bryan_2023]: https://r-pkgs.org/ "Wickham H, Bryan J (2023). R packages. O'Reilly Media, Inc."
[xie_2018]: https://bookdown.org/yihui/rmarkdown/ "Xie Y, Allaire JJ, Grolemund G (2018). R markdown: The definitive guide. CRC Press."
[zimmerman_2019]: http://doi.org/10.5281/zenodo.3265164 "Zimmerman N, Wilson G, Silva R, Ritchie S, Michonneau F, Oliver J, …, Takemon Y (2019, July). swcarpentry/r-novice-gapminder: Software Carpentry: R for Reproducible Scientific Analysis, June 2019 (Version v2019.06.1)."

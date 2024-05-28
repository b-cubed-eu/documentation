---
title: R functions
parent: Software development guide
nav_order: 6
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
> - Functions MUST NOT make changes to the global environment.
> - Functions that create or overwrite files MUST have a name that makes this clear such as `write_*`.
> - Repeated code MUST be placed in functions.
> - Functions MUST be named consistently across a package/analyses.
> - Functions MUST use snake_case for their name.
> - Functions MUST contain a verb as part of their name.
> - Exported functions in packages MUST have [roxygen2](https://roxygen2.r-lib.org/) documentation.
> - Functions in analysis scripts MUST have [roxygen2](https://roxygen2.r-lib.org/) documentation.
> - Functions in packages MUST have `@return` and `@examples`.
> - The output of a function MUST only depend on its arguments (inputs).
> - Each function MUST be stored in a separate .R file, except for helper functions.
> - Helper functions MUST be placed in `R/utils.R`.
> - Arguments MUST be named consistently across functions that use similar inputs.
> - Function arguments MUST be ordered from most important (and required) to least important (and optional).
> - If a function returns an object or data of the same type as its input, this argument MUST be in the first position.
> - Optional arguments MUST have default values, while required arguments MUST NOT have defaults.

There are a number of advantages to wrapping existing code into functions, as put by Nicholas Tierney in [his excellent blog post on how to get better at R](https://www.njtierney.com/post/2023/11/10/how-to-get-good-with-r):

> I don’t think I can overstate this, but learning how to write functions changed how I think about code and how I think about solving problems. — Nicholas Tierney

This same blog post also contains a simple example of how to turn existing code into a function. A more in depth description can be found in [the section on functions](https://r4ds.had.co.nz/functions.html#functions) in R for Data Science.

To summarize the why, you should use functions to:

- Create more readable code by placing difficult to understand code into functions.
- Avoid errors when reusing (copy/pasting) code multiple times over the same analysis.

However, using functions is not without its pitfalls. But many issues can be avoided by sticking to some ground rules:

Functions need to be self-contained, the reasoning behind is explained well in the section "writing functions" in the British Ecological Society [guide on reproducible code](https://www.britishecologicalsociety.org/wp-content/uploads/2019/06/BES-Guide-Reproducible-Code-2019.pdf). Practically this means:

- A function SHOULD NOT rely on data from outside of the function whenever possible.
- A function SHOULD NOT manipulate data outside of the function, thus it MUST NOT make changes to objects in the global environment. If you are importing data from the system to R, return an object rather than modifying the global environment (as is also explained in the [tidyverse style guide](https://style.tidyverse.org/functions.html)).
- If it is necessary to make changes to data outside of the function, create a new file rather than making changes to an existing one. Functions that create new files MUST make this clear in their name, a good example is starting the function with write, for example `write_csv()` from [readr](https://readr.tidyverse.org/).

Keeping your functions separate from analysis code can improve the readability of the analysis, and ease the maintenance of the functions. It is considered best practice to place every function in its own .R file, and to name this file after the function. As described in the [R Packages book](https://r-pkgs.org/code.html#sec-code-organising). You can create such a file using:

```r
usethis::use_r("function-name")
```

And start your function using [the included code snippet](https://rstudio.github.io/rstudio-extensions/rstudio_snippets.html) in RStudio.

A sure way to confuse users is for a function to return a different output with the same inputs/arguments, this is the case when some of the inputs are implicit. For example an option or locale setting, the system time or a local datafile that might have changed. Using implicit arguments can lead to difficult to trace behaviours across different computers, and makes a function more difficult to read. A notable exception is when there is an element of randomisation in the output, in this case it is a good idea to allow for setting the seed as a function argument to make this behaviour clear for the user and to allow for reproducible results. For more information about this, read [this excellent section](https://design.tidyverse.org/inputs-explicit.html) in the tidyverse design principles.

> One of the best ways to improve your reach as a data scientist is to write functions. — R for Data Science

Further reading:

- An excellent overview of how functions actually work in R can be found in [the section on functions](https://r4ds.had.co.nz/functions.html) in R for Data Science, the rest of the chapter also includes an excellent overview of best practices.
- Nicholas Tierney provides an easy to follow example of how functions can make your life easier and how to get started with writing them in [this blogpost](https://www.njtierney.com/post/2023/11/10/how-to-get-good-with-r/#write-functions).
- Principles and strategies that come in handy when writing functions (and packages) are summarized in [the tidyverse design principles](http://design.tidyverse.org).
- Berkeley offers an introduction to functions in its [Introduction to the R Language](https://www.stat.berkeley.edu/~statcur/Workshop2/Presentations/functions.pdf) presentation.
- Software Carpentry has an excellent [course page on R functions](http://swcarpentry.github.io/swc-releases/2017.08/r-novice-inflammation/02-func-R/).

## How to split a script into functions

The process of taking an existing script and converting it into a collection of functions that make the workflow more flexible, easier to maintain and more efficient, is an example of [code refactoring](https://en.wikipedia.org/wiki/Code_refactoring).

An often repeated principle in refactoring and software development in general is [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) (Don’t Repeat Yourself), and while there are certainly [situations](https://startup-cto.medium.com/moist-code-why-code-should-not-be-completely-dry-1f06f2d31c31) where you should repeat yourself (see also [AHA programming](https://kentcdodds.com/blog/aha-programming), [arguments](https://enterprisecraftsmanship.com/posts/dry-damp-unit-tests/) for repeating yourself in unit tests), avoiding repetition makes your code easier to maintain and understand. Functions are the most obvious tool we have to avoid repetition, with the equally important benefit that they can offer serious documentation benefits and can make it easier for existing software to be used flexibly in the future.

Looking at an existing script, it is useful to consider what every part actually does ([rubber duck debugging](https://en.wikipedia.org/wiki/Rubber_duck_debugging) can be a useful technique in this). These logical sections and their substeps are good starting points.

Encapsulate repeated code blocks, or logical subsections that perform a single task (especially if they do it multiple times) into functions, and place objects that can influence the output as arguments. This can be a bit of a judgement call, but things like input file paths, output file paths, filters on the data such as taxonomy or time, number of bootstraps, random seeds etc. make for ideal argument choices. Often an object keeps being passed from section to section [undergoing transformations on the way](https://en.wikipedia.org/wiki/Extract,_transform,_load), and finally resulting in some output. If this is the case, the data object MUST be the first argument. For more guidance on this step, refer to the [section on arguments](#function-arguments).

The Research Institute for Nature and Forest (INBO) has a coding club session on functions that has practical exercises on how to turn an existing script into functions, and even finally a package. You can find this session [here](https://inbo.github.io/coding-club/sessions/20230926_functions_in_r.html#1). Jennifer Bryan presented on "code smells" in 2018 during the useR conference. Code smells are a useful tool to identify parts of code that contain bad practices and are good candidates for refactoring. This presentation is available on [YouTube](https://youtu.be/7oyiPBjLAWY?feature=shared).

## Naming functions

From the tidyverse style guide:

> There are only two hard things in Computer Science: [cache invalidation](https://yihui.org/en/2018/06/cache-invalidation/) and naming things. — Phil Karlton

Use verbs to name functions whenever possible, this is a clear indication that a function _does_ something, in contrast to other objects. For more guidance please refer to the tidyverse style guide [section on functions](https://style.tidyverse.org/functions.html#naming). Keep in mind that the name of the function should describe what it does as closely as possible.

If you find this difficult, consider if your function isn’t doing too much. Ideally a function should only do one thing, and only return one thing.

## Function arguments

Consistent naming of arguments across functions greatly improves user friendliness. For guidance on object naming, please refer to [this section](https://style.tidyverse.org/syntax.html#object-names) of the tidyverse style guide.

In the same vein, it is best practice to place the most important arguments first, because these will be used first. This practice is covered by [the tidyverse design principles](https://design.tidyverse.org/important-args-first.html). Doing this, also signals to the user what arguments they should minimally provide. It is also a good idea to never provide defaults for required arguments, and always provide defaults for optional arguments, as covered by [this tidyverse design principle](https://design.tidyverse.org/required-no-defaults.html). This pattern communicates to users which arguments are required, and which ones are not, without having to read the documentation.

Similarly, functions that return objects or data of the same type as their input, MUST place this input as their first argument. This also ensures that functions are as compatible with pipes as possible (in base R `|>` or [magrittr](https://magrittr.tidyverse.org/) `%>%`).

Other tidyverse design principles regarding function arguments:

- [Keep defaults short and sweet](https://design.tidyverse.org/defaults-short-and-sweet.html)
- [Enumerate possible options](https://design.tidyverse.org/enumerate-options.html)
- [Prefer a enum, even if only two choices](https://design.tidyverse.org/boolean-strategies.html)

## Documenting functions

Functions that are well written can be considered partially self documenting, their name is an indication of what they do and their arguments tell the user what is expected and in what shape. However, apart from this adding additional information will make it much easier for your future self and others to reuse your code. R comes with this functionality built in in the form of .Rd files in the man/ folder. Instead of creating these files manually, this additional documentation MUST be written in the form of [roxygen2](https://roxygen2.r-lib.org/articles/roxygen2.html) documentation, which takes the form of commented out text right above your function. The `.Rd` files are then rendered whenever you run:

```r
devtools::document()
```

It is recommended that you add at least one example of the basic functionality of your function in the [roxygen2](https://roxygen2.r-lib.org/) documentation. A very minimal example that uses [roxygen2](https://roxygen2.r-lib.org/) documentation is the `fct_rev()` function from [forcats](https://forcats.tidyverse.org/):


```r
#' Reverse order of factor levels
#'
#' This is sometimes useful when plotting a factor.
#'
#' @param f A factor (or character vector).
#' @export
#' @examples
#' f <- factor(c("a", "b", "c"))
#' fct_rev(f)
fct_rev <- function(f) {
  f <- check_factor(f)

  lvls_reorder(f, rev(lvls_seq(f)))
}
```

An additional advantage of this system is that every function will automatically get its own page on your [documentation website](/dev-guide/r-packages/#documentation-website). A screenshot of the webpage that was created for the function above is shown in [Figure 1](#figure-1).

{:#figure-1}
![Screenshot of online function documentation](/assets/dev-guide/r-function.png)
**Figure 1: Screenshot of the online documentation of the forcats function `fct_rev()`.**

If you are new to documenting functions, have a look at [the chapter on function documentation](https://r-pkgs.org/man.html) in the R Packages book. There is also [the getting started](https://devguide.ropensci.org/pkg_building.html#roxygen-2-use) page of roxygen2, and finally the rOpenSci Packages guide offers some advice in [the section about documentation](https://devguide.ropensci.org/pkg_building.html#roxygen2-use).

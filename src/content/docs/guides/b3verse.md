---
title: Welcome to the b3verse! A collection of R packages for indicator calculation
  from occurrence cubes
sidebar:
  label: The b3verse
  order: 6
knit: (function(inputFile, ...) {
  knitr::knit(
    input = inputFile,
    output = gsub("Rmd$", "md", inputFile)) })
---

<!-- b3verse.md is generated from b3verse.Rmd Please edit that file -->



This guide provides an overview of the integration and maintenance of R packages designed for calculating biodiversity indicators from occurrence cubes.

Suggestion citation:

> Langeraert W, Desmet P, Van Daele T (2025). Welcome to the b3verse! A collection of R packages for indicator calculation from occurrence cubes. <https://docs.b-cubed.eu/guides/b3verse/>

<a href="https://b-cubed-eu.r-universe.dev/"><img src="/guides/b3verse/b3verse-logo.png" align="right" width="139" alt="b3verse logo" /></a>

## What is the b3verse?

The **b3verse** is a collection of related R packages that streamline indicator calculation from occurrence cubes. These packages are accessible and maintained via a [dedicated R-universe platform](https://b-cubed-eu.r-universe.dev/), ensuring continuous updates, easy distribution, and efficient [installation](#installation).

<img src="/guides/b3verse/logo-wall.png" align="center" alt="b3verse logo wall" width="600"/>

## Installation

Install all packages of the **b3verse** via this command in R:

```r
pkgs <- available.packages(repos = "https://b-cubed-eu.r-universe.dev")[, "Package"]
install.packages(pkgs, repos = "https://b-cubed-eu.r-universe.dev")
```

The following packages are currently included:

| Package | Description | GitHub repository |
| :-----: | :---------- | :---------------- |
| **rgbif** | Download occurrence cubes | <https://github.com/ropensci/rgbif> |
| **gcube** | Simulation of occurrence cubes | <https://github.com/b-cubed-eu/gcube> |
| **b3gbi** | Calculate general biodiversity indicators from occurrence cubes | <https://github.com/b-cubed-eu/b3gbi> |
| **pdindicatoR** | Calculate phylogenetic indicators from occurrence cubes | <https://github.com/b-cubed-eu/pdindicatoR> |
| **impIndicatoR** | Calculate alien impact indicators from occurrence cubes | <https://github.com/b-cubed-eu/impIndicator> |
| **dubicube** | Data exploration for occurrence cubes and uncertainty calculation for indicators | <https://github.com/b-cubed-eu/dubicube> |

Note that any dependencies not available in mainstream repositories are also added to the R-universe platform. These dependencies will be installed automatically but are not explicitly listed above.  

## Getting started
### The b3verse workflow

Occurrence cubes can be derived from GBIF data using the **rgbif** package or simulated using the **gcube** package.
They are then processed using the `process_cube()` function from the **b3gbi** package.
This ensures standardised input data across all indicator packages and verifies that the data format is correct.
Data exploration steps can be performed using **dubicube**.
Once the data cubes are processed, indicators can be calculated with **b3gbi**, **pdindicatoR** or **impIndicator**.
The **dubicube** package enables uncertainty estimation via bootstrapping. It is not a strict dependency of the indicator calculation packages, as it can also be used with custom indicator functions.

<img src="/guides/b3verse/indicator-workflow.png" align="middle" alt="indicator workflow" width="800"/>

### Example

:::note
Workflow example coming soon
:::

## Contributing and reporting issues

We welcome contributions to the **b3verse**! Each package in the collection has its own GitHub repository, where you can find contributing guidelines and report issues.  

**How to contribute?**
- Before contributing, check the "Contributing Guidelines" in the relevant repository (see the [table above](#installation) for links).  
- Contributions can include bug fixes, feature requests, documentation improvements, or new functionality.  

**Reporting bugs or suggesting improvements**
- If you encounter an issue or have an idea for improvement, open an "issue" in the corresponding package repository.  
- Be as detailed as possible when describing the issue, including R session info, error messages, and reproducible examples if applicable.

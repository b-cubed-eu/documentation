---
title: Welcome to the b3verse! A collection of R packages for indicator calculation
  from occurrence cubes
sidebar:
  label: The b3verse
  order: 6
---

This guide outlines the integration and maintenance of R package software for calculating biodiversity indicators from occurrence cubes.

Suggestion citation:

> Langeraert W, Desmet P, Van Daele T (2025). Welcome to the b3verse! A collection of R packages for indicator calculation from occurrence cubes. <https://docs.b-cubed.eu/guides/b3verse/>

<a href="https://b-cubed-eu.r-universe.dev/"><img src="/guides/b3verse/b3verse_logo.png" align="right" width="139" alt="b3verse logo" /></a>

## What is the b3verse?

The **b3verse** is a collection of related R packages that streamline indicator calculation from occurrence cubes. These packages are accessible and maintained via a [dedicated R-universe platform](https://b-cubed-eu.r-universe.dev/), ensuring continuous updates, easy distribution, and efficient [installation](#installation).

<img src="/guides/b3verse/logo_wall.png" align="center" alt="b3verse logo wall" width="600"/>

## Installation

Install all packages of the **b3verse** via this command in R:

```r
pkgs <- available.packages(repos = "https://b-cubed-eu.r-universe.dev")[, "Package"]
install.packages(pkgs, repos = "https://b-cubed-eu.r-universe.dev")
```

- overview of packages in **b3verse**

## Getting started

- Description of the indicator calculation workflow within the **b3verse**

<img src="/guides/b3verse/indicator_workflow.png" align="middle" alt="indicator workflow" width="800"/>


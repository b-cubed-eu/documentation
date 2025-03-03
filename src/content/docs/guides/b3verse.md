---
title: Welcome to the b3verse! A collection of R packages for indicator calculation from occurrence cubes
sidebar:
  label: The b3verse
  order: 6
---

This guide outlines the integration and maintenance of R package software for calculating biodiversity indicators from occurrence cubes.

Suggestion citation:

> Langeraert W, Desmet P, Toon Van Daele (2024). Welcome to the b3verse! A collection of R packages for indicator calculation from occurrence cubes. <https://docs.b-cubed.eu/guides/b3verse/>

## What is the b3verse?

- logo
- The **b3verse** is a collection of related R packages that streamline indicator calculation, organize code, and simplify package management via its dedicated R-universe platform: <https://b-cubed-eu.r-universe.dev/>. ...
- logo wall

## Installation

Install all packages of the **b3verse** via this command in R:

```r
pkgs <- available.packages(repos = "https://b-cubed-eu.r-universe.dev")[, "Package"]
install.packages(pkgs, repos = "https://b-cubed-eu.r-universe.dev")
```

- overview of packages in **b3verse**

## Getting started

- Description of the indicator calculation workflow within the **b3verse**

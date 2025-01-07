---
title: Specification for suitability cubes and their production
sidebar:
  label: Suitability cube
  order: 3
---

:::caution
This page is not yet complete.
:::

This document presents the specification for "suitability cubes”, a format used for predictive habitat suitability modelling.

Suggestion citation:

> Cortès Lobos RB, Di Musciano M, Martini M, Rocchini D (2024). Specification for suitability cubes and their production. <https://docs.b-cubed.eu/guides/suitability-cube/>

## Introduction

Here we employ the data cube format to organise biodiversity data across spatial, temporal, and taxonomic dimensions while also associating a suitability score. This makes the data easier to use and enhances the efficiency of modelling biodiversity change and status. We further integrate virtual species and simulations, which were used both for building the **Virtual Suitability Cube (VSC)** and for assessing how sampling bias affects **Species Distribution Models (SDMs)**. By simulating species occurrences with known ecological characteristics, this approach allows for better control over variables and improves our understanding of the ecological niches and conservation needs of real species.

## Task description

_Task 4.1, lead: UNIBO_

Develop workflows for predictive habitat suitability modelling using 'Dismo' R package, incorporating species occurrence data, environmental data (e.g., Copernicus, WorldClim, Cordex), & socio-ecological scenarios to create maps for species distributions under current & future global change scenarios.

- Oct 2024: M11 – Code design: Predictive habitat suitability modelling
- Mar 2025: M12 – Code test: Predictive habitat suitability modelling
---
title: 'invasimapr: Trait dispersion to assess species invasiveness and site invasibility'
sidebar_label: Key Concepts
lastUpdated: 2026-01-30'
sidebar:
  ': Key Concepts
  label: Key Concepts
  order: 1
source: https://github.com/b-cubed-eu/invasimapr/blob/main/fREADME.Rmd
---

<!-- README.md is generated from README.Rmd. Please edit that file -->

# **`invasimapr`**<a href="https://b-cubed-eu.github.io/invasimapr/"><img src="https://b-cubed-eu.github.io/invasimapr/logo.png" align="right" height="135" alt="invasimapr website" /></a>

## A Novel Framework to visualise trait dispersion and assess species invasiveness or site invasibility

<!-- badges: start -->

[![repo
status](https://www.repostatus.org/badges/latest/active.svg)](https://www.repostatus.org/#active)
[![Release](https://img.shields.io/github/release/b-cubed-eu/invasimapr.svg)](https://github.com/b-cubed-eu/invasimapr/releases)
[![invasimapr status
badge](https://b-cubed-eu.r-universe.dev/invasimapr/badges/version)](https://b-cubed-eu.r-universe.dev/invasimapr)
[![CRAN
status](https://www.r-pkg.org/badges/version/invasimapr)](https://CRAN.R-project.org/package=invasimapr)
[![R-CMD-check](https://github.com/b-cubed-eu/invasimapr/actions/workflows/R-CMD-check.yaml/badge.svg)](https://github.com/b-cubed-eu/invasimapr/actions/workflows/R-CMD-check.yaml)
[![Codecov test
coverage](https://codecov.io/gh/b-cubed-eu/invasimapr/graph/badge.svg)](https://app.codecov.io/gh/b-cubed-eu/invasimapr)
[![DOI](https://img.shields.io/badge/DOI-awaiting_upload_to_zenodo-orange)](https://zenodo.org)
[![name status
badge](https://b-cubed-eu.r-universe.dev/badges/:name?color=6CDDB4)](https://b-cubed-eu.r-universe.dev/)
[![MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE.md)

<!-- badges: end -->

------------------------------------------------------------------------

## Introduction

Biological invasions are a leading driver of biodiversity loss. Establishment success depends on a species’ functional traits, local environments, and the competitive pressure from resident communities—so ad-hoc, single-component analyses are insufficient. **`invasimapr`** provides a transparent, trait- and site-specific framework that integrates these components into a single, reproducible workflow to estimate **invasion fitness** and derive decision-ready indicators of **species invasiveness** and **site invasibility**.

At its core, the package (i) models **intrinsic growth potential** from trait–environment responses, (ii) quantifies **competitive penalties** imposed by resident communities via trait overlap and environmental filtering, and (iii) combines these to compute a site- and species-resolved fitness surface that can be summarised and mapped. It relies on standard statistical tools (e.g., GLMM/GAM) and explicit distance/kernels, making it accessible and extensible for applied invasion ecology and conservation planning.

---

## Core concepts (what the framework estimates)

- **Invasion fitness ($\lambda$)** - Net potential for a species to increase when rare at a site: $\lambda = \Gamma r - \alpha C - \beta S + k$, where $r$ is intrinsic (abiotic) performance, $C$ niche crowding, $S$ site saturation, and $\Gamma, \alpha, \beta$ are sensitivities.
- **Invasiveness ($V_i$)** - Propensity of a species to establish across sites (spatial aggregation of $\lambda$).
- **Invasibility ($V_s$)** - Openness of a site to establishment by newcomers (aggregation of $\lambda$ over candidate invaders).

Built from three linked pillars:

1. **Trait space → competition:** Trait similarity yields competition coefficients (higher similarity → stronger competition).
2. **Environmental filtering:** Resident effects are up/down-weighted by site–resident environmental match.
3. **Resident context:** Predicted/typical resident abundance scales suppressive effects.

---

## What the package does (high-level workflow)

- **Data preparation:** Harmonise traits, environments, and resident composition; optionally simulate invaders.
- **Model trait–environment responses:** Fit a single model to predict $r$; estimate resident optima and mismatch.
- **Quantify competitive pressure:** Build trait space; compute similarity kernels; combine with environmental weights and resident context to obtain $C$ and $S$.
- **Compute and summarise outcomes:** Calculate $\lambda$ for each species×site; summarise **$V_s$** and **$V_s$** for mapping, ranking, and prioritisation.

The pipeline is **modular** and **reproducible**, returning intermediate diagnostics for auditability.

---

## Typical outputs

- Matrices/data frames for $r$, $C$, $S$, and $\lambda$ (species × sites).
- Site summaries (**$V_s$**) and species summaries (**$V_i$**).
- Diagnostics: trait distances, kernels, resident optima/mismatch, and sensitivity estimates.

---

## When to use `invasimapr`

- Screening **candidate invaders** and ranking species by establishment potential.
- Identifying **vulnerable sites** and allocating surveillance/management.
- **Scenario analysis** under environmental change.
- Producing consistent, repeatable **maps of invasion risk** across large landscapes.

---

## Data requirements (minimum viable inputs)

- **Traits** for residents (and invaders/simulated invaders).
- **Site environments** (e.g., climate, soils, habitat metrics).
- **Resident composition** (occurrence/abundance or proxy).
- Consistent **species** and **site** identifiers for joins.
- Optional: curated trait tables and metadata for automated ingestion.

---

## Main functions (overview, not a tutorial)

The workflow is organised into eight wrapper functions; each returns intermediate objects for auditability and reuse.

1. **`utils_internal` — setup & utilities**
- `new_invasimapr_fit()`: create a pipeline container for inputs/outputs.
- `print.invasimapr_fit()`: compact summary of pipeline contents.
- `.standardise_df()`: column-wise z-scores for numeric frames (factors/characters preserved).

2. **`prepare_inputs` — data access & assembly**
- Read local data (e.g., `utils::read.csv`) or use **`dissmapr`** to fetch/align observations and environments.
- `get_trait_data()`: retrieve and harmonise species traits.
- `assemble_matrices()`: build core inputs (site coordinates, site×environment, site×resident, trait tables).
- `simulate_invaders()`: optional generation of hypothetical invaders.

3. **`prepare_trait_space` — scaling, geometry & crowding**
- `standardise_model_inputs()`: z-score environments/resident traits; rescale invader traits on resident moments; align factor levels.  
  *Outputs:* `env_df_z`, `traits_res_glmm`, `traits_inv_glmm`, scaling metadata.
- `compute_trait_space()`: shared resident–invader trait map.
- `compute_centrality_hull()`: centrality metrics and convex-hull membership.
- `compute_resident_crowding()`: crowding indices \(C_{js}\) from composition × trait similarity (Gower→Gaussian), with robust z-standardisation.  
  *Outputs stored in:* `fit$traits`, `fit$crowding`.

4. **`model_residents` — resident-only predictors**
- `build_model_formula()`: GLMM-ready formula.
- `prep_resident_glmm()`: site×resident long table; fit residents-only GLMM → link-scale suitability \(r_{js}\) and expected abundance \(\mu_{js}\).
- `standardise_by_site()`: row-standardise site×species matrices.
- `compute_site_saturation()`: site saturation \(S_s\) and z-standardised \(S^{(z)}_s\).

5. **`learn_sensitivities` — slopes & coefficients**
- `fit_auxiliary_residents_glmm()`: auxiliary GLMM with trait×predictor interactions and optional site random slopes.
- `derive_sensitivities()`: invader-level \(\alpha_i\) (crowding), \(\beta_i\) (saturation), \(\theta_i\) (abiotic slope), fallback \(\gamma_i\).
- `site_varying_alpha_beta_gamma()`: integrate trait-fixed effects with site deviations → \(\alpha_{is}\), \(\Gamma_{is}\); propagate \(\beta_i\).

6. **`predict_invaders` — invader-side predictors**
- `build_invader_predictors()`: produce resident-calibrated predictors for invaders:  
  \(r^{(z)}_{is}\) (abiotic suitability), \(C^{(z)}_{is}\) (crowding via weighted similarity), \(S^{(z)}_{is}\) (site saturation broadcast to invaders).

7. **`predict_establishment` — fitness & probability**
- `compute_invasion_fitness()`: assemble \(\lambda_{is} = \Gamma_{is} r^{(z)}_{is} - \alpha_{is} C^{(z)}_{is} - \beta_i S^{(z)}_{is} + \kappa\).  
  Options: global/site-varying slopes; signed/unsigned saturation; calibration strategies.
- `compute_establishment_probability()`: transform \(\lambda_{is}\) to \(p_{is}\) via `probit`, `logit`, or hard thresholds.

8. **`summarise_results` — aggregation & reporting**
- `summarise_invasiveness_invasibility()`: collapse species×site surfaces to:
  - **Species invasiveness** \(V_i\): breadth across sites.
  - **Site invasibility** \(V_s\): fraction/probability of invaders establishing.
  - **Trait invasiveness**: trait-level associations (continuous slopes; ANOVA \(R^2\) for categorical traits).
*Outputs:* tidy species/site tables, trait-effect summaries, and plots (maps, rankings, heatmaps, trait-effect diagrams).

> For full argument lists and return types see the package reference index.

---

## Design principles & assumptions (brief)

- **Single coherent model:** One trait–environment fit underpins invader performance and resident context.
- **Explicit distances/kernels:** Choice of metrics and bandwidths (e.g., $\sigma_t$, $\sigma_e$) is transparent and tunable.
- **Interpretation depends on response:** If $r$ is proxy abundance/occurrence, $\lambda$ is a **relative establishment proxy**, not a demographic rate.
- **Auditability:** Intermediate objects are returned for sensitivity checks and reproducibility.

---

## Interoperability

Works with common R ecosystems for spatial data (e.g., `sf`), modelling (`lme4`, `mgcv`), and visualisation (`ggplot2`). Complements data access/prep packages upstream and mapping/reporting downstream.

---

## Installation


``` r
# install.packages("remotes")
# remotes::install_github("b-cubed-eu/invasimapr")
```

---

## Citation

If you use **`invasimapr`**, please cite the package and associated methods. See `citation("invasimapr")` and the repository’s CITATION files.

------------------------------------------------------------------------

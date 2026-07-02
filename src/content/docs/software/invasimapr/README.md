---
output: github_document
title: 'Invasimapr: A novel framework to visualise trait dispersion and assess species
  invasiveness and site invasibility'
lastUpdated: 2026-07-02
sidebar:
  label: Introduction, part 1
  order: 1
source: https://github.com/b-cubed-eu/invasimapr/blob/main/README.Rmd
---

<!-- README.md is generated from README.Rmd. Please edit that file -->



 <img src="https://b-cubed-eu.github.io/invasimapr/logo.png" align="right" height="139" alt="invasimapr logo" />

<!-- badges: start -->
[![repo status: WIP](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![R-CMD-check](https://github.com/b-cubed-eu/invasimapr/actions/workflows/R-CMD-check.yaml/badge.svg)](https://github.com/b-cubed-eu/invasimapr/actions/workflows/R-CMD-check.yaml)
[![Codecov test coverage](https://codecov.io/gh/b-cubed-eu/invasimapr/graph/badge.svg)](https://app.codecov.io/gh/b-cubed-eu/invasimapr)
[![invasimapr status badge](https://b-cubed-eu.r-universe.dev/invasimapr/badges/version)](https://b-cubed-eu.r-universe.dev/invasimapr)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.20842472.svg)](https://doi.org/10.5281/zenodo.20842472)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://opensource.org/licenses/MIT)
<!-- badges: end -->

**invasimapr** is an open-source R package that quantifies and maps
community-level **invasion fitness** and site-specific **invasibility**.
Biological invasions are a leading driver of biodiversity loss, yet invasion
outcomes depend jointly on three things: the **functional traits** of candidate
invaders, the **abiotic suitability** of local environments, and the **biotic
resistance** of resident communities. Most risk-assessment tools address only
one or two of these axes at a time. invasimapr integrates all three into a
single, reproducible workflow that resolves invasion fitness at the scale of
individual species and sites, and turns it into decision-ready indicators of
*which* invaders are most likely to establish, *where* invasions are most
likely to occur, and *which* ecological mechanisms drive that risk.

invasimapr is part of the [B-Cubed](https://b-cubed.eu/)
([b3verse](https://docs.b-cubed.eu/guides/b3verse/)) toolbox and integrates
tightly with [dissmapr](https://docs.b-cubed.eu/software/dissmapr/readme/) for biodiversity
data acquisition and spatial gridding.

## How it works

invasimapr is built on the **Invasibility Cube**: a unified species x environment
x trait structure that predicts invasion outcomes across every combination of
candidate invader and site. Trait combinations are projected into a
principal-component trait space, where the convex hull of the resident community
defines the competitive arena an invader must enter.

<img src="https://raw.githubusercontent.com/b-cubed-eu/invasimapr/31a107a0e5c75b38626a99521575cf163ee10737/man/figures/fig1.png" width="100%" alt="Trait-space modelling framework: a three-dimensional species x environment x trait cube is projected into principal-component trait space, where the convex hull defines the resident community." />

At its core, invasimapr estimates **invasion fitness**: the per-capita growth
rate of a rare invader introduced into a resident community at ecological
equilibrium. When this is positive the invader can increase from low density and
is predicted to establish; when negative it is expected to fail. Invasion
fitness is decomposed into three mechanistic components:

- **Abiotic suitability** – how well the invader's traits match local
  environmental conditions.
- **Niche crowding** – how strongly the invader's traits overlap with the
  resident community in a shared trait–environment space.
- **Resident competition** – how saturated the site already is with abundant
  residents.

When abiotic benefits outweigh competitive penalties, a species attains positive
invasion fitness and a higher probability of establishment. Geometrically,
invaders near the centroid of the resident trait cloud face strong competition
from look-alike residents, while those toward the margins (or outside the hull)
find less crowded niche space and weaker biotic resistance.

<img src="https://raw.githubusercontent.com/b-cubed-eu/invasimapr/31a107a0e5c75b38626a99521575cf163ee10737/man/figures/fig2.png" width="100%" alt="Trait-space density heatmap showing where competitive pressure concentrates across the shared trait-environment space, with marginal diagnostics for individual trait axes. Warm colours mark trait combinations shared by many residents; cool regions are underexploited niche space." />

## Installation

You can install the development version of invasimapr from
[GitHub](https://github.com/b-cubed-eu/invasimapr) with:

``` r
# install.packages("remotes")
remotes::install_github("b-cubed-eu/invasimapr")
```

## The workflow

invasimapr is modular, transparent and fully reproducible, progressing in three
phases: **inputs and setup**, **from data to invasion fitness**, and **prediction
and indicators**. It is built around eight wrapper functions that run end-to-end
with minimal intervention, each returning an updated `invasimapr_fit` container:

<img src="https://raw.githubusercontent.com/b-cubed-eu/invasimapr/31a107a0e5c75b38626a99521575cf163ee10737/man/figures/invasimapr_workflow.png" width="100%" alt="The invasimapr workflow, from data acquisition through invasion-fitness computation to derived indicators, organised into inputs, modelling and prediction phases." />

1. **`prepare_inputs()`** – assemble and align community, trait and
   environmental matrices.
2. **`simulate_invaders()`** – generate hypothetical invader trait profiles
   from the resident pool (or import your own).
3. **`prepare_trait_space()`** – build the shared Gower/PCoA trait space, convex
   hull and niche-crowding indices.
4. **`model_residents()`** – fit GLMMs to resident abundance and derive
   standardised predictors.
5. **`learn_sensitivities()`** – estimate trait-dependent (and optionally
   site-varying) slopes for suitability, crowding and competition.
6. **`predict_invaders()`** – project invaders into the resident model space.
7. **`predict_establishment()`** – compute per-invader, per-site invasion
   fitness and map it to establishment probability.
8. **`summarise_results()`** – derive species invasiveness, site invasibility
   and trait-effect indicators with maps and plots.

## Example

A minimal, reproducible example using the demo data shipped with the package
(415 sites, 27 resident species, 20 traits and 10 environmental layers):


``` r
library(invasimapr)

# Demo data: one long table with sites, coordinates, species counts,
# environment (env*) and trait (trait_*) columns.
csv <- system.file("extdata", "site_env_spp_simulated.csv.gz", package = "invasimapr")
if (!nzchar(csv)) csv <- "inst/extdata/site_env_spp_simulated.csv.gz"  # source fallback (pre-reinstall)
site_env_spp <- read.csv(csv)

 expects a `site` key; coerce character columns to factors.
long_df <- site_env_spp
names(long_df)[names(long_df) == "site_id"] <- "site"
chr <- vapply(long_df, is.character, logical(1))
long_df[chr] <- lapply(long_df[chr], as.factor)

# Step 1: assemble and align the core matrices in one call
fit <- prepare_inputs(
  long_df      = long_df,
  site_col     = "site",
  env_prefix   = "^env",
  trait_prefix = "^trait",
  make_plots   = FALSE
)
#> Error in `prepare_inputs()`:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

fit
#> Error:
#> ! object 'fit' not found
```

The remaining steps extend the same `fit` object. They involve model fitting and
are shown here without evaluation for brevity:

``` r
# Step 2: simulate hypothetical invaders from the resident trait pool
traits_inv <- simulate_invaders(
  resident_traits = fit$inputs$traits_res,
  n_inv = 10, mode = "columnwise"
)

# Steps 3-8: trait space -> resident model -> sensitivities ->
#            invader prediction -> invasion fitness -> indicators
fit <- prepare_trait_space(fit, traits_inv = traits_inv)
fit <- model_residents(fit)
fit <- learn_sensitivities(fit)
fit <- predict_invaders(fit, traits_inv = traits_inv)
fit <- predict_establishment(fit, option = "C", prob_method = "probit")
fit <- summarise_results(fit)
```

See the [Get started](https://b-cubed-eu.github.io/invasimapr/articles/invasimapr.html)
vignette and the [tutorial articles](https://b-cubed-eu.github.io/invasimapr/articles/)
for the full step-by-step workflow with real data.

## Outputs and indicators

By marginalising the species × site fitness surface across species, sites or
traits, invasimapr produces three complementary families of indicators:

- **Species invasiveness** – how broadly a species can establish across sites
  (supports watchlists and early detection).
- **Site invasibility** – how open a community is to newcomers (identifies
  invasion hotspots for surveillance and conservation planning).
- **Trait invasiveness** – which functional attributes most strongly drive
  establishment (reveals the mechanistic basis of risk).

<img src="https://raw.githubusercontent.com/b-cubed-eu/invasimapr/31a107a0e5c75b38626a99521575cf163ee10737/man/figures/invasibility-map.png" width="100%" alt="Invasibility map: spatial variation in community openness to invasion." />

Applied to South African butterflies, for example, invasimapr maps binary
establishment for each candidate invader on a common grid, making spatial
patterns directly comparable across species:

<img src="https://raw.githubusercontent.com/b-cubed-eu/invasimapr/31a107a0e5c75b38626a99521575cf163ee10737/man/figures/fig4.png" width="100%" alt="Per-invader maps of binary establishment across South Africa. Each panel is one invader; red cells indicate predicted establishment and dark grey non-establishment, on a common grid and coastline for direct comparison." />

## Documentation

- Package website: <https://b-cubed-eu.github.io/invasimapr/>
- Source code: <https://github.com/b-cubed-eu/invasimapr>
- B-Cubed project documentation: <https://docs.b-cubed.eu/>

## Citation

To cite invasimapr, run `citation("invasimapr")` in R, or use:

> MacFadyen, S., Yahaya, M.M., Trekels, M., Kumschick, S., Landi, P. & Hui, C.
> (2025). *invasimapr: Workflow to Visualise Trait Dispersion and Assess
> Invasibility.* R package version 0.2.0.
> <https://doi.org/10.5281/zenodo.20842472>

## Meta

- We welcome [contributions](.github/CONTRIBUTING.md), including bug reports, via
  the [issue tracker](https://github.com/b-cubed-eu/invasimapr/issues).
- License: MIT.
- Please note that this project is released with a
  [Contributor Code of Conduct](CODE_OF_CONDUCT.md). By participating you agree
  to abide by its terms.

## Acknowledgments

This software was developed with funding from the European Union's Horizon
Europe Research and Innovation Programme under grant agreement ID No
[101059592](https://doi.org/10.3030/101059592).

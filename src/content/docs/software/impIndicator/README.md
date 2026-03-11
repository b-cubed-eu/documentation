---
output: github_document
editor_options:
  markdown:
    wrap: 72
title: 'impIndicator: Impact Indicators of Alien Taxa'
lastUpdated: 2026-03-11
sidebar:
  label: Introduction
  order: 1
source: https://github.com/b-cubed-eu/impIndicator/blob/main/README.Rmd
---

<!-- README.md is generated from README.Rmd. Please edit that file -->



<img src="https://b-cubed-eu.github.io/impIndicator/logo.png" align="right" height="139"/>

<!-- badges: start -->

[![repo
status](https://www.repostatus.org/badges/latest/wip.svg)](https://www.repostatus.org/#wip)
[![Release](https://img.shields.io/github/release/b-cubed-eu/impIndicator.svg)](https://github.com/b-cubed-eu/impIndicator/releases)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.15052675.svg)](https://doi.org/10.5281/zenodo.15052675)
[![impIndicator status
badge](https://b-cubed-eu.r-universe.dev/impIndicator/badges/version)](https://b-cubed-eu.r-universe.dev/impIndicator)
[![CRAN
status](https://www.r-pkg.org/badges/version/impIndicator)](https://CRAN.R-project.org/package=impIndicator)
[![R-CMD-check](https://github.com/b-cubed-eu/impIndicator/actions/workflows/R-CMD-check.yaml/badge.svg)](https://github.com/b-cubed-eu/impIndicator/actions/workflows/R-CMD-check.yaml)
[![Codecov test
coverage](https://codecov.io/gh/b-cubed-eu/impIndicator/graph/badge.svg)](https://app.codecov.io/gh/b-cubed-eu/impIndicator)
[![name status
badge](https://b-cubed-eu.r-universe.dev/badges/:name?color=6CDDB4)](https://b-cubed-eu.r-universe.dev/)
[![funder](https://badgen.net/static/funder/European%20Union/f2a)](https://doi.org/10.3030/101059592)

<!-- badges: end -->

The goal of **impIndicator** is to allow users to seamlessly calculate
and visualise the impact of alien taxa and individual species in a given
area. It calculates and visualises potential impact per site as a map.
It takes in Global Biodiversity Information Facility (GBIF) occurrence
cube and EICAT assessment data. It enables users to choose from various
methods of calculating impact indicators based on different assumptions.

The impIndicator produces three main products:

-   **overall impact indicator** with `compute_impact_indicator()`: The
    impact indicator offers a nuanced representation of the trends of
    biological invasions of an area (local, regional, or global scales).
    By tracking the increase and decrease of ecological threats over
    time, this product provides insights into the dynamics of alien
    species impacts, helping assess whether current management practices
    are effective or need adjustment. The temporal analysis of impact
    indicator enables targeted resource allocation, fostering proactive
    interventions to mitigate biodiversity loss and ecosystem
    degradation.
-   **site impact indicator** with `compute_impact_per_site()`: The site
    impact as a map serves as a visual and analytical tool to represent
    the intensity of biological invasions across different parts of an
    area. By enabling spatial comparisons—such as between provinces,
    states, or conservation areas—, it highlights hotspots and areas at
    risk of invasion impact. This spatial data is useful for
    prioritising management actions, coordinating restoration projects,
    and fostering cross-regional collaboration to address alien species
    impacts effectively.
-   **species impact indicator** with `compute_impact_per_species()`:
    The species impact produces the trends of individual alien species,
    enabling a species-specific impact attributed to invasions. This
    data supports comparisons of individual species’ impacts, revealing
    their roles and interactions within invaded area. The species impact
    is invaluable for prioritising species-specific management efforts,
    informing control and eradication strategies, and advancing research
    on alien species' ecological roles and adaptation patterns.

## Installation

Install **impIndicator** in R:

``` r
install.packages("impIndicator", repos = c("https://b-cubed-eu.r-universe.dev", "https://cloud.r-project.org"))
```

You can install the development version from
[GitHub](https://github.com/b-cubed-eu/impIndicator) with:

``` r
# install.packages("remotes")
remotes::install_github("b-cubed-eu/impIndicator")
```

## Demonstration

We demonstrate the computation and visualisation of impact indicator of
biological invasions using the **impIndicator** package:
`compute_impact_indicator()` to compute impact indicators of alien taxa,
`compute_impact_per_species()` to compute impact indicators per species,
and `compute_impact_per_site()` to compute impact indicators per site.
The functions require (1) a species occurrence cube processed by the
`b3gbi::process_cube()` function within `taxa_cube()`, and (2)
Environmental Impact Classification for Alien Taxa (EICAT) impact score
of species. Go to `vignette("Background", package = "impIndicator")` to
read more about these functions.


``` r
# Load packages
library(impIndicator)

library(b3gbi)     # General biodiversity indicators for data cubes
library(tidyverse)   # Visualisation
library(dubicube)  # Data sensitivity and uncertainty estimation
```

### Process occurrence cube

The `cube_acacia_SA` is a GBIF occurrence cube of *Acacia* species in
South Africa, processed with the `process_cube()` function in `b3gbi`
package. The `cube_acacia_SA` grid is an extended quarter degree cell,
thus specified for the `process_cube.` The `first_year` and `last_year`
arguments define the temporal range of the cube, restricting the
processed occurrences to records between `first_year` and `last_year`.


``` r
# Process GBIF Acacia occurrence cube
acacia_cube <- process_cube(cube_name = cube_acacia_SA,
                            grid_type = "eqdgc",
                            first_year = 2010,
                            last_year = 2024)
acacia_cube
#> 
#> Processed data cube for calculating biodiversity indicators
#> 
#> Date Range: 2010 - 2024 
#> Single-resolution cube with cell size 0.25degrees 
#> Number of cells: 461 
#> Grid reference system: eqdgc 
#> Coordinate range:
#>   xmin   xmax   ymin   ymax 
#>   8.00  31.75 -35.00 -22.75 
#> 
#> Total number of observations: 19431 
#> Number of species represented: 36 
#> Number of families represented: 1 
#> 
#> Kingdoms represented: Plantae 
#> 
#> First 10 rows of data (use n = to show more):
#> 
#> # A tibble: 3,604 × 11
#>     year cellCode  taxonKey scientificName      obs kingdom family   minCoordinateUncertainty…¹ xcoord ycoord resolution
#>    <dbl> <chr>        <dbl> <chr>             <dbl> <chr>   <chr>                         <dbl>  <dbl>  <dbl> <chr>     
#>  1  2010 E018S32AD  2980425 Acacia cyclops        1 Plantae Fabaceae                        122   18.4  -32.4 0.25degre…
#>  2  2010 E018S33CD  2979793 Acacia viscidula      1 Plantae Fabaceae                       1000   18.4  -33.9 0.25degre…
#>  3  2010 E018S33CD  2980425 Acacia cyclops        1 Plantae Fabaceae                       1000   18.4  -33.9 0.25degre…
#>  4  2010 E018S34AB  2978369 Acacia ulicifolia     1 Plantae Fabaceae                       1000   18.4  -34.1 0.25degre…
#>  5  2010 E018S34AB  2978604 Acacia pycnantha      1 Plantae Fabaceae                          1   18.4  -34.1 0.25degre…
#>  6  2010 E018S34AB  2978552 Acacia saligna        6 Plantae Fabaceae                          1   18.4  -34.1 0.25degre…
#>  7  2010 E018S34AB  2979232 Acacia implexa        4 Plantae Fabaceae                          1   18.4  -34.1 0.25degre…
#>  8  2010 E019S34AA  2978604 Acacia pycnantha      1 Plantae Fabaceae                       1100   19.1  -34.1 0.25degre…
#>  9  2010 E020S33DC  2979775 Acacia mearnsii       3 Plantae Fabaceae                          1   20.6  -33.9 0.25degre…
#> 10  2010 E029S30DD  2979775 Acacia mearnsii       2 Plantae Fabaceae                       1100   29.9  -30.9 0.25degre…
#> # ℹ 3,594 more rows
#> # ℹ abbreviated name: ¹​minCoordinateUncertaintyInMeters
```

### EICAT assessment data

The Environmental Impact Classification for Alien Taxa (EICAT)
assessment data is the reported impact of alien taxa based on EICAT
method which is the International Union for Conservation of Nature
(IUCN) standard. An assessed alien taxa with adequate data is classified
into massive (MV), major (MR), moderate (MO), minor (MN), or minimal
concern (MC) depending on the severity of the impact caused on recipient
ecosystem. Additional information such as the mechanisms and location of
impact are also recorded. An example of an EICAT dataset is:


``` r
# View EICAT data
head(eicat_acacia, 10)
#> # A tibble: 10 × 3
#>    scientific_name   impact_category impact_mechanism                                            
#>    <chr>             <chr>           <chr>                                                       
#>  1 Acacia saligna    MC              (1) Competition                                             
#>  2 Acacia saligna    MC              (12) Indirect impacts through interaction with other species
#>  3 Acacia saligna    MC              (1) Competition                                             
#>  4 Acacia saligna    MC              (1) Competition; (9) Chemical impact on the ecosystem       
#>  5 Acacia mearnsii   MC              (6) Poisoning/toxicity                                      
#>  6 Acacia longifolia MC              (9) Chemical impact on ecosystems                           
#>  7 Acacia dealbata   MC              (9) Chemical impact on ecosystems                           
#>  8 Acacia dealbata   MC              (9) Chemical impact on ecosystems                           
#>  9 Acacia saligna    MC              (9) Chemical impact on ecosystems                           
#> 10 Acacia dealbata   MC              (12) Indirect impacts through interaction with other species
```

### Site impact indicator

The impact per site is a risk map that shows the impact score for each
site, where multiple species can be present. To compute the impact map
per site, aggregated scores across species at each site are needed. The
`compute_impact_per_site()` uses *max*, *sum* and *mean* metrics to
aggregate impact scores within species and across species in a site as
proposed by Boulesnane-Guengant et al. (2025). The combinations of
within species aggregation metrics for each species and across species
for each site leads to five methods of calculating an impact indicator,
namely,

-   **precaut** (precautionary),
-   **precaut_cum** (precautionary cumulative),
-   **mean**,
-   **mean_cum** (mean cumulative) and
-   **cum** (cumulative).


``` r
siteImpact <- compute_impact_per_site(
  cube = acacia_cube,
  impact_data = eicat_acacia,
  method = "mean_cum"
)

# Impact map
# Visualise last four years for readability
plot(x = siteImpact, region = southAfrica_sf, first_year = 2021)
```

<img src="/software/impIndicator/man/figures/README-unnamed-chunk-11-1.png" alt="" width="100%" />

### Overall impact indicators

To compute the impact indicator of alien taxa, we sum all the yearly
impact scores of each site of the study region. To correct for sampling
effort, we divide the yearly impact scores by the number of sites in the
study region with at least a single occurrence throughout the whole
year. The impact indicator use one of the methods named above in the
impact per site. The `ci_type` argument allows the function
`compute_impact_indicator()` to calculate the confidence interval of the
overall impact indicator using a bootstrapping method via the
**dubicube** package. The `seed = 123` makes the bootstrap to generate
same random sample for reproducibility.


``` r
# Impact indicator
impactIndicator <- compute_impact_indicator(
  cube = acacia_cube,
  impact_data = eicat_acacia,
  method = "mean_cum",
  ci_type = "perc",
  boot_args = list(seed = 123)
)
#> [1] "Performing whole-cube bootstrap."

# Visualise impact indicator
plot(impactIndicator, trend = "smooth")
```

<img src="/software/impIndicator/man/figures/README-unnamed-chunk-12-1.png" alt="" width="100%" />

### Species impact indicator

We compute the impact indicator per species by summing the impact risk
map per species and correct for sampling effort by dividing by $N$. The
`compute_impact_per_species` use *max* (maximum), *mean* or *max_mech*
(sum of maximum score per mechanism) method to compute the impact per
species. Interval calculation is not implemented yet.


``` r
# Impact indicator per species
species_value <- compute_impact_per_species(
  cube = acacia_cube,
  impact_data = eicat_acacia,
  method = "mean",
  ci_type = "none"
)

# Visualise species impact
plot(species_value)
```

<img src="/software/impIndicator/man/figures/README-unnamed-chunk-13-1.png" alt="" width="100%" />

### Sensitivity analysis

To estimate how the impact indicator is sensitive to a taxon and
indicating how the taxon e.g., species can disproportionately influence
the impact indicator. We can use a leave-one-species-out
cross-validation (LOSO-CV) technique. This technique evaluates the
extent to which the overall indicator is driven by individual species by
systematically recalculating the indicator after excluding one species
at a time and comparing the resulting values to those obtained from the
full occurrence cube. The deviation between the left out species
indicator and the full-data indicator provides a measure of error
attributable to species omission and can be summarised using the root
mean square error (RMSE) for each year. RMSE values indicate whether
observed trends are robust or disproportionately influenced by
particular species. We use the `cross_validation()` from **dubicube**
package to perform the LOSO-CV. Details and tutorial about the LOSO-CV
calculation can be found here
<https://b-cubed-eu.github.io/dubicube/articles/group-level-sensitivity.html>



<img src="/software/impIndicator/man/figures/README-unnamed-chunk-15-1.png" alt="" width="100%" />

The above plot shows the RMSE of the impact indicator of Acacia species
is South Africa. The figure indicates the values from the year 2019 are
sensitive or dominated by some individual species in the indicator.

<img src="/software/impIndicator/man/figures/README-unnamed-chunk-16-1.png" alt="" width="100%" />

The above figure shows the impact indicator value and LOSO-CV Error of
each species from the year 2017. The LOSO-CV indicates that the impact
indicator value will increase (if positive) or decrease(if negative) by
the corresponding value of where the species lies in the y-axis. The
impact indicator is majorly influenced by *Acacia saligna* and *Acacia
mearnsii* from the year 2019.

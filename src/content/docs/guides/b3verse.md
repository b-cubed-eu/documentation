---
title: "b3verse: A collection of R packages to work with occurrence cubes"
sidebar:
  label: b3verse
  order: 6
knit: (function(inputFile, ...) {
  knitr::knit(
    input = inputFile,
    output = gsub("Rmd$", "md", inputFile)) })
---

<!-- b3verse.md is generated from b3verse.Rmd Please edit that file -->



[![name status badge](https://b-cubed-eu.r-universe.dev/badges/:name?color=6CDDB4)](https://b-cubed-eu.r-universe.dev/)
[![registry status badge](https://b-cubed-eu.r-universe.dev/badges/:registry)](https://b-cubed-eu.r-universe.dev/)
[![packages status badge](https://b-cubed-eu.r-universe.dev/badges/:packages)](https://b-cubed-eu.r-universe.dev/packages)
[![articles status badge](https://b-cubed-eu.r-universe.dev/badges/:articles)](https://b-cubed-eu.r-universe.dev/articles)
[![datasets status badge](https://b-cubed-eu.r-universe.dev/badges/:datasets)](https://b-cubed-eu.r-universe.dev/datasets)

This guide provides an overview of the integration and maintenance of R packages designed for working with occurrence cubes.

Suggestion citation:

> Langeraert W, Desmet P, Van Daele T (2025). b3verse: A collection of R packages to work with occurrence cubes. <https://docs.b-cubed.eu/guides/b3verse/>

<a href="https://b-cubed-eu.r-universe.dev/"><img src="/guides/b3verse/b3verse-logo.png" align="right" width="139" alt="b3verse logo" /></a>

## What is the b3verse?

The **b3verse** is a collection of related R packages that support the entire workflow of working with occurrence cubes. This includes data retrieval, cube simulation, data processing, exploration, indicator calculation, and uncertainty estimation. These packages are accessible and maintained via a [dedicated R-universe platform](https://b-cubed-eu.r-universe.dev/), ensuring continuous updates, easy distribution, and efficient [installation](#installation).

In addition to the R packages, the **b3verse** also includes a dedicated [data package](https://doi.org/10.5281/zenodo.15181097), **b3data**, published in the [Frictionless Data](https://frictionlessdata.io/) format. This package provides datasets that can be used directly with the **b3verse software**, including example occurrence cubes and spatial reference layers. For more information, visit the [b3data documentation](https://docs.b-cubed.eu/guides/b3data/).

<img src="/guides/b3verse/logo-wall.png" align="center" alt="b3verse logo wall" width="600"/>

## Installation

Install all packages of the **b3verse** via this command in R:

```r
pkgs <- available.packages(repos = "https://b-cubed-eu.r-universe.dev")[, "Package"]
install.packages(pkgs, repos = c("https://b-cubed-eu.r-universe.dev",
                                 "https://cloud.r-project.org"))
```

The following packages are currently included:

| Package | Description | GitHub repository |
| :-----  | :---------- | :---------------- |
| **b3doc**        | Create Markdown pages for B-Cubed documentation website                          | [https://github.com/b-cubed-eu/b3doc](https://github.com/b-cubed-eu/b3doc)               |
| **b3gbi**        | Calculate general biodiversity indicators from occurrence cubes                  | [https://github.com/b-cubed-eu/b3gbi](https://github.com/b-cubed-eu/b3gbi)               |
| **dubicube**     | Data exploration for occurrence cubes and uncertainty calculation for indicators | [https://github.com/b-cubed-eu/dubicube](https://github.com/b-cubed-eu/dubicube)         |
| **ebvcube**      | Access and visualise datacubes of Essential Biodiversity Variables (EBV)         | [https://github.com/EBVcube/ebvcube](https://github.com/EBVcube/ebvcube)                 |
| **gcube**        | Simulation of occurrence cubes                                                   | [https://github.com/b-cubed-eu/gcube](https://github.com/b-cubed-eu/gcube)               |
| **impIndicatoR** | Calculate alien impact indicators from occurrence cubes                          | [https://github.com/b-cubed-eu/impIndicator](https://github.com/b-cubed-eu/impIndicator) |
| **pdindicatoR**  | Calculate phylogenetic indicators from occurrence cubes                          | [https://github.com/b-cubed-eu/pdindicatoR](https://github.com/b-cubed-eu/pdindicatoR)   |
| **rgbif**        | Download occurrence cubes                                                        | [https://github.com/ropensci/rgbif](https://github.com/ropensci/rgbif)                   |
| **trias**        | Functionality for the TrIAS and LIFE RIPARIAS projects                           | [https://github.com/trias-project/trias](https://github.com/trias-project/trias)         |

Note that any dependencies not available in mainstream repositories are also added to the R-universe platform. These dependencies will be installed automatically but are not explicitly listed above.

## Contributing and reporting issues

We welcome contributions to the **b3verse**! Each package in the collection has its own GitHub repository, where you can find contributing guidelines and report issues.  

**How to contribute?**
- Before contributing, check the *Contributing Guidelines* in the relevant repository (see the [table above](#installation) for links).  
- Contributions can include bug fixes, feature requests, documentation improvements, or new functionality.  

**Reporting bugs or suggesting improvements**
- If you encounter a problem or like to suggest an improvement, open an issue in the corresponding package repository.  
- Be as detailed as possible when describing the issue, including R session info, error messages, and reproducible examples if applicable.

**Adding or removing packages**
- Open an issue and/or pull request in the [b3verse development repository](https://github.com/b-cubed-eu/b-cubed-eu.r-universe.dev/).
- Clearly describe the purpose of the package and how it integrates with the existing **b3verse**.
- Newly proposed packages will undergo a review in line with the [B-Cubed software development guidelines](https://docs.b-cubed.eu/guides/software-development/).

## Getting started
### The b3verse indicator calculation workflow

Occurrence cubes can be derived from GBIF data using the **rgbif** package or simulated using the **gcube** package.
They are then processed using the `process_cube()` function from the **b3gbi** package.
This ensures standardised input data across all indicator packages and verifies that the data format is correct.
Data exploration steps can be performed using **dubicube**.
Once the data cubes are processed, indicators can be calculated with **b3gbi**, **pdindicatoR** or **impIndicator**.
The **dubicube** package enables uncertainty estimation via bootstrapping. It is not a strict dependency of the indicator calculation packages, as it can also be used with custom indicator functions.

<img src="/guides/b3verse/indicator-workflow.png" align="middle" alt="indicator workflow" width="800"/>

### Example workflow

We provide a basic example of an analysis workflow using the **b3verse** packages.
This example demonstrates the process but is not intended as a best-practice analysis.
For more detailed guidance, refer to the package tutorials.  

In this workflow, we use **gcube** v1.3.5 to simulate an occurrence cube, **b3gbi** v0.6.3 to process the cube, and **dubicube** v0.8.0 to calculate uncertainty around indicator estimates.


``` r
# Load packages
library(gcube)     # simulate occurrence cubes
library(b3gbi)     # process occurrence cubes
library(dubicube)  # uncertainty calculation for occurrence cubes

library(sf)        # work with spatial objects
library(dplyr)     # data wrangling
library(ggplot2)   # data visualisation
```

#### Simulate occurrence cube

As input, we create a polygon in which we simulate occurrences.
It represents the spatial extend of the species.
We also need a grid.
Each observation will be designated to a grid cell.


``` r
# Create polygon
polygon <- st_polygon(list(cbind(c(500, 1000, 1000, 600, 200, 100, 500),
                                 c(200, 100, 700, 1000, 900, 500, 200))))

# Create grid
cube_grid <- st_make_grid(
  st_buffer(polygon, 50),
  n = c(20, 20),
  square = TRUE) %>%
  st_sf()

# Visualise
ggplot() +
  geom_sf(data = polygon) +
  geom_sf(data = cube_grid, alpha = 0) +
  theme_minimal()
```

![plot of chunk species-range-grid](../../../../public/guides/b3verse/species-range-grid-1.png)

We simulate three species for 5 time points where each species has a different average total number of occurrences at time point one and a different spatial clustering (see also [this tutorial](https://b-cubed-eu.github.io/gcube/articles/multi-species-approach.html)).


``` r
# Create dataframe with simulation function arguments
multi_species_args <- tibble(
  species = paste("species", 1:3, sep = "_"),
  species_key = 1:3,
  species_range = rep(list(polygon), 3),
  initial_average_occurrences = c(300, 400, 500),
  n_time_points = rep(5, 3),
  temporal_function = c(NA, simulate_random_walk, NA),
  sd_step = c(NA, 10, NA),
  spatial_pattern = c("random", "clustered", "clustered"),
  coords_uncertainty_meters = 25,
  grid = rep(list(cube_grid), 3),
  seed = 123
)

# How does this dataframe look like?
glimpse(multi_species_args)
#> Rows: 3
#> Columns: 11
#> $ species                     <chr> "species_1", "species_2", "species_3"
#> $ species_key                 <int> 1, 2, 3
#> $ species_range               <list> [POLYGON ((500 200, 1000 100...], [POLYGON…
#> $ initial_average_occurrences <dbl> 300, 400, 500
#> $ n_time_points               <dbl> 5, 5, 5
#> $ temporal_function           <list> NA, function (initial_average_occurrences …
#> $ sd_step                     <dbl> NA, 10, NA
#> $ spatial_pattern             <chr> "random", "clustered", "clustered"
#> $ coords_uncertainty_meters   <dbl> 25, 25, 25
#> $ grid                        <list> [<sf[400 x 1]>], [<sf[400 x 1]>], [<sf[40…
#> $ seed                        <dbl> 123, 123, 123
```

We simulate the datacube with these arguments.


``` r
# Simulate occurrence cube
occurrence_cube_full <- multi_species_args %>%
  gcube::map_simulate_occurrences() %>%
  gcube::map_sample_observations() %>%
  gcube::map_filter_observations() %>%
  gcube::map_add_coordinate_uncertainty() %>%
  gcube::map_grid_designation(nested = FALSE)
#> [1] [using unconditional Gaussian simulation]
#> [2] [using unconditional Gaussian simulation]
#> [3] [using unconditional Gaussian simulation]

# Select relevant columns
occurrence_cube_df <- occurrence_cube_full %>%
  select("cell_code", "time_point", "species", "species_key", "n",
         "min_coord_uncertainty")

# Visualise
glimpse(occurrence_cube_df)
#> Rows: 6,000
#> Columns: 6
#> $ cell_code             <chr> "105", "108", "109", "110", "111", "112", "113",…
#> $ time_point            <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, …
#> $ species               <chr> "species_1", "species_1", "species_1", "species_…
#> $ species_key           <int> 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, …
#> $ n                     <int> 1, 1, 1, 1, 2, 3, 2, 2, 1, 1, 2, 2, 3, 2, 2, 2, …
#> $ min_coord_uncertainty <dbl> 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, 25, …
```

#### Process occurrence cube

We process our simulated cube using the `process_cube()` function from the **b3gbi** package.
This ensures standarisation and verifies a correct data format.


``` r
# Process cube
processed_cube <- b3gbi::process_cube(
  cube_name = occurrence_cube_df,
  grid_type = "custom",
  cols_cellCode = "cell_code",
  cols_year = "time_point",
  cols_species = "species",
  cols_speciesKey = "species_key",
  cols_occurrences = "n",
  cols_minCoordinateUncertaintyInMeters = "min_coord_uncertainty"
)

processed_cube
#> 
#> Simulated data cube for calculating biodiversity indicators
#> 
#> Date Range: 1 - 5 
#> Number of cells: 400 
#> Grid reference system: custom 
#> Coordinate range:
#> [1] "Coordinates not provided"
#> 
#> Total number of observations: 6012 
#> Number of species represented: 3 
#> Number of families represented: Data not present 
#> 
#> Kingdoms represented: Data not present 
#> 
#> First 10 rows of data (use n = to show more):
#> 
#> # A tibble: 6,000 × 6
#>    cellCode  year scientificName taxonKey   obs minCoordinateUncertaintyInMeters
#>    <chr>    <dbl> <chr>             <dbl> <dbl>                            <dbl>
#>  1 105          1 species_1             1     1                               25
#>  2 108          1 species_1             1     1                               25
#>  3 109          1 species_1             1     1                               25
#>  4 110          1 species_1             1     1                               25
#>  5 111          1 species_1             1     2                               25
#>  6 112          1 species_1             1     3                               25
#>  7 113          1 species_1             1     2                               25
#>  8 117          1 species_1             1     2                               25
#>  9 118          1 species_1             1     1                               25
#> 10 119          1 species_1             1     1                               25
#> # ℹ 5,990 more rows
```

#### Indicator calculation

Finally, we calculate a simple indicator: the total number of observations per species per year.


``` r
species_observations <- function(cube) {
  # Calculate the number of observations per species per year
  cube %>%
    summarise(diversity_val = sum(obs),
              .by = c(scientificName, year))
}
```

The values are calculated and added to a new column `diversity_val`.


``` r
species_observations(processed_cube$data)
#> # A tibble: 15 × 3
#>    scientificName  year diversity_val
#>    <chr>          <dbl>         <dbl>
#>  1 species_1          1           290
#>  2 species_2          1           402
#>  3 species_3          1           487
#>  4 species_1          2           320
#>  5 species_2          2           428
#>  6 species_3          2           526
#>  7 species_1          3           270
#>  8 species_2          3           401
#>  9 species_3          3           462
#> 10 species_1          4           302
#> 11 species_2          4           382
#> 12 species_3          4           502
#> 13 species_1          5           329
#> 14 species_2          5           373
#> 15 species_3          5           538
```

We use bootstrapping to calculate uncertainty around the estimates.
We calculate the 95 % Bias-corrected and accelerated (BCa) interval for each estimate.


``` r
# Perform bootstrapping
bootstrap_observations <- dubicube::bootstrap_cube(
  data_cube = processed_cube,
  fun = species_observations,
  grouping_var = c("scientificName", "year"),
  samples = 1000,
  seed = 123
)

# Calculate BCa intervals
ci_observations <- dubicube::calculate_bootstrap_ci(
  bootstrap_samples_df = bootstrap_observations,
  grouping_var = c("scientificName", "year"),
  type = "bca",
  conf = 0.95,
  data_cube = processed_cube,
  fun = species_observations
)

ci_observations
#>    scientificName year est_original est_boot  se_boot bias_boot int_type conf
#> 1       species_1    1          290  290.105 24.46022     0.105      bca 0.95
#> 2       species_1    2          320  321.075 26.30561     1.075      bca 0.95
#> 3       species_1    3          270  270.229 22.48569     0.229      bca 0.95
#> 4       species_1    4          302  302.541 25.74146     0.541      bca 0.95
#> 5       species_1    5          329  329.187 26.90535     0.187      bca 0.95
#> 6       species_2    1          402  401.399 35.75847    -0.601      bca 0.95
#> 7       species_2    2          428  428.076 37.34537     0.076      bca 0.95
#> 8       species_2    3          401  401.521 33.43716     0.521      bca 0.95
#> 9       species_2    4          382  379.198 33.83018    -2.802      bca 0.95
#> 10      species_2    5          373  374.539 35.58917     1.539      bca 0.95
#> 11      species_3    1          487  488.132 41.80905     1.132      bca 0.95
#> 12      species_3    2          526  526.244 45.72784     0.244      bca 0.95
#> 13      species_3    3          462  461.012 40.02179    -0.988      bca 0.95
#> 14      species_3    4          502  503.143 40.87546     1.143      bca 0.95
#> 15      species_3    5          538  536.906 45.84350    -1.094      bca 0.95
#>          ll       ul
#> 1  246.7550 343.0000
#> 2  271.0000 373.0000
#> 3  228.6241 316.2085
#> 4  252.6628 352.6329
#> 5  279.1095 387.0513
#> 6  338.4143 485.4423
#> 7  361.6378 512.0000
#> 8  340.7850 473.1140
#> 9  319.9624 456.0000
#> 10 308.3428 446.0000
#> 11 401.9035 563.2030
#> 12 440.0000 626.4637
#> 13 384.7805 544.3632
#> 14 426.0000 582.5442
#> 15 453.3883 635.0000
```

We visualise the results.


``` r
ci_observations %>%
  ggplot(aes(x = year, y = est_original, colour = scientificName)) +
      geom_errorbar(aes(ymin = ll, ymax = ul),
                    linewidth = 0.8, position = position_dodge(1)) +
      geom_point(size = 3, position = position_dodge(1)) +
      labs(y = "number of observations", x = "time point", colour = "species") +
      theme_minimal()
```

![plot of chunk indicator-trends](../../../../public/guides/b3verse/indicator-trends-1.png)

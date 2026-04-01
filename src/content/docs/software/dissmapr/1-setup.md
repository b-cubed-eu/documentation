---
title: Getting started
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Getting started`} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-04-01
sidebar:
  label: Setup
  order: 1
source: https://github.com/b-cubed-eu/dissmapr/blob/master/vignettes/1-setup.Rmd
---





## A Novel Framework for Automated Compositional Dissimilarity and Biodiversity Turnover Analysis

## Introduction

`dissmapr` is an R package for analysing compositional dissimilarity and biodiversity turnover across spatial gradients.
It provides scalable, modular workflows that integrate species occurrence, environmental data, and multi-site compositional turnover metrics to quantify and predict biodiversity patterns.
A core feature is the use of zeta diversity, which extends beyond pairwise comparisons to capture shared species across multiple sites - offering deeper insight into community assembly, turnover, and connectivity, for both rare and common species.
By incorporating different regression methods within the framework of Multi-Site Generalised Dissimilarity Modelling (MS-GDM), `dissmapr` enables robust mapping, bioregional classification, and scenario-based forecasting.
Designed for flexibility and reproducibility, it supports biodiversity monitoring and conservation planning at landscape to regional scales.

---

### 1. Install and load `dissmapr`

Install and load the `dissmapr` package from GitHub, ensuring all functions are available for use in the workflow.


``` r
# install remotes if needed
# install.packages("remotes")
# remotes::install_github("macSands/dissmapr")
```


``` r
# Ensure the package is loaded when knitting
library(dissmapr)

# Make sure all the functions are loaded
# devtools::load_all()
```

### 2. Load other R libraries

Load core libraries for spatial processing, biodiversity modelling, and visualization required across the `dissmapr` analysis pipeline.


``` r
# Load necessary libraries
library(httr)       # HTTP client  
library(geodata)    # Download geographic data  
library(data.table) # Fast large-table operations  
library(dplyr)      # Data manipulation verbs  
library(tidyr)      # Tidy data reshaping  
library(zoo)        # Time series utilities  
library(sf)         # Vector spatial data  
library(terra)      # Raster spatial operations  
library(tidyterra)  # supplies geom_spatraster()
library(zetadiv)    # Multi-site dissimilarity modelling
library(ggplot2)    # Grammar of graphics  
library(viridis)    # Perceptual color scales  
library(patchwork)  # Sequentially build up plots on one page
library(mclust)     # Clustering, Classification, and Density Estimation
```

### 3. Get species occurrence records using `get_occurrence_data()`

To contextualise the following steps of the workflow, we use South African butterfly data accessed from GBIF ([DOI: 10.15468/dl.jh6maj](https://www.gbif.org/occurrence/download/0006880-241024112534372)), as a demonstration case. Ultimately, the choice for the Area of Interest (AoI) and taxa is user-specific. 
This section demonstrates how to automate the retrieval and pre-processing of biodiversity occurrence data from a GBIF query (stored locally as a `.csv` file), however the same workflow can ingest other sources as well (see the `get_occurrence_data()` documentation for details). Data inputs currently supported include:

*  **Local** databases or `.csv` files
*  **URLs** or `.zip` files from the Global Biodiversity Information Facility (GBIF)
*  Future inclusion of **GBIF species occurrence cubes**. Read the [species occurrence cubes in GBIF](https://www.gbif.org/occurrence-cubes) documentation for full details on creating, customizing and submitting queries for occurrence cubes. Read the [b-cubed](https://b-cubed.eu/) documentation on [specification for species occurrence cubes and their production](https://docs.b-cubed.eu/guides/occurrence-cube/).

`get_occurrence_data()` then organises the records by the chosen taxonomic scope and region, returning presence–absence and/or abundance matrices that summarise species co-occurrence records with latitude and longitude coordinates.


``` r
load(system.file("extdata", "gbif_butterflies_csv.RData", package = "dissmapr"), envir = knitr::knit_global())

bfly_data = get_occurrence_data(
  data        = gbif_butterflies_csv,
  source_type = 'data_frame'
)

# bfly_data = get_occurrence_data(
#   data        = system.file("extdata", "gbif_butterflies.csv", package = "dissmapr"),
#   source_type = 'local_csv',
#   sep         = '\t'
# )

# Check results but only a subset of columns to fit in console
dim(bfly_data)
#> [1] 81825    52
str(bfly_data[,c(51,52,22,23,1,14,16,17,30)]) 
#> 'data.frame':	81825 obs. of  9 variables:
#>  $ site_id               : int  1 2 3 1 4 5 5 5 5 5 ...
#>  $ pa                    : num  1 1 1 1 1 1 1 1 1 1 ...
#>  $ y                     : num  -34.4 -34 -33.9 -34.4 -34.4 ...
#>  $ x                     : num  19.2 18.8 18.4 19.2 18.5 ...
#>  $ gbifID                : num  9.23e+08 9.23e+08 9.23e+08 9.22e+08 9.22e+08 ...
#>  $ verbatimScientificName: chr  "Pieris brassicae" "Pieris brassicae" "Papilio demodocus subsp. demodocus" "Mylothris agathina subsp. agathina" ...
#>  $ countryCode           : chr  "ZA" "ZA" "ZA" "ZA" ...
#>  $ locality              : chr  "Hermanus" "Polkadraai Road" "Signal Hill" "Hermanus" ...
#>  $ eventDate             : chr  "2012-10-13T00:00" "2012-11-01T00:00" "2012-10-31T00:00" "2012-10-13T00:00" ...
head(bfly_data[,c(51,52,22,23,1,14,16,17,30)])
#>   site_id pa         y        x    gbifID             verbatimScientificName countryCode
#> 1       1  1 -34.42086 19.24410 923051749                   Pieris brassicae          ZA
#> 2       2  1 -33.96044 18.75564 922985630                   Pieris brassicae          ZA
#> 3       3  1 -33.91651 18.40321 922619348 Papilio demodocus subsp. demodocus          ZA
#> 4       1  1 -34.42086 19.24410 922426210 Mylothris agathina subsp. agathina          ZA
#> 5       4  1 -34.35024 18.47488 921650584                  Eutricha capensis          ZA
#> 6       5  1 -33.58570 25.65097 921485695            Drepanogynis bifasciata          ZA
#>                                            locality        eventDate
#> 1                                          Hermanus 2012-10-13T00:00
#> 2                                   Polkadraai Road 2012-11-01T00:00
#> 3                                       Signal Hill 2012-10-31T00:00
#> 4                                          Hermanus 2012-10-13T00:00
#> 5 Cape of Good Hope / Cape Point Area, South Africa 2012-10-30T00:00
#> 6                             Kudu Ridge Game Lodge 2012-10-23T00:00
```

### 4. Format data using `format_df()`

Use `format_df()` to *standardise and reshape* raw biodiversity tables into the *long* or *wide* format required by later `dissmapr` steps.
Importantly, this function does not alter the spatial resolution of the original observations - it simply tidies the data by automatically identifying key columns (e.g., coordinates, species, and values), assigning unique site IDs (`site_id`), renaming or removing columns, and reformatting the data for analysis.
Outputs include a cleaned `site_obs` dataset and `site_spp` matrix for further processing:

*  **site_obs**: Simplified table with unique `site_id`, `x`, `y`, `species` and `value` records (long format).
*  **site_spp**: Site-by-species matrix for biodiversity assessments (wide format).

**Format data into long (`site_obs`) and wide (`site_spp`) formats**


``` r
bfly_result = format_df(
  data        = bfly_data, # A `data.frame` of biodiversity records
  species_col = 'verbatimScientificName', # Name of species column (required for `"long"`)
  value_col   = 'pa', # Name of value column (e.g. presence/abundance; for `"long"`)
  extra_cols  = NULL, # Character vector of other columns to keep
  format      = 'long' # Either`"long"` or `"wide"`. If `NULL`, inferred from `species_col` & `value_col`
)

# Check `bfly_result` structure
str(bfly_result, max.level = 1)
#> List of 2
#>  $ site_obs:'data.frame':	79953 obs. of  5 variables:
#>  $ site_spp: tibble [56,090 × 2,871] (S3: tbl_df/tbl/data.frame)

# Optional: Create new objects from list items
site_obs = bfly_result$site_obs
site_spp = bfly_result$site_spp

# Check results
dim(site_obs)
#> [1] 79953     5
head(site_obs)
#>   site_id        x         y                            species value
#> 1       1 19.24410 -34.42086                   Pieris brassicae     1
#> 2       2 18.75564 -33.96044                   Pieris brassicae     1
#> 3       3 18.40321 -33.91651 Papilio demodocus subsp. demodocus     1
#> 4       1 19.24410 -34.42086 Mylothris agathina subsp. agathina     1
#> 5       4 18.47488 -34.35024                  Eutricha capensis     1
#> 6       5 25.65097 -33.58570            Drepanogynis bifasciata     1

dim(site_spp)
#> [1] 56090  2871
head(site_spp[,1:6])
#> # A tibble: 6 × 6
#>   site_id     x     y `Mylothris agathina subsp. agathina` `Pieris brassicae` `Tarucus thespis`
#>     <int> <dbl> <dbl>                                <dbl>              <dbl>             <dbl>
#> 1       1  19.2 -34.4                                    1                  1                 1
#> 2       2  18.8 -34.0                                    0                  1                 0
#> 3       3  18.4 -33.9                                    0                  0                 0
#> 4       4  18.5 -34.4                                    0                  0                 0
#> 5       5  25.7 -33.6                                    0                  0                 0
#> 6       6  22.2 -33.6                                    0                  0                 0

#### Get parameters from processed data to use later
# Number of species
(n_sp = dim(site_spp)[2] - 3)
#> [1] 2868

# Species names
sp_cols = names(site_spp)[-c(1:3)]
sp_cols[1:10]
#>  [1] "Mylothris agathina subsp. agathina" "Pieris brassicae"                  
#>  [3] "Tarucus thespis"                    "Acraea horta"                      
#>  [5] "Danaus chrysippus"                  "Papilio demodocus subsp. demodocus"
#>  [7] "Eutricha capensis"                  "Mesocelis monticola"               
#>  [9] "Vanessa cardui"                     "Cuneisigna obstans"
```



---
title: Step-by-step Workflow
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Step-by-step Workflow} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-07-02
sidebar:
  label: Step-by-step workflow
  order: 3
source: https://github.com/b-cubed-eu/invasimapr/31a107a0e5c75b38626a99521575cf163ee10737/vignettes/articles/step-by-step-workflow.Rmd
---



---

# Step-by-step Workflow

This vignette runs through a step-by-step workflow to visualise trait dispersion and assess species invasiveness and site invasibility. It begins with how to install and load **`invasimapr`** and outlines the (pre-)requisites for running the full workflow.

## Setup

### Install and load `invasimapr`

*Install** and load the `invasimapr` package from GitHub, ensuring all functions are available for use in the workflow.


``` r
# install.packages("remotes")
# remotes::install_github("b-cubed-eu/invasimapr")

# If invasimapr is on CRAN:
# install.packages("invasimapr")
```

*Load** the `invasimapr` package:


``` r
library(invasimapr)

if (!requireNamespace("invasimapr", quietly = TRUE)) {
  knitr::knit_exit()
}

# Optional: report package version
packageVersion("invasimapr")
#> [1] '0.2.0'

# Make sure all the functions are loaded
# devtools::load_all() # alternative during local development
```

### Load other R libraries

Load core libraries for spatial processing, biodiversity modelling, and visualization required across the `invasimapr` analysis pipeline.

The workflow typically uses packages for:

* data manipulation (`dplyr`, `tidyr`, `purrr`, `tibble`, `stringr`)
* modelling (`glmmTMB`, `performance`, `MASS`, `glmnet`, `Matrix`)
* multivariate methods (`vegan`, `cluster`)
* spatial analysis (`sf`)
* visualisation (`ggplot2`, `viridis`, `pheatmap`, `factoextra`)

For robust docs builds, we recommend **not** attaching large dependency sets with `library()` unless you will use them in this vignette. Instead, downstream vignettes should load what they need, and you can rely on `pkg::fun()` where practical.

Below is a light “availability check” that does not install anything.


``` r
# # Load essential packages
# suppressPackageStartupMessages({
#   need = c("dplyr","tidyr","purrr","tibble","stringr","ggplot2","Matrix","glmnet","rlang", "glmmTMB",
#   "performance", "vegan", "cluster", "matrixStats", "sf", "MASS", "factoextra", "viridis", "pheatmap")
#   to_install = need[!sapply(need, requireNamespace, quietly = TRUE)]
#   if (length(to_install)) install.packages(to_install)
#   lapply(need, library, character.only = TRUE)
# })

deps = c(
  # Core workflow
  "dplyr","tidyr","purrr","tibble","stringr", "forcats",
  "ggplot2",
  # Modelling / stats
  "glmmTMB","performance","Matrix","glmnet","MASS","vegan","cluster","matrixStats",
  # Spatial
  "sf",
  # Viz helpers used in later steps
  "viridis","pheatmap","factoextra"
)

is_installed = vapply(deps, requireNamespace, logical(1), quietly = TRUE)
missing = deps[!is_installed]

cat("### Dependency check\n\n")
if (length(missing) == 0) {
  cat("- All recommended packages are available.\n")
} else {
  cat("- Missing packages (install before running the full workflow):\n")
  cat(paste0("  - ", missing, collapse = "\n"), "\n")
}
```

---

## Data access and preparation

### Data access and preparation using `dissmapr`

To acquire and prepare species occurrence data for biodiversity modelling using the `dissmapr` package, a series of modular functions streamline the workflow from raw observations to spatially aligned environmental predictors.

#### Install `dissmapr`

Install and load the `dissmapr` package from GitHub, ensuring all functions are available for use in the workflow.


``` r
# # Install remotes if needed
# install.packages("remotes")
# remotes::install_github("b-cubed-eu/dissmapr")

# Ensure the package is loaded.
# suppressWarnings() hides dissmapr's namespace-load import clashes
# (intersect/union/time<-/aggregate from dplyr/terra/zoo/stats).
ok <- suppressWarnings(suppressMessages(
  requireNamespace("dissmapr", quietly = TRUE)
))
if (!ok) {
  knitr::knit_exit()
}
# Optional: report package version
packageVersion("dissmapr")
#> [1] '0.2.0'
```

#### Import and harmonise biodiversity-occurrence data

The process begins with [`dissmapr::get_occurrence_data()`](https://b-cubed-eu.github.io/dissmapr/reference/get_occurrence_data.html), which imports biodiversity records, such as a GBIF butterfly dataset for South Africa, and harmonizes them into standardised formats. Input sources can include local CSV files, URLs, or zipped GBIF downloads. The function filters data by taxon and region, returning both raw records and site × species matrices in presence-absence or abundance form.


``` r
# Use local GBIF data
bfly_data = dissmapr::get_occurrence_data(
  data = system.file("extdata", "gbif_butterflies.csv", package = "invasimapr"),
  source_type = "local_csv",
  sep = "\t"
)

# Check results but only a subset of columns to fit in console
dim(bfly_data)
# str(bfly_data[,c(51,52,22,23,1,14,16,17,30)])
head(bfly_data[, c(51, 52, 22, 23, 1, 14, 16, 17, 30)])
```

#### Format biodiversity records to long/wide formats

Next, [`dissmapr::format_df()`](https://b-cubed-eu.github.io/dissmapr/reference/format_df.html) restructures the raw records into tidy long and wide formats. This assigns unique site IDs, extracts key fields (coordinates, species names, observation values), and prepares two main outputs: `site_obs` (long format for mapping) and `site_spp` (wide format for species-level analysis).


``` r
# Continue from GBIF data
bfly_result = dissmapr::format_df(
  data        = bfly_data, # A `data.frame` of biodiversity records
  species_col = "verbatimScientificName", # Name of species column (required for `"long"`)
  value_col   = "pa", # Name of value column (e.g. presence/abundance; for `"long"`)
  extra_cols  = NULL, # Character vector of other columns to keep
  format      = "long" # Either`"long"` or `"wide"`
)

# Check `bfly_result` structure
str(bfly_result, max.level = 1)

# Optional: Create new objects from list items
site_obs = bfly_result$site_obs
site_spp = bfly_result$site_spp

# Check results
dim(site_obs)
head(site_obs)

dim(site_spp)
head(site_spp[, 1:6])

#### Get parameters from processed data to use later
# Number of species
(n_sp = dim(site_spp)[2] - 3)

# Species names
sp_cols = names(site_spp)[-c(1:3)]
sp_cols[1:10]
```

#### Generate spatial grid and gridded summaries

To integrate the data spatially, [`dissmapr::generate_grid()`](https://b-cubed-eu.github.io/dissmapr/reference/generate_grid.html) overlays a user-defined spatial lattice (e.g. 0.5° grid), aggregates biodiversity observations per grid cell, and computes standardised metrics such as species richness and observation effort. Outputs include gridded species matrices (`grid_spp`, `grid_spp_pa`), a spatial polygon (`grid_sf`), and raster layers (`grid_r`), enabling downstream spatial modelling.


``` r
# Load the national boundary
rsa = sf::st_read(system.file("extdata", "rsa.shp", package = "invasimapr"))

# Choose a working resolution
res = 0.5 # decimal degrees° (≈ 55 km at the equator)

# Convert the AoI to a 'terra' vector
rsa_vect = terra::vect(rsa)

# Initialise a blank raster template
grid = terra::rast(rsa_vect, resolution = res, crs = terra::crs(rsa_vect))

# Populate the raster with placeholder values
terra::values(grid) = 1

# Clip the raster to the AoI
grid_masked = terra::mask(grid, rsa_vect)

# Generate a 0.5° grid summary for the point dataset `site_spp`
grid_list = dissmapr::generate_grid(
  data          = site_spp, # point data with x/y + species columns
  x_col         = "x", # longitude column
  y_col         = "y", # latitude  column
  grid_size     = 0.5, # cell size in degrees
  sum_cols      = 4:ncol(site_spp), # columns to aggregate * could also use `names(site_spp)[4:ncol(site_spp)]`
  crs_epsg      = 4326 # WGS84
)

# Inspect the returned list
str(grid_list, max.level = 1)

# (Optional) Promote list items to named objects
grid_r = grid_list$grid_r$grid_id # raster
grid_sf = grid_list$grid_sf # polygons for mapping or joins
grid_spp = grid_list$grid_spp # tabular summary per cell
grid_spp_pa = grid_list$grid_spp_pa # presence/absence summary

# Quick checks
dim(grid_sf) # ; head(grid_sf)
dim(grid_spp) # ; head(grid_spp[, 1:8])
dim(grid_spp_pa) # ; head(grid_spp_pa[, 1:8])
```

**Visualise species richness per grid cell**

Plot square root transformed sampling effort and species richness, in a 1x2 side by side. Each map uses the `viridisLite::turbo` palette and is overlaid with the study area outline for spatial context.


``` r
# ensure terra methods are used
# library(terra)

# Get a 2-layer SpatRaster for obs_sum & spp_rich, regardless of source structure
r = grid_list$grid_r
if (inherits(r, "SpatRaster")) {
  effRich_r = r[[c("obs_sum", "spp_rich")]]
} else if (is.list(r)) {
  # r is a list of single-layer SpatRasters named 'obs_sum' and 'spp_rich'
  effRich_r = rast(list(r[["obs_sum"]], r[["spp_rich"]]))
} else {
  stop("grid_list$grid_r must be a SpatRaster or a list of SpatRaster layers")
}

# transform
effRich_r = sqrt(effRich_r)

# Open a 1×2 layout and plot each layer + outline
old_par = par(mfrow = c(1, 2), mar = c(1, 1, 1, 2))
on.exit(par(old_par), add = TRUE)

for (i in 1:2) {
  terra::plot(effRich_r[[i]],
    col   = viridisLite::turbo(100),
    colNA = NA,
    axes  = FALSE,
    main  = c("Sampling effort (√obs count)",
              "Species richness (√unique count)")[i],
    cex.main = 0.8
  )
  terra::plot(terra::vect(rsa), add = TRUE, border = "black", lwd = 0.4)
}
```

> :chart_with_upwards_trend: **Figure 3: Spatial distribution of sampling effort and species richness across the study area.** Each grid cell shows the square root--transformed values for (left) total observation counts (sampling effort) and (right) unique species counts (species richness). Both maps use the `viridisLite::turbo` color palette for comparability and are overlaid with the study area outline to provide spatial context.

#### Retrieve, crop, resample, and link environmental rasters to sampling sites

Environmental predictors are appended using [`dissmapr::get_enviro_data()`](https://b-cubed-eu.github.io/dissmapr/reference/get_enviro_data.html), which buffers the grid, downloads raster data (e.g. WorldClim bioclimatic variables), resamples it, and links values to grid-cell centroids. This produces both a site × environment data frame (`env_df`) and a SpatRaster object (`env_r`), aligning biological and environmental data.

Begin by reading in a predefined target species list, then filter a site × species dataset (`grid_spp`) to retain only relevant species observations, and reshape the data for further analysis. This produces both a filtered long-format dataset (`grid_obs`) and a cleaned wide-format site × species matrix (`grid_spp`).


``` r
# Read in target species list
species = read.csv(system.file("extdata",
  "rsa_butterfly_species_names_n27_100plus.csv",
  package = "invasimapr"
), stringsAsFactors = FALSE)$species

# Filter `grid_spp` and convert to long-format
grid_obs = grid_spp |>
  dplyr::select(-mapsheet) |> # Drop mapsheet metadata
  tidyr::pivot_longer(
    cols = -c(grid_id, centroid_lon, centroid_lat, obs_sum, spp_rich), # Keep core metadata columns only
    names_to = "species",
    values_to = "count",
    values_drop_na = TRUE
  ) |>
  dplyr::filter(
    # obs_sum > 100, # Only high-observation sites
    count > 0,# Remove absent species
    .data$species %in% .env$species# Keep only target species
    ) |>
  dplyr::rename(
    site_id = grid_id, # Change 'grid_id' to 'site_id'
    x = centroid_lon, # Change 'centroid_lon' to 'x'
    y = centroid_lat # Change 'centroid_lat' to 'y'
  ) |>
  dplyr::relocate(site_id, x, y, obs_sum, spp_rich, species, count)

dim(grid_obs)
head(grid_obs)
length(unique(grid_obs$species))
length(unique(grid_obs$site))

# Reshape site-by-species matrix to wide format and clean
grid_spp = grid_obs |>
  tidyr::pivot_wider(
    names_from = species,
    values_from = count,
    values_fill = 0 # Replace missing counts with 0
  )

dim(grid_spp)
# head(grid_spp)
```

Then proceed to **retrieve and process environmental data** using [`dissmapr::get_enviro_data()`](https://b-cubed-eu.github.io/dissmapr/reference/get_enviro_data.html). In the example below, 19 bioclimatic variables are downloaded from WorldClim v2.1 (≈10 km resolution) for all site centroids in the `grid_spp` dataset. It performs the following steps:

1.  Retrieves WorldClim "bio" variables via the `geodata` interface.
2.  Buffers the area of interest (AOI) by 10 km.
3.  Retains site-level metadata (`obs_sum`, `spp_rich`) and excludes species columns.


``` r
# Retrieve 19 bioclim layers (≈10-km, WorldClim v2.1) for all grid centroids
data_path = "_data" # cache folder for rasters
enviro_list = dissmapr::get_enviro_data(
  data       = grid_spp, # centroids + obs_sum + spp_rich
  buffer_km  = 10, # pad the AOI slightly
  source     = "geodata", # WorldClim/SoilGrids interface
  var        = "bio", # bioclim variable set
  res        = 5, # 5-arc-min ≈ 10 km
  grid_r     = grid_r, # To set resampling resolution, if necessary
  path       = data_path,
  sp_cols    = 7:ncol(grid_spp), # ignore species columns
  ext_cols   = c("obs_sum", "spp_rich") # carry effort & richness through
)

# Quick checks
str(enviro_list, max.level = 1)

# (Optional) Assign concise layer names for readability
# Find names here https://www.worldclim.org/data/bioclim.html
names_env = c(
  "temp_mean", "mdr", "iso", "temp_sea", "temp_max", "temp_min",
  "temp_range", "temp_wetQ", "temp_dryQ", "temp_warmQ",
  "temp_coldQ", "rain_mean", "rain_wet", "rain_dry",
  "rain_sea", "rain_wetQ", "rain_dryQ", "rain_warmQ", "rain_coldQ"
)
names(enviro_list$env_rast) = names_env

# (Optional) Promote frequently-used objects
env_r = enviro_list$env_rast # cropped climate stack
env_df = enviro_list$env_df # site × environment data-frame

# Quick checks
env_r
dim(env_df)
head(env_df)

# Build the final site × environment table
grid_env = env_df |>
  dplyr::select(
    site_id, x, y,
    obs_sum, spp_rich, dplyr::everything()
  ) |>
  dplyr::mutate(across(
    .cols = -c(site_id, x, y, obs_sum, spp_rich), # all other columns
    .fns = ~ as.numeric(scale(.x)), # Scale bio
    .names = "{.col}" # keep same names
  ))

str(grid_env, max.level = 1)
head(grid_env)
```

#### Remove highly correlated predictors (Optional)

Finally, [`dissmapr::rm_correlated()`](https://b-cubed-eu.github.io/dissmapr/reference/rm_correlated.html) optionally reduces multicollinearity by filtering out highly correlated predictors based on a threshold (e.g. r \> 0.70), improving model stability and interpretability. Together, these functions provide a reproducible and scalable pipeline for preparing ecological datasets for spatial analysis.


``` r
# # (Optional) Rename BIO
# names(env_df) = c("grid_id", "centroid_lon", "centroid_lat", names_env, "obs_sum", "spp_rich")
#
# # Run the filter and compare dimensions
# # Filter environmental predictors for |r| > 0.70
# env_vars_reduced = dissmapr::rm_correlated(
#   data       = env_df[, 4:23],  # drop ID + coord columns
#   cols       = NULL,                  # infer all numeric cols
#   threshold  = 0.70,
#   plot       = TRUE                   # show heat-map of retained vars
# )
#
# # Before vs after
# c(original = ncol(env_df[, c(4, 6:24)]),
#   reduced  = ncol(env_vars_reduced))
```

---

### Data access and preparation using `invasimapr`

This section sets up data needed by all downstream wrappers: site locations, environmental covariates, resident community matrices, and species traits. It also shows how to enrich traits with metadata, and how to simulate invader trait tables for later steps.

#### Retrieve and link trait and metadata for each species

`get_trait_data()` provides an automated pipeline for extracting and joining both biological trait data and rich metadata for any focal species. Many analyses benefit from curated trait columns, short taxonomy summaries, and links to images. `get_trait_data()` consolidates these per species from local trait tables and optional online sources, returning a single tidy row per species for frictionless joins.

:hourglass_flowing_sand: **What it does**: Given a species name, the function looks up traits in a local table (or [TRY](https://www.try-db.org/TryWeb/Home.php)-style database), performs tolerant name matching, optionally scrapes a short [Wikipedia](https://www.wikipedia.org/) description and taxonomy, and can extract a compact image-based colour palette for visual summaries, as follows:

1.  **Trait Table Lookup**: Retrieves species' trait data from a local trait table (CSV) or a [TRY](https://www.try-db.org/TryWeb/Home.php) (Kattge et al 2020) style database, using fuzzy matching to ensure robust linkage even when there are minor naming inconsistencies.
2.  **Wikipedia Metadata Scraping**: Optionally augments each species entry with a taxonomic summary, higher taxonomy, and representative images scraped directly from [Wikipedia](https://www.wikipedia.org/).
3.  **Image-based Color Palette Extraction**: If enabled, downloads and processes public domain images to extract the most frequent colors, optionally removing green/white backgrounds to focus on diagnostic features.
4.  **Flexible Output**: Returns a single-row tibble with the species name, trait data, taxonomic metadata, image URL, and color palette - all harmonized for downstream analyses or visualization.

:information_source: **Why this matters**: Having a consistent, analysis-ready trait table avoids downstream NA cascades, eases plotting, and ensures that residents and invaders share identical column definitions.

:warning: **Practical checks and tips**: Keep resident and invader trait column names identical; prefer factors for categorical traits with explicit levels; store provenance for any scraped fields for reproducibility.


``` r
# Fetch local trait data.frame
btfly_traits = read.csv(system.file("extdata", "species_traits.csv", package = "invasimapr"))
str(btfly_traits)
#> 'data.frame':	27 obs. of  21 variables:
#>  $ species     : chr  "Acraea horta" "Amata cerbera" "Bicyclus safitza safitza" "Cacyreus lingeus" ...
#>  $ trait_cont1 : num  0.83 0.874 -0.428 0.661 0.283 ...
#>  $ trait_cont2 : num  0.811 -0.106 0.672 0.475 0.622 ...
#>  $ trait_cont3 : num  -0.922 0.498 0.355 -0.657 -0.478 ...
#>  $ trait_cont4 : num  -0.684 -0.282 0.291 0.552 0.127 ...
#>  $ trait_cont5 : num  0.0715 -0.9955 0.2179 0.6736 0.503 ...
#>  $ trait_cont6 : num  0.16 0.643 -0.773 0.529 0.247 ...
#>  $ trait_cont7 : num  0.2035 -0.606 0.0705 -0.6409 -0.0962 ...
#>  $ trait_cont8 : num  -0.425 -0.611 0.568 -0.742 -0.742 ...
#>  $ trait_cont9 : num  0.1493 -0.2933 0.0949 0.7854 -0.02 ...
#>  $ trait_cont10: num  -0.5772 0.0992 -0.036 -0.6811 -0.7008 ...
#>  $ trait_cat11 : chr  "wetland" "forest" "wetland" "wetland" ...
#>  $ trait_cat12 : chr  "diurnal" "nocturnal" "diurnal" "nocturnal" ...
#>  $ trait_cat13 : chr  "bivoltine" "multivoltine" "univoltine" "multivoltine" ...
#>  $ trait_cat14 : chr  "detritivore" "detritivore" "generalist" "nectarivore" ...
#>  $ trait_cat15 : chr  "migratory" "resident" "resident" "migratory" ...
#>  $ trait_ord16 : int  4 1 4 3 4 1 1 4 1 1 ...
#>  $ trait_ord17 : int  1 4 4 3 2 4 3 5 4 3 ...
#>  $ trait_bin18 : int  1 1 1 0 1 1 1 1 0 0 ...
#>  $ trait_bin19 : int  1 0 1 0 0 1 1 1 0 1 ...
#>  $ trait_ord20 : chr  "medium" "large" "medium" "medium" ...

# Retrieve and join trait/metadata for all species in the observation set
spp_traits = purrr::map_dfr(
  unique(grid_obs$species), # unique(longDF$species),
  ~ invasimapr::get_trait_data(
    species = .x,
    n_palette = 5,
    preview = FALSE,
    do_summary = TRUE,
    do_taxonomy = TRUE,
    do_image = TRUE,
    do_palette = TRUE,
    local_trait_df = btfly_traits,
    local_species_col = "species",
    max_dist = 1
  )
)
#> Error in `map()`:
#> ℹ In index: 1.
#> Caused by error in `.f()`:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt
# The final output combines trait data, taxonomic info, Wikipedia summary, images, and color palette for each species.
# This integrated dataset supports multi-faceted biodiversity, trait, and visualization analyses.

# Check output
str(spp_traits, 1)
#> Error:
#> ! object 'spp_traits' not found
head(spp_traits[1:5,1:5])
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'spp_traits' not found
```

---

### Alternatively, load a local combined site-environment-trait file

If you already maintain a single long file that includes sites, coordinates, species, counts, environment, and traits, you can start directly from that structure and let `prepare_inputs()` parse columns by prefixes.

:hourglass_flowing_sand: **What it does**: This code reads a demo CSV, selects canonical columns, coerces character fields to factors, and renames the site identifier. The resulting `longDF` feeds straight into the wrapper.

:information_source: **Why this matters**: A single schema keeps alignment errors low and simplifies lineage tracking for each variable class.

:warning: **Practical checks and tips**: Use stable prefixes like `env_*` and `trait_*`; keep `site`, `x`, `y`, `species`, and `count` present and well-typed.


``` r
# Example data (invasimapr demo)
site_env_spp = read.csv(
  system.file("extdata","site_env_spp_simulated.csv.gz", package = "invasimapr")
)

# Long format
longDF = site_env_spp |>
  dplyr::select(site_id, x, y, species, count,
                dplyr::starts_with("env"),
                dplyr::starts_with("trait_")) |>
  dplyr::mutate(across(where(is.character), as.factor))
colnames(longDF)[colnames(longDF) == "site_id"] = "site"
head(longDF[1:5,1:5])
#>   site     x         y                  species count
#> 1 1026 28.75 -22.25004             Acraea horta    10
#> 2 1026 28.75 -22.25004            Amata cerbera     0
#> 3 1026 28.75 -22.25004 Bicyclus safitza safitza     0
#> 4 1026 28.75 -22.25004         Cacyreus lingeus     0
#> 5 1026 28.75 -22.25004      Charaxes wakefieldi     9
```

**Import separate tables (Optional)**


``` r
# # site_df = read.csv('D:/Data/Simulations/env_sites_t0.csv')[,1:3]
# site_df = read.csv('D:/Data/Simulations/env_sites_t0_v2.csv')[,1:3]
# # head(site_df)
# dim(site_df)
# 
# # env_df = read.csv('D:/Data/Simulations/env_sites_t0.csv')[,-c(4:5)]
# env_df = read.csv('D:/Data/Simulations/env_sites_t0_v2.csv')[,-c(4:5)]
# # head(env_df)
# dim(env_df)
# 
# # comm_res = read.csv('D:/Data/Simulations/community_t0.csv')
# comm_res = read.csv('D:/Data/Simulations/community_t0_v2.csv')
# # head(comm_res)
# dim(comm_res)
# 
# # traits_res = read.csv('D:/Data/Simulations/species_traits_t0.csv')
# traits_res = read.csv('D:/Data/Simulations/species_traits_t0_v2.csv')
# # head(traits_res)
# dim(traits_res)
```

---

### Prepare residents' community data with `prepare_inputs()`

`prepare_inputs()` assembles and aligns the core matrices in one call, whether you start from a single long table or from separate site, environment, community, and trait tables. Under the hood it checks and standardises column names, reconciles data types, and aligns keys so that the five core objects share a common index: **sites** $S$, **environment** $E$, **resident IDs** $J$, **abundances** $N$, and **traits** $T$.

The result is a compact **`invasimapr_fit`** object that downstream steps simply extend. Optional utilities can be invoked at this stage to attach trait metadata or to generate hypothetical invaders, but the primary job here is reliable assembly and alignment of those core matrices-ready for everything that follows.

:hourglass_flowing_sand: **What it does**: It isolates unique site coordinates, constructs a site × environment matrix, produces site × species abundance and presence-absence tables, and builds a species × traits table. It records dimensions in `fit$meta` and can compute simple site diversity summaries.

:information_source: **Why this matters**: All downstream geometry (trait space), modelling, and prediction assume strict row/column alignment across these matrices; the wrapper guarantees this and surfaces early warnings.

:warning: **Practical checks and tips**: From a long table, keep at least `site,x,y,species,count` plus `env_*` and `trait_*`. If tables are separate, ensure identical site rownames across `site_df`, `env_df`, `comm_res`, `pa_res`, and trait rownames that match community column names.


:zap: **Run `prepare_inputs()`** to initialises `fit` with aligned inputs. Use this as the single source of truth for sites, community matrices, and traits for all subsequent wrappers.


``` r
# ---- Option A: one long table -----------------------------------------------
# try(source("D:/Methods/R/myR_Packages/b-cubed-versions/invasimapr/R/prepare_inputs.R"), silent = TRUE)
# if (!exists("prepare_inputs")) stop("prepare_inputs() not found.")

# # ---- Option A: One long table ----------------------------------
# stopifnot(all(c("site","x","y","species","count") %in% names(longDF)))
fit = prepare_inputs(
  long_df            = longDF,
  comm_long          = "auto",
  site_col           = "site", x_col = "x", y_col = "y",
  species_col        = "species", count_col = "count",
  env_cols           = NULL,    env_prefix   = "^env",
  trait_cols         = NULL,    trait_prefix = "^trait",
  drop_empty_sites   = TRUE,
  drop_empty_species = TRUE,
  return_diversity   = TRUE,
  make_plots         = FALSE
)
#> Error in `prepare_inputs()`:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

# # ---- Option B: already have separate tables ----------------------------------
# fit = prepare_inputs(
#   site_df            = site_df,
#   env_df             = env_df,
#   comm_res           = comm_res,
#   traits_res         = traits_res,
#   comm_long          = "auto",
#   site_col           = "site_id",
#   x_col              = "lon",
#   y_col              = "lat",
#   species_col        = "species",
#   count_col          = "abundance",
#   env_cols           = c('temp','precip','elev','aridity','fire_freq','human_index','habitat','geology'),
#   trait_cols         = c('guild','thermal_opt','moisture_opt','SLA','seed_mass','dispersal','body_size','trophic_level','life_history'),
#   drop_empty_sites   = TRUE,
#   drop_empty_species = TRUE,
#   return_diversity   = TRUE,
#   make_plots         = FALSE
# )

print(fit)
#> Error:
#> ! object 'fit' not found
str(fit$inputs, 1)
#> Error:
#> ! object 'fit' not found
```


:card_index_dividers: **Save the matrices** to use downstream and perform quick sanity check before heavy computation.


``` r
site_df    = fit$inputs$site_df
#> Error:
#> ! object 'fit' not found
env_df     = fit$inputs$env_df
#> Error:
#> ! object 'fit' not found
comm_res   = fit$inputs$comm_res
#> Error:
#> ! object 'fit' not found
pa_res     = fit$inputs$pa_res
#> Error:
#> ! object 'fit' not found
traits_res = fit$inputs$traits_res
#> Error:
#> ! object 'fit' not found

stopifnot(
  identical(rownames(site_df), rownames(env_df)),
  identical(rownames(site_df), rownames(comm_res)),
  identical(rownames(site_df), rownames(pa_res)),
  setequal(colnames(comm_res), rownames(traits_res))
)
#> Error:
#> ! object 'site_df' not found

cat("#sites:", nrow(site_df), " | #env:", ncol(env_df),
    " | #residents:", ncol(comm_res),
    " | #traits:", ncol(traits_res), "\n")
#> Error:
#> ! object 'site_df' not found
```


:bar_chart: **Map of resident richness** provides a spatial lens on alpha diversity and sampling intensity before modelling.


``` r
spp_rich_obs = fit$inputs$diversity 
#> Error:
#> ! object 'fit' not found
rsa = sf::st_read(system.file("extdata", "rsa.shp", package = "invasimapr"))
#> Reading layer `rsa' from data source 
#>   `/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/extdata/rsa.shp' 
#>   using driver `ESRI Shapefile'
#> Simple feature collection with 11 features and 8 fields
#> Geometry type: MULTIPOLYGON
#> Dimension:     XY
#> Bounding box:  xmin: 16.45189 ymin: -34.83417 xmax: 32.94498 ymax: -22.12503
#> Geodetic CRS:  WGS 84

col_pal = colorRampPalette(c("blue", "green", "yellow", "orange", "red", "darkred"))
ggplot2::ggplot(spp_rich_obs, ggplot2::aes(x = x, y = y, fill = spp_rich)) +
  ggplot2::geom_tile() +
  ggplot2::scale_fill_gradientn(colors = rev(col_pal(10)), name = "Richness") +
  ggplot2::geom_text(ggplot2::aes(label = spp_rich), color = "grey80", size = 2) +
  ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.4) +
  ggplot2::labs(x = "Longitude", y = "Latitude", title = "Spatial Distribution of Species Richness") +
  ggplot2::theme(panel.grid = ggplot2::element_blank())
#> Error:
#> ! object 'spp_rich_obs' not found
```

> :chart_with_upwards_trend: **Figure 4: Spatial distribution of species richness across the study area.** Each grid cell shows the number of unique species (species richness) in each grid-cell.

:information_source: **Why this matters**: Early spatial diagnostics flag data gaps and uneven effort that can influence crowding and model fits.

:bulb: **Summary**: `prepare_inputs()` locks in a clean, aligned foundation for trait-based analyses; store `fit` and reference it throughout.

---

## Generate hypothetical invaders: $\textit{invader} \times \textit{traits}$

When invader traits are unknown, you can simulate plausible invaders from the resident pool to explore fitness scenarios. `simulate_invaders()` builds an invader trait table aligned with residents.

:hourglass_flowing_sand: **What it does**: It samples trait columns either independently (novel combinations) or row-wise (preserve covariance), supports bounded or distribution-based sampling for numerics, and honours factor levels.

:information_source: **Why this matters**: Simulation supports sensitivity analyses and planning when the exact invader set is uncertain.

:warning: **Practical checks and tips**: Prefer `rowwise` for realism when covariance is essential; use `columnwise` to probe unobserved combinations; keep trait names and levels identical to residents.


``` r
stopifnot(exists("simulate_invaders"))
set.seed(42)

traits_inv = simulate_invaders(
  resident_traits     = traits_res,
  species_col         = NULL,
  n_inv               = 10,
  mode                = "columnwise",      # or "rowwise"
  numeric_method      = "bootstrap",       # "tnorm" / "uniform"
  keep_bounds         = TRUE,
  inv_prefix          = "inv",
  keep_species_column = TRUE,
  seed                = 42
)
#> Error:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

traits_all = rbind(traits_res, traits_inv)
#> Error:
#> ! object 'traits_res' not found
head(traits_all[1:4,1:4]); tail(traits_all[1:4,1:4])
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'traits_all' not found

cat("Simulated invaders:", nrow(traits_inv),
    "| invader traits:", ncol(traits_inv),
    "| total species:", nrow(traits_all),
    "| total traits:", ncol(traits_all), "\n")
#> Error:
#> ! object 'traits_inv' not found
```

:sparkles: **Overall importance**: This closes the data layer: residents, environment, and invaders are harmonised and ready for trait-space construction.

---

## Shared trait space and resident crowding

This wrapper, `prepare_trait_space()`, builds the joint trait geometry (PCoA on Gower), diagnoses centrality and convex hull membership, and computes resident crowding $C_{js}$ with optional site-wise z-scoring. It returns traits, crowding, and (if requested) standardised inputs for modelling. 

:hourglass_flowing_sand: **What the wrapper does (step-by-step)**:

1.  **Standardises** traits leakage-safely;
2.  Computes **Gower distances** and PCoA scores;
3.  Identifies **centroid, density, and hull**;
4.  Builds $C_{js}$ from Hellinger weights and **Gaussian trait kernels**;
5.  Packages **tidy diagnostics and plots**.

### Standardise model inputs (optional)

`standardise_model_inputs()` harmonises resident and invader traits and any numeric environment columns while preventing information leakage.

:hourglass_flowing_sand: **Step-by-step**: It z-scores resident traits and environment with a zero-variance guard &#x2794; scales invader numerics using resident moments &#x2794; coerces factor levels to resident sets &#x2794; optionally drops invader-only columns.

:information_source: **Why this matters**: Comparable scales improve ordination stability and GLMM convergence; resident-based scaling avoids leaking invader information.

:warning: **Practical checks and tips**: Keep invader columns a subset/compatible superset of residents; document factor level harmonisation.

---

## Compute and plot the shared trait space

`compute_trait_space()` builds the unified trait map across residents and invaders using Gower dissimilarities followed by PCoA.

:hourglass_flowing_sand: **Step-by-step**: It computes distances across mixed types &#x2794; projects points to $(\mathrm{tr1},\mathrm{tr2})$ &#x2794; identifies the resident convex hull and centroid &#x2794; and optionally adds density surfaces and a dendrogram.

:information_source: **Why this matters**: Positions relative to the hull and core foreshadow niche overlap and novelty, guiding the interpretation of crowding and abiotic alignment.

:warning: **Practical checks and tips**: Ensure >=3 residents for a stable hull; keep trait schemas identical; record ordination settings for reproducibility.

---

## Determine centrality and convex-hull membership

`compute_centrality_hull()` quantifies where species sit relative to the resident cloud and whether invaders fall inside or outside the realised trait boundary.

:hourglass_flowing_sand: **Step-by-step**: It estimates robust covariance &#x2794; computes Mahalanobis distances &#x2794; rescales to centrality (0 = peripheral, 1 = core) &#x2794; and tests hull membership for each invader.

:information_source: **Why this matters**: Central or in-hull invaders face stronger crowding; peripheral or out-of-hull invaders may experience weaker biotic resistance if the environment suits.

:warning: **Practical checks and tips**: Use robust covariance to limit outlier leverage; keep a tidy table of ranks and flags for later map legends.

---

## Resident crowding $C_{js}$ from composition × trait similarity

`compute_resident_crowding()` integrates community composition and trait similarity into site × resident crowding fields with optional per-site z-scores.

:hourglass_flowing_sand: **Step-by-step**: It Hellinger-transforms abundances to weights $W$ &#x2794; converts resident-resident Gower distances to a Gaussian kernel $K$ with bandwidth $\sigma_\alpha$ (median positive distance by default) &#x2794; and computes $C_{js} = (W K^\top)_{sj}$  &#x2794; with optional row-z standardisation yields $C^{(z)}_{js}$.

:information_source: **Why this matters**: $C_{js}$ is the resident-side template for invader crowding and directly enters invasion fitness.

:warning: **Practical checks and tips**: Verify name alignment between community and traits; examine distance distributions before fixing $\sigma_\alpha$; prefer robust row-scales when z-scoring.


:zap: **Run `prepare_trait_space()`** to construct the trait space, diagnostics, and $C_{js}$ in one step, adding them to `fit`.


``` r
stopifnot(inherits(fit, "invasimapr_fit"),
          !is.null(fit$inputs$traits_res),
          !is.null(fit$inputs$comm_res),
          !is.null(fit$inputs$site_df))
#> Error:
#> ! object 'fit' not found
stopifnot(exists("traits_inv"))
#> Error in `b3doc::rmd_to_md()`:
#> ! exists("traits_inv") is not TRUE

# try(source("D:/Methods/R/myR_Packages/b-cubed-versions/invasimapr/R/prepare_trait_space.R"), silent = TRUE)
# if (!exists("prepare_trait_space")) stop("prepare_trait_space() not found.")

fit = prepare_trait_space(
  fit            = fit,
  traits_inv     = traits_inv,
  crowding_sigma = NULL,   # data-driven default
  do_standardise = TRUE,
  row_z          = FALSE,
  show_plots     = FALSE
)
#> Error:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

# print(fit)
# str(fit, 1)
str(fit$traits, 1)
#> Error:
#> ! object 'fit' not found
str(fit$crowding, 1)
#> Error:
#> ! object 'fit' not found
```


:card_index_dividers: **Save the core trait geometry objects and crowding matrices** used by the residents model and for invader predictions.


``` r
# Trait space & diagnostics
Q_res      = fit$traits$Q_res
#> Error:
#> ! object 'fit' not found
Q_inv      = fit$traits$Q_inv
#> Error:
#> ! object 'fit' not found
gower_all  = fit$traits$gower
#> Error:
#> ! object 'fit' not found
hull_res   = fit$traits$hull
#> Error:
#> ! object 'fit' not found
centroid   = fit$traits$centroid
#> Error:
#> ! object 'fit' not found
central_df = fit$traits$centrality
#> Error:
#> ! object 'fit' not found

# Resident crowding
C_js        = fit$crowding$C_js
#> Error:
#> ! object 'fit' not found
C_js_z      = fit$crowding$C_js_z
#> Error:
#> ! object 'fit' not found
C_mu_s      = fit$crowding$C_mu_s
#> Error:
#> ! object 'fit' not found
C_sd_s      = fit$crowding$C_sd_s
#> Error:
#> ! object 'fit' not found
W_site      = fit$crowding$W_site
#> Error:
#> ! object 'fit' not found
D_res       = fit$crowding$D_res
#> Error:
#> ! object 'fit' not found
K_res_res   = fit$crowding$K_res_res
#> Error:
#> ! object 'fit' not found
sigma_alpha = fit$crowding$sigma_alpha
#> Error:
#> ! object 'fit' not found

# If standardisation ran
traits_res_glmm = fit$inputs_std$traits_res_glmm
#> Error:
#> ! object 'fit' not found
traits_inv_glmm = fit$inputs_std$traits_inv_glmm
#> Error:
#> ! object 'fit' not found
```


Visualise different plots showing how invaders differ markedly in how much they overlap with resident trait strategies: For example, *core invaders* are more constrained by resident crowding, while *peripheral invaders* may exploit unfilled regions of trait space, though often at the cost of reduced environmental alignment. This framework links geometric novelty to invasion fitness expectations.


``` r
# Check output structure
# str(fit$traits, 1)

# Heatmap plot
# fit$traits$plots_ts$dens_plot
fit$traits$plots_ts$dens_plot()  # draws to any current device (screen or file)
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 5**: Heatmap plot showing how all species are mapped into a shared trait space (PCoA on Gower distances). Coloured contours show kernel-density "hotspots" of resident strategies, the white polygon is the resident convex hull (realised niche region), and the white square marks the cloud centroid. Residents (black points) form a clearly **multimodal** structure with two dense modes (upper-right and lower-centre), separated by a lower-density corridor. Invaders (red points) are mostly **inside the hull** and often fall near the dense resident cores, positions that imply **strong niche crowding** penalties. A few invaders sit near the hull boundary or in sparser regions of trait space, indicating **greater novelty** and potentially weaker crowding if local abiotic suitability is high.



``` r
# Dendogram plot
fit$traits$plots_ts$dend_plot
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 6**: Dendogram plot shows hierarchical clustering species using Gower distances. The large splits (branch heights) and coloured/dashed groups reveal **distinct functional syndromes** that align with the density modes in the trait map: a leftmost (purple) clade is well separated, while central clades (blue/green) encompass the dense core, and smaller rightmost clades (yellow) capture peripheral strategies. Together, the panels show a resident community with strong trait structure; invaders overlapping core clusters should experience higher $C^{(z)}$ (crowding), whereas those on the periphery or near gaps in the hull may face weaker biotic resistance and thus higher establishment potential if $r^{(z)}$ is favourable.


:bar_chart: **Centrality ranks and hull maps** to highlight novelty and diagnose ordination and kernel choices. The three figures below, illustrate how invaders position relative to residents in trait space, and how this affects their potential to establish.


``` r
# Check output structure
# str(fit$traits,1)
# str(fit$traits$plots_ch, 1)
# head(fit$crowding$C_js[1:4,1:4])

# Plot Centrality and hull status
if (!is.null(fit$traits$plots_ch)) {
  print(fit$traits$plots_ch$p_trait)
}
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 7**: Centrality and hull status shows **residents (circles)** and **invaders (triangles)** embedded in a **two-dimensional trait space**. The **convex hull (solid polygon)** marks the **realised resident niche**, while the **dashed ellipse** indicates the **central core region**. Colour shading reflects **centrality** (values closer to 1 are deeper within the resident cloud). Many invaders fall inside the hull but with relatively **low centrality**, placing them nearer the trait-space **periphery**. A few invaders lie **outside the hull**, representing **novel strategies** not currently expressed by residents.



``` r
# Plot Mahalanobis distance distribution
fit$traits$plots_ch$p_dist
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 8**: Mahalanobis distance distribution comparisons from the resident centroid. **Residents (grey)** cluster close to the centre, with most distances below 2-3 units. **Invaders (red)** show a broader distribution, with some overlapping resident values but others displaced further into the tails. This highlights greater heterogeneity among invaders, with several occupying marginal or novel positions.



``` r
# Plot Invader ranking by centrality
fit$traits$plots_ch$p_rank
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 9**: Invader ranking by centrality (from peripheral to core). **Peripheral invaders (low centrality)** are often those falling **outside the hull (red bars)**. These species represent the most novel introductions and are expected to experience **weaker crowding**, though their establishment will depend on abiotic suitability. Invaders with **higher centrality (grey bars)** overlap strongly with residents, implying **greater competition** and reduced establishment potential.


:sparkles: **Overall importance**: This stage anchors the trait geometry and the resident-side crowding fields that everything else builds on.

:bulb: **Summary.** You now have a reproducible trait map, novelty diagnostics, and $C^{(z)}_{js}$ on a site-comparable scale.

---

## Resident predictors (standardised): $r^{(z)}_{js}, C^{(z)}_{js}, S^{(z)}_{js}$

`model_residents()` fits a residents-only GLMM that yields site-standardised **abiotic suitability** $r^{(z)}_{js}$ and carries forward **niche crowding** $C^{(z)}_{js}$. It also constructs a **site saturation** index $S^{(z)}_{js}$ broadcast from a site-only score. 

:hourglass_flowing_sand: **What the wrapper does (step-by-step)**:

1.  **Standardises** environment and resident traits for the GLMM,
2.  **Builds** a transparent **formula** (with optional $E\times T$ interactions),
3.  **Fits `glmmTMB`**, 
4.  **Predicts fixed-effects** η for residents, and
5.  Applies per-site **z-scores** to $r_{js}$.
6.  **Computes $S_s$** via a chosen mode and returns $S^{(z)}$.


### Build the model frame and formula

`build_model_formula()` discovers predictors and assembles a formula that is reused for invaders to ensure consistent structure.

:hourglass_flowing_sand: **Step-by-step**: It infers environment and trait terms &#x2794; adds mains and optional $E\times T$ &#x2794; attaches `(1|site) + (1|species)` and optional zero-correlation random slopes &#x2794; returns a valid `formula`.

:information_source: **Why this matters**: Consistent specification across residents and invaders avoids scale drift and makes coefficients interpretable in the trait plane.

:warning: **Checks/tips**: Keep naming conventions stable (`env_*`, `trait_*`); avoid random slopes for site-only indices.


### Fit the residents model (e.g., GLMM)

`prep_resident_glmm()` expands the long site×resident frame, fits `glmmTMB`, and returns fixed-effect predictions as a site×resident matrix.

:hourglass_flowing_sand: **Step-by-step**: It joins site environment and resident traits &#x2794; coerces keys to factors &#x2794; fits a Tweedie log-link GLMM &#x2794; and predicts η with `re.form = NA`.

:information_source: **Why this matters**: Fixed-effect predictions provide an **abiotic suitability** surface without borrowing random effects across species or sites.

:warning: **Checks/tips**: Ensure numeric matrices, no `NA` predictors, and sensible convergence (simplify interactions if needed).


### Site-standardised resident predictors

`standardise_by_site()` centres and scales each site row for $r_{js}$ (and for $C_{js}$ if needed), yielding $r^{(z)}_{js}$ and $C^{(z)}_{js}$.

:hourglass_flowing_sand: **Step-by-step**: It computes row means and SDs (robust optional) &#x2794; guards zero SD &#x2794; and returns z-scores plus moments.

:information_source: **Why this matters**: Within-site scaling makes predictors comparable across species and ensures invaders can be standardised on **resident moments**.

:warning: **Checks/tips**: Prefer robust scaling for skewed $C$; retain `row_mean` and `row_sd` for invader standardisation.


### Site-only saturation $S_s$ and global z-score

`compute_site_saturation()` builds a site-only competition index from totals, modelled dominance, or evenness deficit, then applies a global z-score and broadcasts to species.

:hourglass_flowing_sand: **Step-by-step**: It computes $S_s$ by mode &#x2794; applies global z &#x2794; and returns `S_js_z` for residents.

:information_source: **Why this matters**: $S^{(z)}$ captures non-trait-specific crowding pressure and complements $C^{(z)}$.

:warning: **Checks/tips**: Do not add random slopes on $S_z$ (no within-site variation); guard zero richness.


:zap: **Run `model_residents()`** to fit the resident model (e.g. GLMM), construct standardised predictors, and write results back to `fit$model` and `fit$residents`.


``` r
# try(source("D:/Methods/R/myR_Packages/b-cubed-versions/invasimapr/R/model_residents.R"), silent = TRUE)
# if (!exists("model_residents")) stop("model_residents() not found.")

# Run model_residents() function
fit = model_residents(
  fit,
  family = glmmTMB::tweedie(link = "log"),
  include_env_trait_interactions = TRUE,
  saturation_mode = "evenness_deficit",
  reduce_strategy = 'none',
  robust_r = TRUE
)
#> Error:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

# print(fit)
# str(fit$model, 1)
# str(fit$residents, 1)
summary(fit$residents$fit_r)
#> Error:
#> ! object 'fit' not found
```


:card_index_dividers: **Save the core resident model objects** used for invader predictions.


``` r
str(fit$residents, 1)
#> Error:
#> ! object 'fit' not found
r_js    = fit$residents$r_js
#> Error:
#> ! object 'fit' not found
r_js_z  = fit$residents$r_js_z
#> Error:
#> ! object 'fit' not found
C_js_z  = fit$residents$C_js_z
#> Error:
#> ! object 'fit' not found
S_s_z   = fit$residents$S_s_z
#> Error:
#> ! object 'fit' not found
S_js_z  = fit$residents$S_js_z
#> Error:
#> ! object 'fit' not found

r_mu_s  = fit$residents$r_mu_s
#> Error:
#> ! object 'fit' not found
r_sd_s  = fit$residents$r_sd_s
#> Error:
#> ! object 'fit' not found
```


:bar_chart: **Site map of $S^{(z)}$** and quick checks on the spread of $C^{(z)}$ to help confirm scales and hotspots.



``` r
# str(fit$residents,1)
head(fit$residents$S_js_z[1:4,1:4])
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'fit' not found

site_sat_df = data.frame(
  site  = names(fit$residents$S_s_z),
  S_s_z = as.numeric(fit$residents$S_s_z),
  row.names = NULL, check.names = FALSE) |>
  dplyr::left_join(site_df, by = "site")
#> Error:
#> ! object 'fit' not found

ggplot2::ggplot(site_sat_df, ggplot2::aes(x, y, fill = S_s_z)) +
  ggplot2::geom_tile() +
  ggplot2::scale_fill_viridis_c(name=expression(Mean~S^{(z)}), direction=-1) +
  ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.3) +
  ggplot2::labs(title = expression("Mean saturation (" * S^z * ") across sites"), x = "Longitude", y = "Latitude") +
  ggplot2::theme_minimal()
#> Error:
#> ! object 'site_sat_df' not found
```

> :chart_with_upwards_trend: **Figures 10**: The map shows the mean saturation term ($S^{(z)}$) across sites in South Africa, calculated from the relative abundance structure of resident communities. Warmer colours (yellow) indicate sites with low saturation values, suggesting lower levels of resident dominance, whereas cooler colours (green to purple) highlight sites with higher saturation, where resident communities are dense and strongly filled. The pattern is heterogeneous: several regions, including the south-western Cape and parts of the interior plateau, show pronounced hotspots of high saturation, while coastal and northern areas are more lightly saturated. This map is an important diagnostic for the **site saturation predictor** in the invasion fitness framework. Areas of high $S^{(z)}$ reflect environments where invaders are expected to experience stronger suppression from resident dominance, regardless of their trait alignment. Conversely, low-saturation sites highlight potential windows of opportunity where invaders may establish more easily if abiotic suitability and trait differences align.

:zap: In practice, visualising $S^{(z)}$ confirms both the spatial scaling of the predictor and the ecological plausibility of hotspots, ensuring that subsequent invasion fitness calculations are grounded in realistic community saturation patterns.

:sparkles: **Overall importance**: This step produces resident-only, site-comparable predictors that define the scale on which invaders will be evaluated.

:bulb: **Summary.** You now have $r^{(z)}_{js}$, $C^{(z)}_{js}$, and $S^{(z)}_{js}$ with resident moments saved for invader scaling.

---

## Learn trait- and site-varying sensitivities ($\alpha, \beta, \Gamma/\gamma$)

`learn_sensitivities()` fits an auxiliary GLMM to relate $r^{(z)}, C^{(z)}, S^{(z)}$ to positions in trait space, deriving trait-varying sensitivities and optional site-varying slopes from random-slope components. 

:hourglass_flowing_sand: **What the wrapper does (step-by-step)**:

1.  Builds a long **residents table** with $(\mathrm{tr1},\mathrm{tr2})$,
2.  **Fits interactions** between predictors and the trait plane,
3.  **Extracts slopes** to compute $\alpha_i$, $\beta_i$ (signed optional), $\theta_i$,
4.  Applies a **test for trait-varying $\gamma$** (Wald by default; likelihood-ratio test (LRT) optional), and
5.  (optionally) **Combines site random slopes** to produce $\alpha_{is}$ and $\Gamma_{is}$.


### Auxiliary residents-only model on standardised predictors

`fit_auxiliary_residents_glmm()` estimates how slopes on $r^{(z)}, C^{(z)}, S^{(z)}$ vary with $(\mathrm{tr1},\mathrm{tr2})$.

:hourglass_flowing_sand: **Step-by-step**: It creates one row per site × resident &#x2794; adds predictors and trait coordinates &#x2794; fits interactions `(r_z + C_z + S_z) × (tr1 + tr2)` with `(1|site) + (1|species)` and optional site random slopes for `r_z` and `C_z`.

:information_source: **Why this matters**: The fitted slope systems underpin trait-varying and site-varying sensitivities for invasion fitness.

:warning: **Checks/tips**: Ensure $(\mathrm{tr1},\mathrm{tr2})$ come from the same PCoA used elsewhere; keep `re.form = NA` when predicting; avoid slopes on site-only `S_z`.


### Trait-varying sensitivities and $\gamma$

`derive_sensitivities()` parses fixed effects to compute trait-dependent coefficients and chooses $\gamma$ via an LRT.

:hourglass_flowing_sand: **Step-by-step**: It evaluates slopes at each invader's $(\mathrm{tr1},\mathrm{tr2})$ &#x2794; maps crowding/saturation slopes to $\alpha_i, \beta_i$ (or signed $\beta$) &#x2794; and returns $\theta_0, \theta_i, \gamma_i$ with diagnostics.

:information_source: **Why this matters**: These parameters translate trait position into how hard crowding bites and how steep abiotic gains are.

:warning: **Checks/tips**: Match `Q_inv` rownames and columns; inspect distributions of $\alpha_i$ and $\beta_i$ for degeneracy. By default, a Wald $\chi^2$ test is used; set `lrt = "lrt"` for a likelihood-ratio test, or `lrt = "none"` to skip testing.


### Site-varying penalties and slopes $\alpha_{is}$ and $\Gamma_{is}$

`site_varying_alpha_beta_gamma()` combines trait-varying slopes with site random-slope deviations to form site×invader versions where appropriate.

:hourglass_flowing_sand: **Step-by-step**: It sums fixed and random-slope parts for `C_z` and `r_z` &#x2794; clamps $\alpha_{is} \ge 0$ &#x2794; and returns tidy tables for heatmaps and summaries.

:information_source: **Why this matters**: Site heterogeneity modulates how universal or local the inferred penalties and gains are.

:warning: **Checks/tips**: Include `(0 + C_z || site)` and optionally `(0 + r_z || site)` in the auxiliary model; weak random-slope variance implies little site variation.


:zap: **Run `learn_sensitivities()`** to fit the auxiliary model, derive trait- and site-varying sensitivities, and attach them to `fit$sensitivities`.


``` r
# try(source("D:/Methods/R/myR_Packages/b-cubed-versions/invasimapr/R/learn_sensitivities.R"), silent = TRUE)
# if (!exists("learn_sensitivities")) stop("learn_sensitivities() not found.")

fit = learn_sensitivities(
  fit,
  use_site_random_slopes = TRUE,
  lrt = TRUE
)
#> Error:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

str(fit$sensitivities, 1)
#> Error:
#> ! object 'fit' not found

alpha_i        = fit$sensitivities$alpha_i
#> Error:
#> ! object 'fit' not found
beta_i         = fit$sensitivities$beta_i
#> Error:
#> ! object 'fit' not found
beta_signed_i  = fit$sensitivities$beta_signed_i
#> Error:
#> ! object 'fit' not found
theta0         = fit$sensitivities$theta0
#> Error:
#> ! object 'fit' not found
theta_i        = fit$sensitivities$theta_i
#> Error:
#> ! object 'fit' not found
gamma_i        = fit$sensitivities$gamma_i
#> Error:
#> ! object 'fit' not found
alpha_is       = fit$sensitivities$alpha_is
#> Error:
#> ! object 'fit' not found
Gamma_is       = fit$sensitivities$Gamma_is
#> Error:
#> ! object 'fit' not found
sens_df        = fit$sensitivities$sens_df
#> Error:
#> ! object 'fit' not found
abg_df         = fit$sensitivities$abg_df
#> Error:
#> ! object 'fit' not found

head(sens_df[1:4,1:4]); head(abg_df[1:4,1:4])
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'sens_df' not found
```


:bar_chart: **Heatmaps** of $\alpha_{is}$ and $\Gamma_{is}$ that reveal spatial heterogeneity and **barplots** that summarise mean effects across invaders.


``` r
ggplot2::ggplot(abg_df, ggplot2::aes(invader, site, fill = alpha_is)) +
    ggplot2::geom_tile() + ggplot2::scale_fill_viridis_c(name = expression(alpha[is])) +
    ggplot2::labs(title = expression("Site-varying " * alpha[is]),
         x = "Invader", y = "Site") + ggplot2::theme_minimal(base_size = 11) +
    ggplot2::theme(axis.text.x = ggplot2::element_text(angle = 90, vjust = 0.5))
#> Error:
#> ! object 'abg_df' not found
```

> :chart_with_upwards_trend: **Figure 11**: The heatmaps show how sensitivity to crowding ($\alpha_{is}$) varies across sites and invaders. Each column corresponds to an invader, each row to a site, and the colour scale represents the parameter value. Here, $\alpha_{is}$ values are consistently positive but display subtle gradients across sites, indicating that some environments impose stronger penalties from trait overlap than others. This heterogeneity reflects local differences in how resident communities constrain invaders: higher $\alpha_{is}$ (yellow-green) means stronger crowding effects, while lower values (blue-purple) suggest weaker suppression.



``` r
ggplot2::ggplot(abg_df, ggplot2::aes(invader, site, fill = Gamma_is)) +
    ggplot2::geom_tile() + 
  ggplot2::scale_fill_viridis_c(name = expression(Gamma[is])) +
    ggplot2::labs(title = expression("Site-varying " * Gamma[is]),
         x = "Invader", y = "Site") + ggplot2::theme_minimal(base_size = 11) +
    ggplot2::theme(axis.text.x = ggplot2::element_text(angle = 90, vjust = 0.5))
#> Error:
#> ! object 'abg_df' not found
```

> :chart_with_upwards_trend: **Figure 12**: The heatmaps show how sensitivity to abiotic scaling ($\Gamma_{is}$, second) varies across sites and invaders.Each column corresponds to an invader, each row to a site, and the colour scale represents the parameter value. Here, $\Gamma_{is}$ values describe how abiotic suitability scales for each invader--site combination. Most values fall near zero to moderate positive ranges, but some sites show locally elevated $\Gamma_{is}$, highlighting environments where abiotic alignment disproportionately boosts invasion fitness.

:bar_chart: Together, the plots above confirm that invasion fitness is shaped by **site-specific interactions**: even with the same trait predictors, the balance between abiotic suitability and crowding penalties varies geographically. This heterogeneity is crucial for interpreting invasion outcomes, since invaders may thrive in sites where abiotic boosts outweigh crowding, while failing elsewhere despite similar trait distances.

:sparkles: **Overall importance**: These sensitivities are the coefficients that connect predictors to invasion fitness in flexible ways (constant, trait-varying, site-varying).

:bulb: **Summary.** You now have $\alpha_i$, $\beta_i$ (and optional signed), $\theta_i$ and $\gamma_i$, plus $\alpha_{is}$, $\Gamma_{is}$ where random slopes support site variation.

---

## Invader predictors $r^{(z)}_{is}, C^{(z)}_{is}, S^{(z)}_{is}$

`predict_invaders()` builds invader-side pillars on the **resident scale** using the residents GLMM, trait geometry, and resident moments.

:hourglass_flowing_sand: **Step-by-step** `predict_invaders()`:

1. **Predicts invader $r_{is}$** from fixed effects; 
2. **Standardises by resident site** moments; 
3. **Computes** invader-resident distances and kernels to obtain **$C_{is}$**;
4. **Standardises by resident** moments; 
5. Broadcasts $S^{(z)}_s$ to **$S^{(z)}_{is}$**.


:zap: **Run `predict_invaders()`** to produce invader predictor matrices and tidy frames, aligning invaders directly to residents' scales to avoid leakage.


``` r
# try(source("D:/Methods/R/myR_Packages/b-cubed-versions/invasimapr/R/predict_invaders.R"), silent = TRUE)
# if (!exists("predict_invaders")) stop("predict_invaders() not found.")

fit = predict_invaders(fit, traits_inv)
#> Error:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

# str(fit$invaders, 1)

r_is   = fit$invaders$r_is
#> Error:
#> ! object 'fit' not found
r_is_z = fit$invaders$r_is_z
#> Error:
#> ! object 'fit' not found
C_is   = fit$invaders$C_is
#> Error:
#> ! object 'fit' not found
C_is_z = fit$invaders$C_is_z
#> Error:
#> ! object 'fit' not found
S_is_z = fit$invaders$S_is_z
#> Error:
#> ! object 'fit' not found

inv_predict_df = fit$invaders$df
#> Error:
#> ! object 'fit' not found
summary(inv_predict_df)
#> Error:
#> ! object 'inv_predict_df' not found
```


:bar_chart: **Site maps of mean** $r^{(z)}$ and mean $C^{(z)}$ across invaders that reveal abiotic opportunity versus biotic pressure patterns.


``` r
stopifnot(exists("site_df"))
#> Error in `b3doc::rmd_to_md()`:
#> ! exists("site_df") is not TRUE

df_r_site = inv_predict_df |>
  dplyr::group_by(site) |>
  dplyr::mutate(mean_r_z = mean(r_z)) |>
  dplyr::left_join(site_df, by = "site")
#> Error:
#> ! object 'inv_predict_df' not found

ggplot2::ggplot(df_r_site, ggplot2::aes(x, y, fill = mean_r_z)) +
  ggplot2::geom_tile() +
  ggplot2::scale_fill_gradient2(name = expression(Mean~r^{(z)}), midpoint = 0) +
  ggplot2::labs(title = expression("Abiotic suitability " * r^{(z)} * " (site mean across invaders)"),
                x = "x", y = "y") +
  ggplot2::theme_minimal() + 
  ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.3)
#> Error:
#> ! object 'df_r_site' not found
```

> :chart_with_upwards_trend: **Figure 13**: This map summarises how **Abiotic Suitability** ($r^{(z)}$) co-varies across space, averaged over all invaders. Here, the colours reflect the mean abiotic suitability that invaders experience per site. Warmer red tones indicate lower or even negative suitability, while cooler blue tones show higher suitability. The spatial gradients capture regions where abiotic conditions consistently favour or hinder invasion potential.



``` r
stopifnot(exists("site_df"))
#> Error in `b3doc::rmd_to_md()`:
#> ! exists("site_df") is not TRUE

df_C_site = inv_predict_df |>
  dplyr::group_by(site) |>
  dplyr::mutate(mean_C_z = mean(C_z)) |>
  dplyr::left_join(site_df, by = "site")
#> Error:
#> ! object 'inv_predict_df' not found

ggplot2::ggplot(df_C_site, ggplot2::aes(x, y, fill = mean_C_z)) +
  ggplot2::geom_tile() +
  ggplot2::scale_fill_viridis_c(name = expression(Mean~C^{(z)}), direction = 1) +
  ggplot2::labs(
    title = expression("Trait-similar crowding " * C^{(z)} * " (site mean across invaders)"),
    x = "x", y = "y"
  ) +
  ggplot2::theme_minimal() +
  ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.3)
#> Error:
#> ! object 'df_C_site' not found
```

> :chart_with_upwards_trend: **Figure 14**: This map summarises how **Trait-similar Crowding** ($C^{(z)}$) or biotic pressure co-varies across space, averaged over all invaders. Here, the colours represent the average intensity of biotic pressure from resident communities, scaled by trait similarity. Higher values (yellow-green) highlight areas where residents are more functionally similar to potential invaders, thus exerting stronger competitive exclusion. Lower values (blue-purple) identify sites where invaders may face less trait-overlap pressure.


:bar_chart: Together, these maps provide a spatial lens on the **trade-off between abiotic opportunity and biotic resistance**: invasion is more likely where $r^{(z)}$ is high and $C^{(z)}$ is low, and less likely where the opposite holds.

:sparkles: **Overall importance**: Invader predictors are now on the same within-site scales as residents, enabling apples-to-apples fitness calculations.

:bulb: **Summary.** You now have $r^{(z)}_{is}$, $C^{(z)}_{is}$, $S^{(z)}_{is}$ aligned to resident moments and ready for $\lambda$.

---

## Invasion fitness ($\lambda$) and establishment probability ($P$)

`predict_establishment()` combines invader predictors with sensitivities under a set of options (A-E) and maps $\lambda$ to probabilities with probit/logit/hard rules.

:hourglass_flowing_sand: **Step-by-step** `predict_establishment()`:

1.  Selects coefficients (constant, trait-varying, site-varying),
2.  optionally calibrates a resident baseline,
3.  computes $\lambda_{is}$, and transforms to $P_{is}$.
5.  Finally, it returns matrices plus tidy long frames and optional plots.


:zap: **Run `predict_establishment()`** to produce $\lambda$ and $P$ surfaces for chosen options, with maps and ranks for rapid review.


``` r
library(ggplot2)  # ensures waiver() exists
# try(source("D:/Methods/R/myR_Packages/b-cubed-versions/invasimapr/R/predict_establishment.R"), silent = TRUE)
# if (!exists("predict_establishment")) stop("predict_establishment() not found.")

fit = predict_establishment(
  fit,
  option         = "A",          # try "A"..."E"
  prob_method    = "hard",       # "probit", "logit", or "hard"
  prob_scale     = list(sigma = 1),
  calibrate_kappa = TRUE,
  boundary_sf    = rsa
)
#> Error:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb' is corrupt

str(fit,1)
#> Error:
#> ! object 'fit' not found
# str(fit$fitness, 1)
# str(fit$prob, 1)

lambda_is = fit$fitness$lambda_is
#> Error:
#> ! object 'fit' not found
p_is      = fit$prob$p_is
#> Error:
#> ! object 'fit' not found
# fit_lambda = fit$fitness$lambda_long
```


:bar_chart: **Overall mean** $\lambda$ maps that summarise openness, **probability heatmaps** and **per-invader faceted maps** reveal where and for whom establishment is likely.


``` r
if (!is.null(fit$prob$plots$heatmap))     fit$prob$plots$heatmap
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 15**: This figure illustrates the spatial and invader-specific structure of establishment likelihood. Rows correspond to sites and columns to invaders, with cells showing binary establishment outcomes. The sparse but structured pattern of yellow cells (successful establishment) indicates that invasion is not uniform but instead constrained by both species identity and site context.



``` r
# str(fit$prob$plots, 1)
if (!is.null(fit$prob$plots$site_mean))     fit$prob$plots$site_mean
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 16**: Spatial pattern of establishment under Option A ($\gamma$ = 1). Tiles show the number/proportion of species establishing per grid cell (“# establishing”), from low (brown) to high (blue), over South Africa’s boundaries.



``` r
# str(fit$prob$plots, 1)
if (!is.null(fit$prob$plots$invader_mean))     fit$prob$plots$invader_mean
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 17**: Invasiveness ranking by invader. Bars show the mean fraction of sites where intrinsic growth is positive ($\lambda$ > 0) for each invader, averaged across all sites and ordered from highest (more invasive; e.g., inv7, inv9) to lowest (e.g., inv10).


``` r
fitness_df = fit$fitness$lambda_long |>
  dplyr::group_by(site, x, y, option) |>
  dplyr::summarise(lambda_mean = mean(lambda, na.rm = TRUE), .groups = "drop")
#> Error:
#> ! object 'fit' not found
```



``` r
ggplot2::ggplot(fitness_df, ggplot2::aes(x, y, fill = lambda_mean)) +
  ggplot2::geom_tile() +
  ggplot2::scale_fill_gradient2(name = "Mean lambda", midpoint = -1.707) +
  ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.3) +
  ggplot2::labs(title = fitness_df$option, x = "x", y = "y") +
  ggplot2::theme_minimal()
#> Error:
#> ! object 'fitness_df' not found
```

> :chart_with_upwards_trend: **Figure 18**: This figures illustrates the spatial and invader-specific structure of establishment likelihood. **Mean $\lambda$** is mapped with colours reflecting the site-level mean fitness ($\lambda$) of invaders under option A ($\gamma=1$), summarising overall openness to establishment. Negative values (brown) dominate, showing that most sites are generally resistant, while scattered blue patches identify hotspots where conditions are sufficiently favourable for invader persistence.


:bar_chart: Together, the heatmap and map highlight the **joint filtering effects** of species identity and geography: while few invaders succeed broadly, specific site--species combinations align to permit establishment, with spatial clustering of higher openness revealing invasion-prone regions.

:sparkles: **Overall importance**: These outputs translate biotic and abiotic structure into explicit establishment surfaces, ready for summary and decision-support.

:bulb: **Summary.** You now have $\lambda_{is}$ and $P_{is}$ under clear assumptions (A-E), with diagnostics to choose a working specification.

---

## Summaries: species, traits, and sites

`summarise_results()` distils the full $\lambda$ or $P$ surfaces into indicators of species invasiveness $V_i$, site invasibility $V_s$, and trait correlates, with tidy tables and plots.

:hourglass_flowing_sand: **Step-by-step** `summarise_results()`:

1.  **Computes $V_i$** and **$V_s$** (hard or probabilistic),
2.  **Ranks** invaders and sites,
3.  Quantifies **trait-fitness relationships**, and
4.  Returns **plots** (e.g. maps, heatmaps, lollipop plots) and **summary tables**.


:zap: **Run `summarise_results()`** to produce decision-ready summaries and figures linked back to the same predictors and trait geometry.


``` r
# try(source("D:/Methods/R/myR_Packages/b-cubed-versions/invasimapr/R/summarise_results.R"), silent = TRUE)
# if (!exists("summarise_results")) stop("summarise_results() not found.")

fit = summarise_results(
  fit,
  use_probabilistic = TRUE,
  make_plots        = TRUE,
  boundary_sf       = rsa
)
#> Error:
#> ! read failed on /Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/invasimapr/R/invasimapr.rdb

str(fit, 1)
#> Error:
#> ! object 'fit' not found
str(fit$summary, 1)
#> Error:
#> ! object 'fit' not found
# head(dplyr::arrange(fit$summary$species, dplyr::desc(V_i)), 10)
# head(dplyr::arrange(fit$summary$site,    dplyr::desc(total_expected %||% n_est)), 10)
# fit$summary$trait_effects

```


:bar_chart: **Species & trait invasiveness and site invasibility maps**


``` r
if (!is.null(fit$summary$plots$invader_rank))  fit$summary$plots$invader_rank
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 19**: **Invasiveness - probabilistic** view where bars show the mean probability of establishment across sites for each invader. A steep drop from the top few taxa to the remainder indicates a short "high-risk list": a small subset of invaders (e.g., inv6--inv7) are consistently more likely to establish, while others rarely exceed low single-digit probabilities. This ranking is useful for triage and horizon scanning.



``` r
if (!is.null(fit$summary$plots$site_map))      fit$summary$plots$site_map
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 20**: **Invasibility map - probabilistic** view where colours map the **expected number of establishing invaders** per site (sum of probabilities), highlighting geographic hotspots of openness. Most of the country remains resistant (dark tones), but clusters of higher expected establishment emerge along specific regions and borders, suggesting where surveillance or rapid response capacity would yield the greatest return.



``` r
if (!is.null(fit$summary$plots$heatmap))       fit$summary$plots$heatmap
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 21**: **Establishment matrix** with binary establishment outcomes from the probabilistic model shown across sites and invaders. Rows are sites, columns are invaders; tiles show establishment (1, red) vs non-establishment (0, grey), illustrating heterogeneity among invaders and among sites.



``` r
if (!is.null(fit$summary$plots$trait_effects)) fit$summary$plots$trait_effects
#> Error:
#> ! object 'fit' not found
```

> :chart_with_upwards_trend: **Figure 22**: **Trait invasiveness effects** view with a lollipop plot ranks traits by their association with mean establishment probability (\|β\| for continuous traits; ANOVA $R^2$ for categorical/ordinal). A small set of continuous traits dominate the signal (right side, several with $p<0.05$), implying that functional axes captured by those traits systematically raise or lower invasion success. Categorical/ordinal traits contribute more modestly, pointing to ecologically relevant but weaker thresholds or syndromes.


:bar_chart: A few invaders and a few trait axes drive most risk, and their success concentrates in identifiable regions. This combination, **who**, **why**, and **where**, provides a clear basis for prioritising monitoring, pathway management, and site-level mitigation. Ranked bars highlight consistently risky invaders; site maps show hotspots of openness; heatmaps reveal joint structure; trait lollipops identify functional correlates.

:sparkles: **Overall importance**: These summaries compress high-dimensional predictions into interpretable priorities for surveillance and management.

:bulb: **Summary.** You now have species ranks $V_i$, site maps $V_s$, and trait effect sizes - linked transparently to the earlier geometry, predictors, and sensitivities.

---


``` r
# # 1) Count of all val==1 by site (heatmap)
# site_counts = fit$summary$establish_long |>
#   group_by(site, x, y) |>
#   summarise(n_val1 = sum(val == 1L, na.rm = TRUE),
#             p_val1 = (sum(val == 1L, na.rm = TRUE)/length(unique(fit$summary$establish_long$invader)))*100, .groups = "drop")
# head(site_counts)
# 
# p_count = ggplot2::ggplot(site_counts, ggplot2::aes(x, y, fill = n_val1)) +
#   ggplot2::geom_tile() +
#   ggplot2::coord_equal() +
#   ggplot2::scale_fill_viridis_c(name = "# invaders with val = 1", option = "C") +
#   ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.35) +
#   ggplot2::labs(title = "Count of val = 1 by site", x = "Longitude", y = "Latitude") +
#   ggplot2::theme_minimal(base_size = 12)
# print(p_count)

# p_prop = ggplot2::ggplot(site_counts, ggplot2::aes(x, y, fill = p_val1)) +
#   ggplot2::geom_tile() +
#   ggplot2::coord_equal() +
#   ggplot2::scale_fill_viridis_c(name = "% invaders with val = 1", option = "C") +
#   ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.35) +
#   ggplot2::labs(title = "% of val = 1 by site", x = "Longitude", y = "Latitude") +
#   ggplot2::theme_minimal(base_size = 12)
# print(p_prop)

# 2) Separate maps per invader: val=1 red, val=0 dark grey
df_inv = fit$summary$establish_long |>
  dplyr::mutate(val_f = factor(val, levels = c(0, 1)))
#> Error:
#> ! object 'fit' not found

p_facets = ggplot2::ggplot(df_inv, ggplot2::aes(x, y, fill = val_f)) +
  ggplot2::geom_tile() +
  ggplot2::coord_equal() +
  ggplot2::scale_fill_manual(
    values = c(`0` = "grey20", `1` = "#d7301f"),
    labels = c(`0` = "0", `1` = "1"),
    name   = "val"
  ) +
  ggplot2::facet_wrap(~ invader, ncol = 5) +
  ggplot2::geom_sf(data = rsa, inherit.aes = FALSE, fill = NA, color = "black", size = 0.35) +
  labs(title = "Per-invader maps (val = 1 in red, val = 0 in dark grey)",
       x = "Longitude", y = "Latitude") +
  ggplot2::theme_minimal(base_size = 12) +
  ggplot2::theme(axis.text.x = ggplot2::element_blank(),
        axis.text.y = ggplot2::element_blank())
#> Error:
#> ! object 'df_inv' not found
print(p_facets)
#> Error:
#> ! object 'p_facets' not found
```

> :chart_with_upwards_trend: **Figure 23**: Per-invader maps of binary establishment across South Africa. Each panel is one invader; red cells indicate establishment (1) and dark grey non-establishment (0). Common grid and coastline enable direct comparison of spatial patterns among invaders.

---

## Common pitfalls & quick fixes

Final guardrails for robust runs and reproducibility.

-   **Name alignment.** All site-indexed matrices use identical rownames; community columns match trait rownames.
-   **Hull stability.** Use ≥3 residents; otherwise centrality/hull diagnostics may be skipped.
-   **Standardisation leakage.** Scale invaders using **resident** moments only.
-   **Prediction scale.** Use fixed-effects predictions (`re.form = NA`) for both residents and invaders.
-   **Saturation slopes.** Do **not** add `(0 + S_z || site)`; `S_z` has no within-site variation.



---

## Session information


``` r
sessionInfo()
#> R version 4.5.2 (2025-10-31)
#> Platform: aarch64-apple-darwin20
#> Running under: macOS Tahoe 26.5.1
#> 
#> Matrix products: default
#> BLAS:   /System/Library/Frameworks/Accelerate.framework/Versions/A/Frameworks/vecLib.framework/Versions/A/libBLAS.dylib 
#> LAPACK: /Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/lib/libRlapack.dylib;  LAPACK version 3.12.1
#> 
#> locale:
#> [1] en_US.UTF-8/en_US.UTF-8/en_US.UTF-8/C/en_US.UTF-8/en_US.UTF-8
#> 
#> time zone: Europe/Brussels
#> tzcode source: internal
#> 
#> attached base packages:
#> [1] stats     graphics  grDevices utils     datasets  methods   base     
#> 
#> other attached packages:
#>  [1] invasimapr_0.2.0    future.apply_1.20.2 future_1.70.0       cluster_2.1.8.2     pbapply_1.7-4      
#>  [6] RColorBrewer_1.1-3  geosphere_1.6-8     corrplot_0.95       caret_7.0-1         lattice_0.22-9     
#> [11] mclust_6.1.2        patchwork_1.3.2     viridis_0.6.5       viridisLite_0.4.3   ggplot2_4.0.3      
#> [16] zetadiv_1.3.0       scam_1.2-22         tidyterra_1.2.0     sf_1.1-1            zoo_1.8-15         
#> [21] tidyr_1.3.2         dplyr_1.2.1         data.table_1.18.4   geodata_0.6-9       terra_1.9-34       
#> [26] httr_1.4.8          dissmapr_0.2.0      here_1.0.2          purrr_1.2.2         yaml_2.3.12        
#> 
#> loaded via a namespace (and not attached):
#>   [1] rstudioapi_0.18.0    wk_0.9.5             magrittr_2.0.5       estimability_1.5.1  
#>   [5] nloptr_2.2.1         farver_2.1.2         rmarkdown_2.31       fs_2.1.0            
#>   [9] fields_17.3          vctrs_0.7.3          minqa_1.2.8          htmltools_0.5.9     
#>  [13] curl_7.1.0           s2_1.1.11            pROC_1.19.0.1        parallelly_1.47.0   
#>  [17] glm2_1.2.1           KernSmooth_2.23-26   desc_1.4.3           sandwich_3.1-1      
#>  [21] plyr_1.8.9           emmeans_2.0.3        lubridate_1.9.5      TMB_1.9.19          
#>  [25] lifecycle_1.0.5      iterators_1.0.14     pkgconfig_2.0.3      fuzzyjoin_0.1.8     
#>  [29] Matrix_1.7-4         R6_2.6.1             fastmap_1.2.0        rbibutils_2.4.1     
#>  [33] numDeriv_2016.8-1.1  digest_0.6.39        rprojroot_2.1.1      vegan_2.7-5         
#>  [37] labeling_0.4.3       b3doc_0.3.0.9000     nnls_1.6             timechange_0.4.0    
#>  [41] mgcv_1.9-4           compiler_4.5.2       proxy_0.4-29         remotes_2.5.0       
#>  [45] withr_3.0.3          S7_0.2.2             DBI_1.3.0            pkgbuild_1.4.8      
#>  [49] R.utils_2.13.0       maps_3.4.3           MASS_7.3-65          lava_1.9.1          
#>  [53] rappdirs_0.3.4       classInt_0.4-11      permute_0.9-10       ModelMetrics_1.2.2.2
#>  [57] tools_4.5.2          units_1.0-1          otel_0.2.0           nnet_7.3-20         
#>  [61] R.oo_1.27.1          glue_1.8.1           callr_3.8.0          nlme_3.1-168        
#>  [65] grid_4.5.2           reshape2_1.4.5       generics_0.1.4       recipes_1.3.3       
#>  [69] glmmTMB_1.1.14       gtable_0.3.6         R.methodsS3_1.8.2    class_7.3-23        
#>  [73] utf8_1.2.6           ggrepel_0.9.8        foreach_1.5.2        pillar_1.11.1       
#>  [77] stringr_1.6.0        spam_2.11-4          clValid_0.7          splines_4.5.2       
#>  [81] survival_3.8-6       tidyselect_1.2.1     knitr_1.51           reformulas_0.4.4    
#>  [85] gridExtra_2.3        stats4_4.5.2         xfun_0.59            hardhat_1.4.3       
#>  [89] matrixStats_1.5.0    factoextra_2.0.0     timeDate_4052.112    stringi_1.8.7       
#>  [93] boot_1.3-32          evaluate_1.0.5       codetools_0.2-20     NbClust_3.0.1       
#>  [97] entropy_1.3.2        tibble_3.3.1         cli_3.6.6            rpart_4.1.24        
#> [101] Rdpack_2.6.6         xtable_1.8-8         processx_3.9.0       Rcpp_1.1.1-1.1      
#> [105] globals_0.19.1       parallel_4.5.2       gower_1.0.2          dotCall64_1.2       
#> [109] lme4_2.0-1           listenv_0.10.1       mvtnorm_1.4-1        ipred_0.9-15        
#> [113] scales_1.4.0         prodlim_2026.03.11   e1071_1.7-17         rlang_1.2.0
```

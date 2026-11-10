---
title: Assessing Current-to-Future Biodiversity Change
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Map bioregion change} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-11-10
sidebar:
  label: Map bioregion change
  order: 9
source: https://github.com/b-cubed-eu/dissmapr/blob/master/vignettes/articles/8-change.Rmd
---







This vignette compares current and future spatial patterns in biodiversity composition. It illustrates how `dissmapr` outputs can be used to explore potential compositional change, including shifts in predicted community similarity and bioregional structure.

To keep the example reproducible and quick to run, we use a small set of example objects bundled with `dissmapr`. The setup chunk below loads the required packages, reads the bundled data snapshot, and loads the current and future raster layers needed for the change-analysis examples.


``` r
# Load the packages used in this vignette.
library(dissmapr)
library(viridis)
library(terra)

# Load the bundled example data snapshot.
inputs = readRDS(system.file("extdata", "dissmapr_vignettes.rds", package = "dissmapr"))

# Unpack the example objects used below.
rsa = inputs$rsa             # South Africa boundary
grid_spp = inputs$grid_spp   # Grid-level species data
sp_cols = inputs$sp_cols     # Species column names

# Recreate/load the raster layers used in the spatial comparisons.
grid_masked = terra::mask(
  terra::setValues(
    terra::rast(system.file("extdata", "grid_r.tif", package = "dissmapr"))[[1]],
    1
  ),
  terra::vect(rsa)
)

future_nn = terra::rast(system.file("extdata", "future_nn.tif", package = "dissmapr"))
current_nn = terra::rast(system.file("extdata", "current_nn.tif", package = "dissmapr"))
future_hclt = terra::rast(system.file("extdata", "future_hclt.tif", package = "dissmapr"))
```

### 1. Map sensitivity of bioregion delineation to clustering method using `map_bioregDiff()`

In the sections below we use `map_bioregDiff()` to assess how much our four clustering algorithms disagree (a sensitivity check). Here we treat the various cluster maps generated with `map_bioreg()` (k-means, PAM, hierarchical and GMM) as a sensitivity analysis. By feeding all four algorithm outputs into `map_bioregDiff()`, we quantify where and how much those methods disagree. This shows which areas are robust to algorithm choice and which are method‐dependent.

**Change-metric options in `map_bioregDiff()` include** (`approach` argument):   

- **difference_count**: counts how many times a cell’s label deviates from the first layer.   
- **shannon_entropy**: Shannon entropy of the label sequence, a measure of within-cell diversity.   
- **stability**: proportion of layers in which the label is unchanged (1 = always stable, 0 = always different).   
- **transition_frequency**: total number of label flips between consecutive layers, showing how often change occurs.   
- **weighted_change_index**: cumulative change weighted by a dissimilarity matrix so rare or large transitions score higher.   
- **all** (default): returns a five-layer `SpatRaster` containing every metric.   



``` r
# Get current nearest-neighbour rasters
# current_nn = c(
#   bioreg_current$nn$current$kmeans_algn_current,
#   bioreg_current$nn$current$pam_algn_current,
#   bioreg_current$nn$current$hclust_algn_current,
#   bioreg_current$nn$current$gmm_algn_current
# )

names(current_nn)
#> [1] "kmeans_algn_current" "pam_algn_current"    "hclust_algn_current" "gmm_algn_current"

# map_bioregDiff() operates on the underlying integer cluster IDs.
# Remove categorical metadata without altering cell values or layer names.
current_nn_ids = current_nn
levels(current_nn_ids) = NULL

# Confirm that all input layers are now numeric, non-factor rasters
stopifnot(
  terra::nlyr(current_nn_ids) == terra::nlyr(current_nn),
  identical(names(current_nn_ids), names(current_nn)),
  !any(terra::is.factor(current_nn_ids))
)

# Run map_bioregDiff
# 'approach' specifies which metric(s) to compute
sens_bioregDiff = dissmapr::map_bioregDiff(
  current_nn_ids,
  approach = "all"
)

# Inspect the output layers
sens_bioregDiff
#> class       : SpatRaster
#> size        : 25, 32, 5  (nrow, ncol, nlyr)
#> resolution  : 0.5, 0.4999984  (x, y)
#> extent      : 16.75, 32.75, -34.75, -22.25004  (xmin, xmax, ymin, ymax)
#> coord. ref. : lon/lat WGS 84 (EPSG:4326)
#> source(s)   : memory
#> varnames    : 
#>               
#>               
#>               current_nn
#>               
#> names       : Differ~_Count, Shanno~ntropy, Stability, Transi~quency, Weight~_Index
#> min values  :             0,            -0,         0,             0,      0.016949
#> max values  :             3,      1.039721,         1,             3,      2.990113

# Resample and mask to the study area
mask_sens_bioregDiff = terra::mask(
  terra::resample(
    sens_bioregDiff,
    grid_masked,
    method = "near"
  ),
  grid_masked
)

# Plot titles should correspond to the output layer order
titles = c(
  "Difference count",
  "Shannon entropy",
  "Stability",
  "Transition frequency",
  "Weighted change index"
)

stopifnot(terra::nlyr(mask_sens_bioregDiff) == length(titles))

# Convert the boundary once, outside the plotting loop
rsa_vect = terra::vect(rsa)

# Quick visual QC in a 2-row x 3-column layout
old_par = par(
  mfrow = c(2, 3),
  mar = c(1, 1, 2, 5)
)

for (i in seq_len(terra::nlyr(mask_sens_bioregDiff))) {
  terra::plot(
    mask_sens_bioregDiff[[i]],
    col = viridisLite::viridis(100, direction = -1),
    colNA = NA,
    axes = FALSE,
    main = titles[i],
    cex.main = 0.8
  )

  terra::lines(
    rsa_vect,
    col = "black",
    lwd = 0.4
  )
}

par(old_par)
```

<img src="/software/dissmapr/figures/8-bioreg-Diff-1.png" alt="Bioregion sensitivity to method" width="100%" />

### 2. Map bioregion sensitivity to future change using `map_bioregDiff()`

Here we use `map_bioregDiff()` to track how the hierarchical‐cluster map itself changes under three future climate scenarios. Focusing solely on the hierarchical solution we map bioregion change across time. First we stack the hierarchical clusters for today, 2030, 2040 and 2050, run `map_bioregDiff()` on that series, and highlight how bioregions shift under these future climate projections. In this way we isolate climate-driven reorganization in the hierarchical map itself.


``` r
# 1. Build a multilayer SpatRaster of hierarchical clusters
# future_hclt = c(
#   bioreg_future$nn$current$hclust_current,
#   bioreg_future$nn$`2030`$hclust_2030,
#   bioreg_future$nn$`2040`$hclust_2040,
#   bioreg_future$nn$`2050`$hclust_2050
# )

names(future_hclt)
#> [1] "hclust_current" "hclust_2030"    "hclust_2040"    "hclust_2050"

# map_bioregDiff() requires the underlying numeric cluster IDs.
# Arithmetic removes the categorical metadata while preserving cell values.
future_hclt_ids = future_hclt + 0
names(future_hclt_ids) = names(future_hclt)

# Validate the converted raster
stopifnot(
  terra::nlyr(future_hclt_ids) == 4L,
  identical(names(future_hclt_ids), names(future_hclt)),
  !any(terra::is.factor(future_hclt_ids))
)

# 2. Compute change metrics across the four scenarios
future_bioregDiff = dissmapr::map_bioregDiff(
  future_hclt_ids,
  approach = "all"
)

# Inspect the output
future_bioregDiff
#> class       : SpatRaster
#> size        : 25, 32, 5  (nrow, ncol, nlyr)
#> resolution  : 0.5, 0.4999984  (x, y)
#> extent      : 16.75, 32.75, -34.75, -22.25004  (xmin, xmax, ymin, ymax)
#> coord. ref. : lon/lat WGS 84 (EPSG:4326)
#> source(s)   : memory
#> varnames    : 
#>               
#>               
#>               future_hclt
#>               
#> names       : Differ~_Count, Shanno~ntropy, Stability, Transi~quency, Weight~_Index
#> min values  :             0,            -0,         0,             0,             0
#> max values  :             3,      0.693147,         1,             3,      2.965714

# 3. Resample and mask to the RSA study area
mask_future_bioregDiff = terra::mask(
  terra::resample(
    future_bioregDiff,
    grid_masked,
    method = "near"
  ),
  grid_masked
)

# 4. Plot the five change metrics
titles = c(
  "Difference count",
  "Shannon entropy",
  "Stability",
  "Transition frequency",
  "Weighted change index"
)

stopifnot(
  terra::nlyr(mask_future_bioregDiff) == length(titles)
)

# Convert the boundary once rather than during every iteration
rsa_vect = terra::vect(rsa)

old_par = par(
  mfrow = c(2, 3),
  mar = c(1, 1, 2, 5)
)

for (i in seq_len(terra::nlyr(mask_future_bioregDiff))) {
  terra::plot(
    mask_future_bioregDiff[[i]],
    col = viridisLite::viridis(100, direction = -1),
    colNA = NA,
    axes = FALSE,
    main = titles[i],
    cex.main = 0.8
  )

  terra::lines(
    rsa_vect,
    col = "black",
    lwd = 0.4
  )
}

# Restore the previous graphics settings
par(old_par)
```

<img src="/software/dissmapr/figures/8-bioreg-diff-futures-1.png" alt="Bioregion sensitivity to change" width="100%" />


``` r
sessionInfo()
#> R version 4.5.3 (2026-03-11)
#> Platform: aarch64-apple-darwin20
#> Running under: macOS Tahoe 26.6.2
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
#>  [1] RColorBrewer_1.1-3  mclust_6.1.3        patchwork_1.3.2     viridis_0.6.5      
#>  [5] viridisLite_0.4.3   ggplot2_4.0.3       zetadiv_1.3.0       scam_1.2-23        
#>  [9] tidyterra_0.7.2     sf_1.1-3            zoo_1.9-1           tidyr_1.3.2        
#> [13] dplyr_1.2.1         data.table_1.18.6.1 geodata_0.6-9       terra_1.9-50       
#> [17] httr_1.4.9          dissmapr_0.2.0      here_1.0.2          purrr_1.2.2        
#> [21] yaml_2.3.12        
#> 
#> loaded via a namespace (and not attached):
#>   [1] wk_0.9.5             rstudioapi_0.17.1    magrittr_2.0.5       TH.data_1.1-3       
#>   [5] estimability_2.0.0   corrplot_0.95        farver_2.1.2         rmarkdown_2.32      
#>   [9] fields_18.0          fs_2.1.0             vctrs_0.7.3          memoise_2.0.1       
#>  [13] htmltools_0.5.9      curl_8.1.0           s2_1.1.13            pROC_1.19.1         
#>  [17] caret_7.0-1          parallelly_1.50.0    glm2_1.2.1           KernSmooth_2.23-26  
#>  [21] desc_1.4.3           plyr_1.8.9           sandwich_3.1-1       emmeans_2.0.4       
#>  [25] lubridate_1.9.5      cachem_1.1.0         lifecycle_1.0.5      iterators_1.0.14    
#>  [29] pkgconfig_2.0.3      Matrix_1.7-5         R6_2.6.1             fastmap_1.2.0       
#>  [33] future_1.82.0        digest_0.6.39        rematch2_2.1.2       rprojroot_2.1.1     
#>  [37] RSQLite_3.53.3       vegan_2.7-6          labeling_0.4.3       b3doc_0.3.0.9000    
#>  [41] nnls_1.6             timechange_0.4.0     mgcv_1.9-4           compiler_4.5.3      
#>  [45] proxy_0.4-29         remotes_2.5.0.9000   withr_3.0.3          bit64_4.8.6         
#>  [49] S7_0.2.2             crancache_0.0.0.9001 DBI_1.3.0            cranlike_1.0.3      
#>  [53] pkgbuild_1.4.8       maps_3.4.4           R.utils_2.13.0       MASS_7.3-66         
#>  [57] lava_1.10            rappdirs_0.3.4       classInt_0.4-11      permute_0.10-0      
#>  [61] ModelMetrics_1.2.2.2 tools_4.5.3          units_1.0-1          otel_0.3.0          
#>  [65] future.apply_1.21.0  nnet_7.3-20          R.oo_1.27.1          glue_1.8.1          
#>  [69] debugme_1.2.0        callr_3.8.0          nlme_3.1-169         grid_4.5.3          
#>  [73] rsconnect_1.5.0      cluster_2.1.8.2      reshape2_1.4.5       generics_0.1.4      
#>  [77] recipes_1.4.0        gtable_0.3.6         R.methodsS3_1.8.2    class_7.3-23        
#>  [81] utf8_1.2.6           ggrepel_0.9.8        foreach_1.5.2        pillar_1.11.1       
#>  [85] stringr_1.6.0        spam_2.11-4          clValid_0.7          splines_4.5.3       
#>  [89] lattice_0.22-9       survival_3.8-6       bit_4.6.0            tidyselect_1.2.1    
#>  [93] pbapply_1.7-5        knitr_1.52           gridExtra_2.3.1      stats4_4.5.3        
#>  [97] xfun_0.62            hardhat_1.4.3        factoextra_2.2.0     timeDate_4052.112   
#> [101] stringi_1.8.9        evaluate_1.0.5       codetools_0.2-20     NbClust_3.0.1       
#> [105] entropy_1.3.2        tibble_3.3.1         cli_3.6.6            rpart_4.1.24        
#> [109] xtable_1.8-8         processx_3.9.0       dichromat_2.0-0.1    Rcpp_1.1.2          
#> [113] globals_0.20.0       coda_0.19-4.1        parallel_4.5.3       gower_1.0.2         
#> [117] blob_1.3.0           parsedate_1.3.2      dotCall64_1.2        listenv_1.1.0       
#> [121] mvtnorm_1.4-2        ipred_0.9-16         scales_1.4.0         prodlim_2026.03.11  
#> [125] e1071_1.7-17         crayon_1.5.3         geosphere_1.6-8      rlang_1.3.0         
#> [129] multcomp_1.4-30
```

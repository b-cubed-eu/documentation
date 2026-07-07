---
title: Assessing Current-to-Future Biodiversity Change
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Map bioregion change} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-07-07
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
# Get current nn rasters
# current_nn = c(bioreg_current$nn$current$kmeans_algn_current,
#              bioreg_current$nn$current$pam_algn_current,
#              bioreg_current$nn$current$hclust_algn_current,
#              bioreg_current$nn$current$gmm_algn_current)
names(current_nn)
#> [1] "kmeans_algn_current" "pam_algn_current"    "hclust_algn_current" "gmm_algn_current"

# Run `map_bioregDiff`
# 'approach', specifies which metric to compute:
sens_bioregDiff = dissmapr::map_bioregDiff(
  current_nn,
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

# Crop to our study area and prepare for plotting
mask_sens_bioregDiff = terra::mask(
  terra::resample(sens_bioregDiff, grid_masked, method = "near"),
  grid_masked
)

# Quick visual QC in a 2-row x 3-column layout
old_par = par(mfrow = c(2, 3), mar = c(1, 1, 1, 5))
titles = c("Difference count", "Shannon entropy", "Stability",
           "Transition frequency", "Weighted change index")

for (i in seq_along(titles)) {
  plot(mask_sens_bioregDiff[[i]],
       col      = viridis(100, direction = -1),
       colNA    = NA,
       axes     = FALSE,
       main     = titles[i],
       cex.main = 0.8)
  plot(terra::vect(rsa), add = TRUE, border = "black", lwd = 0.4)
}
#> Error in `plot.xy()`:
#> ! invalid type passed to graphics function
par(old_par)
```

<img src="/software/dissmapr/figures/8-bioreg-Diff-1.png" alt="Bioregion sensitivity to method" width="100%" />

### 2. Map bioregion sensitivity to future change using `map_bioregDiff()`

Here we use `map_bioregDiff()` to track how the hierarchical‐cluster map itself changes under three future climate scenarios. Focusing solely on the hierarchical solution we map bioregion change across time. First we stack the hierarchical clusters for today, 2030, 2040 and 2050, run `map_bioregDiff()` on that series, and highlight how bioregions shift under these future climate projections. In this way we isolate climate-driven reorganization in the hierarchical map itself.


``` r
# 1. Build a multi‐layer SpatRaster of hierarchical clusters for each scenario
# Create SpatRast
# future_hclt = c(bioreg_future$nn$current$hclust_current,
#              bioreg_future$nn$`2030`$hclust_2030,
#              bioreg_future$nn$`2040`$hclust_2040,
#              bioreg_future$nn$`2050`$hclust_2050)
names(future_hclt)
#> [1] "hclust_current" "hclust_2030"    "hclust_2040"    "hclust_2050"

# 2. Compute change metrics across those four layers
future_bioregDiff = dissmapr::map_bioregDiff(future_hclt, approach = "all")

# 3. Mask to your RSA boundary (assuming 'grid_masked' is your template)
mask_future_bioregDiff = terra::mask(
  terra::resample(future_bioregDiff, grid_masked, method = "near"),
  grid_masked
)

# 4. Plot all five metrics in a 2-row x 3-column panel
old_par = par(mfrow = c(2, 3), mar = c(1, 1, 1, 5))
titles = c(
  "Difference count",
  "Shannon entropy",
  "Stability",
  "Transition frequency",
  "Weighted change index"
)
for (i in seq_along(titles)) {
  plot(
    mask_future_bioregDiff[[i]],
    # col      = viridisLite::turbo(100),
    col      = viridis(100, direction = -1),
    colNA    = NA,
    axes     = FALSE,
    main     = titles[i],
    cex.main = 0.8
  )
  plot(terra::vect(rsa), add = TRUE, border = "black", lwd = 0.4)
}
#> Error in `plot.xy()`:
#> ! invalid type passed to graphics function
par(old_par)
```

<img src="/software/dissmapr/figures/8-bioreg-diff-futures-1.png" alt="Bioregion sensitivity to change" width="100%" />


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
#>  [1] RColorBrewer_1.1-3 mclust_6.1.2       patchwork_1.3.2    viridis_0.6.5     
#>  [5] viridisLite_0.4.3  ggplot2_4.0.3      zetadiv_1.3.0      scam_1.2-22       
#>  [9] tidyterra_1.2.0    sf_1.1-1           zoo_1.8-15         tidyr_1.3.2       
#> [13] dplyr_1.2.1        data.table_1.18.4  geodata_0.6-9      terra_1.9-34      
#> [17] httr_1.4.8         dissmapr_0.2.0     here_1.0.2         purrr_1.2.2       
#> [21] yaml_2.3.12       
#> 
#> loaded via a namespace (and not attached):
#>   [1] DBI_1.3.0            pbapply_1.7-4        pROC_1.19.0.1        gridExtra_2.3       
#>   [5] s2_1.1.11            glm2_1.2.1           permute_0.9-10       rlang_1.2.0         
#>   [9] magrittr_2.0.5       otel_0.2.0           e1071_1.7-17         compiler_4.5.2      
#>  [13] mgcv_1.9-4           b3doc_0.3.0.9000     maps_3.4.3           vctrs_0.7.3         
#>  [17] reshape2_1.4.5       stringr_1.6.0        wk_0.9.5             pkgconfig_2.0.3     
#>  [21] fastmap_1.2.0        labeling_0.4.3       utf8_1.2.6           rmarkdown_2.31      
#>  [25] prodlim_2026.03.11   xfun_0.59            recipes_1.3.3        cluster_2.1.8.2     
#>  [29] parallel_4.5.2       R6_2.6.1             stringi_1.8.7        parallelly_1.47.0   
#>  [33] rpart_4.1.24         lubridate_1.9.5      estimability_1.5.1   Rcpp_1.1.1-1.1      
#>  [37] iterators_1.0.14     knitr_1.51           fields_17.3          future.apply_1.20.2 
#>  [41] R.utils_2.13.0       nnls_1.6             Matrix_1.7-4         splines_4.5.2       
#>  [45] nnet_7.3-20          timechange_0.4.0     tidyselect_1.2.1     rstudioapi_0.18.0   
#>  [49] vegan_2.7-5          timeDate_4052.112    codetools_0.2-20     listenv_0.10.1      
#>  [53] lattice_0.22-9       tibble_3.3.1         plyr_1.8.9           withr_3.0.3         
#>  [57] S7_0.2.2             geosphere_1.6-8      evaluate_1.0.5       future_1.70.0       
#>  [61] survival_3.8-6       units_1.0-1          proxy_0.4-29         pillar_1.11.1       
#>  [65] corrplot_0.95        KernSmooth_2.23-26   foreach_1.5.2        stats4_4.5.2        
#>  [69] generics_0.1.4       rprojroot_2.1.1      scales_1.4.0         globals_0.19.1      
#>  [73] xtable_1.8-8         class_7.3-23         glue_1.8.1           clValid_0.7         
#>  [77] emmeans_2.0.3        tools_4.5.2          ModelMetrics_1.2.2.2 gower_1.0.2         
#>  [81] dotCall64_1.2        fs_2.1.0             mvtnorm_1.4-1        grid_4.5.2          
#>  [85] ipred_0.9-15         nlme_3.1-168         cli_3.6.6            rappdirs_0.3.4      
#>  [89] NbClust_3.0.1        spam_2.11-4          lava_1.9.1           gtable_0.3.6        
#>  [93] R.methodsS3_1.8.2    digest_0.6.39        classInt_0.4-11      caret_7.0-1         
#>  [97] ggrepel_0.9.8        farver_2.1.2         factoextra_2.0.0     entropy_1.3.2       
#> [101] htmltools_0.5.9      R.oo_1.27.1          lifecycle_1.0.5      hardhat_1.4.3       
#> [105] MASS_7.3-65
```

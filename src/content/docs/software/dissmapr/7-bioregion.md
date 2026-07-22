---
title: Delineating Bioregions from Predicted Community Composition
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Map bioregions} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-07-22
sidebar:
  label: Map bioregions
  order: 8
source: https://github.com/b-cubed-eu/dissmapr/blob/master/vignettes/articles/7-bioregion.Rmd
---







This vignette shows how predicted compositional patterns can be translated into biodiversity regions. By grouping areas with similar predicted communities, the workflow supports spatial interpretation of turnover patterns and highlights broad biogeographic structure.

To keep the example reproducible and quick to run, we use a small set of example objects bundled with `dissmapr`. The setup chunk below loads the required packages, reads the bundled data snapshot, and unpacks the rasters, boundary data, and species information needed for the bioregionalisation examples.


``` r
# Load the packages used in this vignette.
library(dissmapr)
library(terra)
library(RColorBrewer)

# Load the bundled example data snapshot.
inputs = readRDS(system.file("extdata", "dissmapr_vignettes.rds", package = "dissmapr"))

# Unpack the example objects used below.
predictors_df = inputs$predictors_df       # Environmental predictor values
all_preds = inputs$all_preds               # Model prediction outputs
rsa = inputs$rsa                           # South Africa boundary
grid_spp = inputs$grid_spp                 # Grid-level species data
sp_cols = inputs$sp_cols                   # Species column names

# Recreate the masked raster grid and load the future nearest-neighbour raster.
grid_masked = terra::mask(
  terra::setValues(
    terra::rast(system.file("extdata", "grid_r.tif", package = "dissmapr"))[[1]],
    1
  ),
  terra::vect(rsa)
)

future_nn = terra::rast(
  system.file("extdata", "future_nn.tif", package = "dissmapr")
)
```


### 1. Run clustering analyses using `map_bioreg()` to map bioregions

In this step we translate our site‐level ζ₂ predictions into spatial bioregions. Calling `map_bioreg()` on the predictors_df does the following:

1. z-scales the predicted turnover, longitude and latitude;
2. fits four clustering algorithms (k-means, PAM, hierarchical and GMM);
  - **k-means** partitions points around centroids and is fast for large data sets.
  - **PAM** (Partitioning Around Medoids) is a medoid-based analogue of k-means that is more robust to outliers.
  - **Hierarchical** agglomerative clustering builds a dendrogram and then “cuts” it at the chosen k, capturing nested structure in the data.
  - **GMM** (Gaussian Mixture Model) treats clusters as multivariate normal distributions and assigns each point by maximum likelihood.
3. realigns each method’s labels to the k-means solution for consistency;
4. builds both nearest-neighbour and thin-plate-spline interpolated surfaces;
5. returns the raw cluster assignments and gridded rasters, and—because `show_plot=TRUE`—draws a 2×2 panel of maps.

The result is a set of complementary bioregion maps and rasters you can use to compare how different algorithms partition the landscape based on compositional turnover and geography.


``` r
# Add this to {, fig.width=11.25, fig.height=9, warning=FALSE, message=FALSE}
# Run `map_bioreg` function to generate and plot clusters
bioreg_current = dissmapr::map_bioreg(
  data = predictors_df,
  scale_cols = c("pred_zetaExp", "centroid_lon", "centroid_lat"),
  method = 'all', # Options: c("kmeans","pam","hclust","gmm","all"),
  k_override  = 8,
  interpolate = 'nn', # Options: c("none","nn","tps","all"),
  x_col ='centroid_lon',
  y_col ='centroid_lat',
  res = 0.5, 
  crs = "EPSG:4326",
  plot = TRUE,
  bndy_fc = rsa)
#> fitting ...
#> 
  |                                                                                                                                                   
  |                                                                                                                                             |   0%
  |                                                                                                                                                   
  |=========                                                                                                                                    |   7%
  |                                                                                                                                                   
  |===================                                                                                                                          |  13%
  |                                                                                                                                                   
  |============================                                                                                                                 |  20%
  |                                                                                                                                                   
  |======================================                                                                                                       |  27%
  |                                                                                                                                                   
  |===============================================                                                                                              |  33%
  |                                                                                                                                                   
  |========================================================                                                                                     |  40%
  |                                                                                                                                                   
  |==================================================================                                                                           |  47%
  |                                                                                                                                                   
  |===========================================================================                                                                  |  53%
  |                                                                                                                                                   
  |=====================================================================================                                                        |  60%
  |                                                                                                                                                   
  |==============================================================================================                                               |  67%
  |                                                                                                                                                   
  |=======================================================================================================                                      |  73%
  |                                                                                                                                                   
  |=================================================================================================================                            |  80%
  |                                                                                                                                                   
  |==========================================================================================================================                   |  87%
  |                                                                                                                                                   
  |====================================================================================================================================         |  93%
  |                                                                                                                                                   
  |=============================================================================================================================================| 100%
```

<img src="/software/dissmapr/figures/7-zeta-cluster-1.png" alt="Bioregion clusters" width="100%" />

``` r

# Check results
str(bioreg_current, max.level=1)
#> List of 6
#>  $ none   :List of 1
#>  $ nn     :List of 1
#>  $ tps    : NULL
#>  $ table  :'data.frame':	415 obs. of  24 variables:
#>  $ plots  :List of 1
#>  $ methods: chr [1:4] "kmeans" "pam" "hclust" "gmm"
```

### 2. Map future bioregions using `map_bioreg()`

Below we expand our workflow to map the forecasted ζ₂  bioregions under three extreme climate futures (2030, 2040, 2050) alongside the current scenario.
To see how the bioregional partitions shift, we split `all_preds` by scenario and apply `map_bioreg()` (k-means + hierarchical, both NN and TPS interpolation). We then extract the hierarchical cluster layers, mask them to our study area, and plot all four maps in a 2×2 layout:


``` r
# Split your combined predictions by scenario into a named list
by_scn = split(all_preds, all_preds$scenario)

# For each scenario, call map_bioreg() with all algorithms
bioreg_future = dissmapr::map_bioreg(
  data = by_scn,
  scale_cols = c("pred_zetaExp", "centroid_lon", "centroid_lat"),
  method = 'all', # Options: c("kmeans","pam","hclust","gmm","all"),
  k_override  = 8,
  interpolate = 'nn', # Options: c("none","nn","tps","all"),
  x_col ='centroid_lon',
  y_col ='centroid_lat',
  res = 0.5, 
  crs = "EPSG:4326",
  plot = FALSE,
  bndy_fc = rsa)
#> fitting ...
#> 
  |                                                                                                                                                   
  |                                                                                                                                             |   0%
  |                                                                                                                                                   
  |=========                                                                                                                                    |   7%
  |                                                                                                                                                   
  |===================                                                                                                                          |  13%
  |                                                                                                                                                   
  |============================                                                                                                                 |  20%
  |                                                                                                                                                   
  |======================================                                                                                                       |  27%
  |                                                                                                                                                   
  |===============================================                                                                                              |  33%
  |                                                                                                                                                   
  |========================================================                                                                                     |  40%
  |                                                                                                                                                   
  |==================================================================                                                                           |  47%
  |                                                                                                                                                   
  |===========================================================================                                                                  |  53%
  |                                                                                                                                                   
  |=====================================================================================                                                        |  60%
  |                                                                                                                                                   
  |==============================================================================================                                               |  67%
  |                                                                                                                                                   
  |=======================================================================================================                                      |  73%
  |                                                                                                                                                   
  |=================================================================================================================                            |  80%
  |                                                                                                                                                   
  |==========================================================================================================================                   |  87%
  |                                                                                                                                                   
  |====================================================================================================================================         |  93%
  |                                                                                                                                                   
  |=============================================================================================================================================| 100%

# Check results
str(bioreg_future, max.level=1)
#> List of 6
#>  $ none   :List of 4
#>  $ nn     :List of 4
#>  $ tps    : NULL
#>  $ table  :'data.frame':	1660 obs. of  24 variables:
#>  $ plots  : NULL
#>  $ methods: chr [1:4] "kmeans" "pam" "hclust" "gmm"

# Plot the consensus bioregion clusters per scenario with a single, compact
# shared legend. Bioregions are categorical, so we keep a discrete key (Set3)
# rather than a continuous colour bar.
library(ggplot2)

clust_tbl = bioreg_future$table

# Order scenarios with "current" first, if present
scn_lev = unique(clust_tbl$scenario)
scn_lev = c(intersect("current", scn_lev), setdiff(scn_lev, "current"))
clust_tbl$scenario = factor(clust_tbl$scenario, levels = scn_lev)

ggplot() +
  geom_tile(data = clust_tbl,
            aes(x = centroid_lon, y = centroid_lat,
                fill = factor(cluster_mode))) +
  geom_sf(data = rsa, fill = NA, colour = "black", linewidth = 0.3) +
  facet_wrap(~ scenario) +
  scale_fill_brewer(palette = "Set3", name = "Bioregion", drop = FALSE) +
  theme_minimal(base_size = 9) +
  theme(legend.position = "bottom") +
  guides(fill = guide_legend(nrow = 1)) +
  labs(x = "Longitude", y = "Latitude")
```

<img src="/software/dissmapr/figures/7-future-cluster-1.png" alt="Future bioregion clusters" width="100%" />

Below we visualise the nearest-neighbour interpolated future‐scenario cluster outputs. First, we list the structure of the `bioreg_future` result to confirm available components. We then combine the k-means nearest-neighbour rasters for “current” and each future year into a single `SpatRaster` stack (`future_nn`), and resample, then mask it to the RSA boundary (`mask_future_nn`). Finally, we lay out a 2×2 plot grid, compute a discrete colour palette for each layer based on its unique classes, and render each masked layer with its boundary overlay for a quick inspection of bioregion changes across time.


``` r
# Check results
str(bioreg_future, max.level=1)
#> List of 6
#>  $ none   :List of 4
#>  $ nn     :List of 4
#>  $ tps    : NULL
#>  $ table  :'data.frame':	1660 obs. of  24 variables:
#>  $ plots  : NULL
#>  $ methods: chr [1:4] "kmeans" "pam" "hclust" "gmm"

# Create SpatRast
# future_nn = c(bioreg_future$nn$current$kmeans_current,
#              bioreg_future$nn$`2030`$kmeans_2030,
#              bioreg_future$nn$`2040`$kmeans_2040,
#              bioreg_future$nn$`2050`$kmeans_2050)
names(future_nn)
#> [1] "kmeans_current" "kmeans_2030"    "kmeans_2040"    "kmeans_2050"

# 4) Mask `result_bioregDiff` to the RSA boundary
mask_future_nn = terra::mask(
  terra::resample(
    future_nn,
    grid_masked,
    method = "modal"
  ),
  grid_masked
)

# Remove any artefactual values introduced during raster processing
mask_future_nn = terra::ifel(
  mask_future_nn >= 1 & mask_future_nn <= 8,
  mask_future_nn,
  NA
)

# Give every layer the same complete category table
bioregion_levels = data.frame(
  value = 1:8,
  bioregion = paste("Bioregion", 1:8)
)

levels(mask_future_nn) =
  rep(list(bioregion_levels), terra::nlyr(mask_future_nn))

# 5) Quick visual QC in a 2×2 layout
pal = RColorBrewer::brewer.pal(8, "Set3")

old_par = par(
  mfrow = c(2, 2),
  mar = c(1, 1, 2, 5)
)

titles = c("Current", "2030", "2040", "2050")

# Now Plot
for (i in seq_len(nlyr(mask_future_nn))) {

  plot(
    mask_future_nn[[i]],
    col = pal,
    type = "classes",
    all_levels = TRUE,
    colNA = NA,
    axes = FALSE,
    legend = TRUE,
    main = titles[i],
    cex.main = 0.8
  )

  terra::lines(
    terra::vect(rsa),
    col = "black",
    lwd = 0.4
  )
}
#> Error in `plot.xy()`:
#> ! invalid type passed to graphics function

par(old_par)
```

<img src="/software/dissmapr/figures/7-future-plots-1.png" alt="Smoothed future bioregion clusters" width="100%" />

This end-to-end workflow shows how predicted turnover patterns and resulting bioregions might shift as climate warms and rainfall changes, highlighting potential future reorganization of biodiversity hotspots.


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
#>  [1] dissmapr_0.2.0          frictionless_1.2.1.9000 mclust_6.1.3            patchwork_1.3.2         zetadiv_1.3.0           scam_1.2-22            
#>  [7] tidyterra_1.2.0         sf_1.1-1                zoo_1.8-15              tidyr_1.3.2             data.table_1.18.4       geodata_0.6-9          
#> [13] httr_1.4.8              viridis_0.6.5           viridisLite_0.4.3       RColorBrewer_1.1-3      terra_1.9-34            dplyr_1.2.1            
#> [19] ggplot2_4.0.3           here_1.0.2              purrr_1.2.2             yaml_2.3.12            
#> 
#> loaded via a namespace (and not attached):
#>   [1] jsonlite_2.0.0       rstudioapi_0.18.0    wk_0.9.5             magrittr_2.0.5       estimability_2.0.0   farver_2.1.2        
#>   [7] corrplot_0.95        rmarkdown_2.31       fs_2.1.0             fields_17.3          vctrs_0.7.3          htmltools_0.5.9     
#>  [13] curl_7.1.0           s2_1.1.11            pROC_1.19.0.1        caret_7.0-1          parallelly_1.48.0    glm2_1.2.1          
#>  [19] KernSmooth_2.23-26   desc_1.4.3           plyr_1.8.9           emmeans_2.0.4        lubridate_1.9.5      lifecycle_1.0.5     
#>  [25] iterators_1.0.14     pkgconfig_2.0.3      Matrix_1.7-4         R6_2.6.1             fastmap_1.2.0        future_1.75.0       
#>  [31] digest_0.6.39        rprojroot_2.1.1      vegan_2.7-5          labeling_0.4.3       b3doc_0.3.0.9000     nnls_1.6            
#>  [37] timechange_0.4.0     mgcv_1.9-4           compiler_4.5.2       remotes_2.5.0        proxy_0.4-29         withr_3.0.3         
#>  [43] S7_0.2.2             DBI_1.3.0            pkgbuild_1.4.8       highr_0.12           R.utils_2.13.0       maps_3.4.3          
#>  [49] MASS_7.3-65          lava_1.9.2           rappdirs_0.3.4       classInt_0.4-11      permute_0.9-10       ModelMetrics_1.2.2.2
#>  [55] tools_4.5.2          units_1.0-1          otel_0.2.0           future.apply_1.20.2  nnet_7.3-20          R.oo_1.27.1         
#>  [61] glue_1.8.1           callr_3.8.0          nlme_3.1-168         grid_4.5.2           cluster_2.1.8.2      reshape2_1.4.5      
#>  [67] generics_0.1.4       recipes_1.3.3        gtable_0.3.6         tzdb_0.5.0           R.methodsS3_1.8.2    class_7.3-23        
#>  [73] hms_1.1.4            utf8_1.2.6           ggrepel_0.9.8        foreach_1.5.2        pillar_1.11.1        stringr_1.6.0       
#>  [79] spam_2.11-4          clValid_0.7          splines_4.5.2        lattice_0.22-9       survival_3.8-6       tidyselect_1.2.1    
#>  [85] pbapply_1.7-4        knitr_1.51           gridExtra_2.3.1      stats4_4.5.2         xfun_0.60            hardhat_1.4.3       
#>  [91] factoextra_2.1.0     timeDate_4052.112    stringi_1.8.7        evaluate_1.0.5       codetools_0.2-20     NbClust_3.0.1       
#>  [97] entropy_1.3.2        tibble_3.3.1         cli_3.6.6            rpart_4.1.24         xtable_1.8-8         processx_3.9.0      
#> [103] Rcpp_1.1.2           globals_0.19.1       parallel_4.5.2       gower_1.0.2          readr_2.2.0          dotCall64_1.2       
#> [109] listenv_1.0.0        mvtnorm_1.4-2        ipred_0.9-15         scales_1.4.0         prodlim_2026.03.11   e1071_1.7-17        
#> [115] geosphere_1.6-8      rlang_1.3.0
```

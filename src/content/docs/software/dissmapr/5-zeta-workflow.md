---
title: Modelling Zeta Diversity Across Environmental Gradients
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Zeta-MSGDM with dissmapr} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-07-22
sidebar:
  label: Zeta-MSGDM
  order: 6
source: https://github.com/b-cubed-eu/dissmapr/blob/master/vignettes/articles/5-zeta-workflow.Rmd
---







This vignette demonstrates a more complete zeta-diversity workflow, moving from prepared species and environmental data to model fitting and interpretation. It is intended to show how the main zeta-based components of `dissmapr` can be combined in practice.

To keep the example reproducible and quick to run, we use a small set of example objects bundled with `dissmapr`. The setup chunk below loads the required packages, reads the bundled data snapshot, and unpacks the objects needed for the automated zeta-modelling workflow.


``` r
# Load the packages used in this vignette.
library(dissmapr)
library(patchwork)

# Load the bundled example data snapshot.
inputs = readRDS(system.file("extdata", "dissmapr_vignettes.rds", package = "dissmapr"))

# Unpack the example objects used below.
grid_spp_pa = inputs$grid_spp_pa           # Presence-absence species data
env_vars_reduced = inputs$env_vars_reduced # Selected environmental variables
grid_env = inputs$grid_env                 # Grid-level environmental data
sp_cols = inputs$sp_cols                   # Species column names
```

### 1. Automated Ispline Modeling & Visualization

To streamline the exploration of multi‐site turnover drivers, we now introduce an **automated sub-workflow** that fits, extracts and visualizes I-spline models for any set of zeta orders in just three function calls. Rather than manually looping over orders, binding tables, and crafting bespoke plots, you can:

1. **Run and combine** all ispline GLMs via `run_ispline_models()`, which:>
   * Calls `Zeta.msgdm()` for each order of interest (e.g. ζ₂…ζ₆)
   * Extracts both the raw covariates (including geographic distance) and their spline bases
   * Returns one tidy tibble tagged by `zOrder`, ready for plotting or further analysis
2. **Inspect partial-dependence curves** with `plot_ispline_lines()`, which:>
   * Automatically locates the spline column matching any chosen covariate (e.g. “dist” → `dist_is`)
   * Draws each zeta-order’s I-spline curve with thin lines
   * Overlays small markers at user-specified quantiles of the raw predictor and a larger symbol at each curve’s minimum
3. **Summarize overall variation** using `plot_ispline_boxplots()`, which:
   * Detects every `_is` spline column in your data
   * Pivots to long format and produces facetted boxplots for each term
   * Applies a color-blind–safe Viridis palette with independent scales per facet

By packaging these steps into self-documented functions, we embed ispline modeling and visualization into our RMarkdown workflow with a single, transparent call. The parameters (orders, covariate name, colors, shapes, etc.) are fully customizable, while sensible defaults minimize boilerplate, ensuring reproducibility, readability and ease of maintenance in automated biodiversity turnover analyses.

### 2. Fit and combine ispline models

The following chunk uses our `run_ispline_models()` helper to fit `Zeta.msgdm(reg.type = “ispline”)` for orders 2–6, extract both raw covariates (including distance) and their spline bases, and bind everything into one tidy table tagged by `zOrder`.


``` r
# Fit & gather ispline outputs for orders 2:6
set.seed(123) # set.seed to generate exactly the same random results i.e. sam=100
ispline_gdm_tab = dissmapr::run_ispline_models(
  spp_df    = grid_spp_pa[,-(1:6)],
  env_df    = env_vars_reduced,
  xy_df     = grid_env[, c("centroid_lon", "centroid_lat")],
  orders    = 2:6,
  sam       = 100, # Set really low to run fast
  normalize = "Jaccard",
  reg_type  = "ispline"
)
```


``` r
str(ispline_gdm_tab, max.level=1)
#> List of 2
#>  $ zeta_gdm_list:List of 5
#>  $ ispline_table:'data.frame':	500 obs. of  17 variables:

ispline_tabs_all = ispline_gdm_tab$ispline_table
head(ispline_tabs_all)
#>   temp_mean        iso  temp_wetQ temp_dryQ   rain_dry rain_warmQ obs_sum   distance temp_mean_is iso_is temp_wetQ_is temp_dryQ_is rain_dry_is
#> 1 0.0000000 0.00000000 0.00000000 0.0000000 0.00000000 0.00000000       0 0.03214127            0      0            0   0.02831627   0.1529665
#> 2 0.2896355 0.09884044 0.01960870 0.1041687 0.00000000 0.00877193       0 0.03214127            0      0            0   0.04242732   0.1529665
#> 3 0.3842598 0.15863757 0.03114836 0.1160104 0.00000000 0.01096491       0 0.04545457            0      0            0   0.04380618   0.1529665
#> 4 0.3874364 0.16800387 0.06060482 0.1609354 0.00000000 0.02412281       0 0.09642380            0      0            0   0.04861907   0.1529665
#> 5 0.3927655 0.17380612 0.09836887 0.1903078 0.00000000 0.02631579       0 0.09642380            0      0            0   0.05140793   0.1529665
#> 6 0.3973209 0.18186992 0.11965861 0.2000578 0.02272727 0.03070175       0 0.10163911            0      0            0   0.05227112   0.2890950
#>   rain_warmQ_is obs_sum_is distance_is zOrder
#> 1             0          0   0.2105816 Order2
#> 2             0          0   0.2105816 Order2
#> 3             0          0   0.2935477 Order2
#> 4             0          0   0.5881165 Order2
#> 5             0          0   0.5881165 Order2
#> 6             0          0   0.6161951 Order2
```

### 3. Plot Partial‐Dependence Curves for All Covariates

Here we produce a unified, multi‐panel display of each predictor’s I‐spline partial‐dependence curve using our `plot_ispline_lines()` helper. That function will:

* Auto‐detect the spline column for each covariate (e.g. “dist” → `dist_is`).
* Draw a thin line for each zeta‐order.
* Mark selected quantiles along the raw covariate with small symbols.
* Highlight each curve’s minimum value with a larger marker.

We then loop over all raw covariates (those ending in `_is`), generate a separate plot per variable, and assemble them into a cohesive multi‐panel layout using the `patchwork` package. This makes it possible to compare turnover responses across the full suite of environmental drivers.


``` r

# 1. Identify all raw covariates with a spline term
raw_vars = sub("_is$", "",
                grep("_is$", names(ispline_tabs_all), value = TRUE))

# 2. Generate one plot per covariate
plots = lapply(raw_vars, function(var) {
  dissmapr::plot_ispline_lines(
    ispline_data = ispline_tabs_all,
    x_var        = var,
    orders       = paste("Order", 2:6),
    cols         = c('green','cyan','purple','blue','black'),
    shapes       = c(15,16,17,18,19)
  ) +
  ggplot2::ggtitle(paste("I-Spline Partial Effect of", var))
})

# 3. Combine into a grid (2 columns here; adjust ncol as needed)
patchwork::wrap_plots(plots, ncol = 2) +
  patchwork::plot_annotation(
    title = "Multi-Panel I-Spline Curves Across Covariates",
    theme = ggplot2::theme(plot.title = ggplot2::element_text(size = 16, face = "bold"))
  )
```

<img src="/software/dissmapr/figures/5-plot-isp-lines-1.png" alt="Multi-Panel I-Spline Curves Across Covariates" width="100%" />

``` r

# # Simle single covariate line plot for "dist"
# plot_ispline_lines(
#   ispline_data = ispline_tabs_all,
#   x_var        = "dist",  
#   orders       = paste("Order", 2:6),
#   cols         = c('green','cyan','purple','blue','black'),
#   shapes       = c(15,16,17,18,19)
# )
```

**Ecological Interpretation and Conservation Implications**   
Which predictors drive turnover shifts with the number of sites:   
* **Two‐sites**: Distance dominates. Shared species drop off steeply as sites become farther apart.   
* **Three‐sites**: Isothermality (stable day–night vs. seasonal temperature swings) is most important, suggesting communities in areas with steady daily temperatures stay more similar.   
* **Four‐sites**: Mean temperature and wet‐quarter temperature have the strongest effects, indicating thermal limits filter species across moderate clusters of sites.   
* **Five‐sites**: Sampling effort peaks in influence, warning that uneven survey intensity can masquerade as real ecological turnover at this scale.   
* **Six‐sites**: Rainfall variables—especially warm‐quarter and dry‐season rainfall—become the key filters, showing that moisture availability during extreme seasons governs species overlap in larger site groups.

**Key point**: At the smallest scale, dispersal barriers (distance) set the stage for which species can overlap. As you expand to three, four or more sites, environmental filters—first thermal, then hydric—sequentially take over. This scale‐dependent shift reveals that different ecological processes dominate community assembly at different spatial extents, with direct implications for how we design surveys and target conservation under changing climates.

### 4. Facetted boxplots of all spline terms

Finally, we summarize the distribution of every _is basis across orders using `plot_ispline_boxplots()`. Each spline term is facetted with free scales, and fills are mapped to zOrder via a color-blind–friendly Viridis palette.


``` r
# Facetted boxplots of all *_is columns
dissmapr::plot_ispline_boxplots(
  ispline_data   = ispline_tabs_all,
  ispline_suffix = "_is",
  order_col      = "zOrder",
  palette        = "viridis",
  direction      = -1,
  ncol           = 3
)
```

<img src="/software/dissmapr/figures/5-plot-isp-box-1.png" alt="Distribution of iSplines by Order" width="100%" />

**Ecological Interpretation and Conservation Implications**
Which factors matter depends on how many sites you compare at once:   
- **Two sites:** Geographic distance dominates. Nearby sites share many species, distant sites very few.  
- **Three sites:** Isothermality (day–night versus seasonal swings) has its strongest effect, suggesting that stable daily temperatures support more consistent communities.  
- **Four sites:** Temperature (mean and seasonal highs) becomes the key driver, indicating that thermal limits filter which species can persist across moderate clusters.  
- **Five sites:** Dry-season rainfall peaks in importance, showing that moisture availability determines whether species can survive across larger groups.  
- **Four sites (again):** Sampling effort bias is highest, meaning uneven survey intensity can look like an ecological signal at this scale.

**Key points**:   
- At **small scales** (two sites), where species must actually move between locations, distance is the main barrier to sharing species.   
- At **medium scales** (three to five sites), local climate steps in: only species that can tolerate the same temperature and moisture levels hang on across multiple sites.   
- Breaking up habitat makes it even harder for species to move, while hotter, drier conditions shrink the range where they can survive—driving faster loss of biodiversity.   
- Protecting connected corridors and a variety of microclimates helps species disperse and find refuge, slowing turnover and preserving the common “backbone” species that keep ecosystems stable and healthy.  


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

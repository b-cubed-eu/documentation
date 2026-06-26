---
title: Zeta-MSGDM with dissmapr
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Zeta-MSGDM with dissmapr} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-06-26
sidebar:
  label: Zeta-MSGDM
  order: 6
source: https://github.com/b-cubed-eu/dissmapr/blob/master/vignettes/articles/5-zeta-workflow.Rmd
---




``` r
library(dissmapr)
library(patchwork)
# Load the single bundled snapshot of all vignette state.
inputs = readRDS(system.file("extdata", "dissmapr_vignettes.rds", package = "dissmapr"))

grid_spp_pa = inputs$grid_spp_pa
env_vars_reduced = inputs$env_vars_reduced
grid_env = inputs$grid_env
sp_cols = inputs$sp_cols
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
#> Error in `purrr::map()`:
#> ℹ In index: 2.
#> Caused by error in `array()`:
#> ! length of 'dimnames' [1] not equal to array extent
```


``` r
str(ispline_gdm_tab, max.level=1)
#> Error:
#> ! object 'ispline_gdm_tab' not found

ispline_tabs_all = ispline_gdm_tab$ispline_table
#> Error:
#> ! object 'ispline_gdm_tab' not found
head(ispline_tabs_all)
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'ispline_tabs_all' not found
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
#> Error:
#> ! object 'ispline_tabs_all' not found

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
#> Error:
#> ! object 'raw_vars' not found

# 3. Combine into a grid (2 columns here; adjust ncol as needed)
patchwork::wrap_plots(plots, ncol = 2) +
  patchwork::plot_annotation(
    title = "Multi-Panel I-Spline Curves Across Covariates",
    theme = ggplot2::theme(plot.title = ggplot2::element_text(size = 16, face = "bold"))
  )
#> Error:
#> ! object 'plots' not found

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
#> Error:
#> ! object 'ispline_tabs_all' not found
```

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
#>  [1] future.apply_1.20.2 future_1.70.0       cluster_2.1.8.2     pbapply_1.7-4       RColorBrewer_1.1-3  geosphere_1.6-8     corrplot_0.95       caret_7.0-1        
#>  [9] lattice_0.22-9      mclust_6.1.2        patchwork_1.3.2     viridis_0.6.5       viridisLite_0.4.3   ggplot2_4.0.3       zetadiv_1.3.0       scam_1.2-22        
#> [17] tidyterra_1.2.0     sf_1.1-1            zoo_1.8-15          tidyr_1.3.2         dplyr_1.2.1         data.table_1.18.4   geodata_0.6-9       terra_1.9-34       
#> [25] httr_1.4.8          dissmapr_0.2.0      here_1.0.2          purrr_1.2.2         yaml_2.3.12        
#> 
#> loaded via a namespace (and not attached):
#>   [1] rstudioapi_0.18.0    wk_0.9.5             magrittr_2.0.5       estimability_1.5.1   farver_2.1.2         rmarkdown_2.31       fs_2.1.0             fields_17.3         
#>   [9] vctrs_0.7.3          htmltools_0.5.9      curl_7.1.0           s2_1.1.11            pROC_1.19.0.1        parallelly_1.47.0    glm2_1.2.1           KernSmooth_2.23-26  
#>  [17] desc_1.4.3           plyr_1.8.9           emmeans_2.0.3        lubridate_1.9.5      lifecycle_1.0.5      iterators_1.0.14     pkgconfig_2.0.3      Matrix_1.7-4        
#>  [25] R6_2.6.1             fastmap_1.2.0        digest_0.6.39        rprojroot_2.1.1      vegan_2.7-5          labeling_0.4.3       b3doc_0.3.0.9000     nnls_1.6            
#>  [33] timechange_0.4.0     mgcv_1.9-4           compiler_4.5.2       proxy_0.4-29         remotes_2.5.0        withr_3.0.3          S7_0.2.2             DBI_1.3.0           
#>  [41] pkgbuild_1.4.8       R.utils_2.13.0       maps_3.4.3           MASS_7.3-65          lava_1.9.1           rappdirs_0.3.4       classInt_0.4-11      permute_0.9-10      
#>  [49] ModelMetrics_1.2.2.2 tools_4.5.2          units_1.0-1          otel_0.2.0           nnet_7.3-20          R.oo_1.27.1          glue_1.8.1           callr_3.8.0         
#>  [57] nlme_3.1-168         grid_4.5.2           reshape2_1.4.5       generics_0.1.4       recipes_1.3.3        gtable_0.3.6         R.methodsS3_1.8.2    class_7.3-23        
#>  [65] utf8_1.2.6           ggrepel_0.9.8        foreach_1.5.2        pillar_1.11.1        stringr_1.6.0        spam_2.11-4          clValid_0.7          splines_4.5.2       
#>  [73] survival_3.8-6       tidyselect_1.2.1     knitr_1.51           gridExtra_2.3        stats4_4.5.2         xfun_0.59            hardhat_1.4.3        factoextra_2.0.0    
#>  [81] timeDate_4052.112    stringi_1.8.7        evaluate_1.0.5       codetools_0.2-20     NbClust_3.0.1        entropy_1.3.2        tibble_3.3.1         cli_3.6.6           
#>  [89] rpart_4.1.24         xtable_1.8-8         processx_3.9.0       Rcpp_1.1.1-1.1       globals_0.19.1       parallel_4.5.2       gower_1.0.2          dotCall64_1.2       
#>  [97] listenv_0.10.1       mvtnorm_1.4-1        ipred_0.9-15         scales_1.4.0         prodlim_2026.03.11   e1071_1.7-17         rlang_1.2.0
```

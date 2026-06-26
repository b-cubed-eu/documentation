---
title: Predict community turnover
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Predict community turnover} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-06-26
sidebar:
  label: Community turnover
  order: 7
source: https://github.com/b-cubed-eu/dissmapr/blob/master/vignettes/articles/6-predict.Rmd
---




``` r
# Load the objects this article needs from the single bundled snapshot.
library(dissmapr)
library(ggplot2)
library(dplyr)
library(purrr)
inputs = readRDS(system.file("extdata", "dissmapr_vignettes.rds", package = "dissmapr"))

grid_spp_pa = inputs$grid_spp_pa
env_vars_reduced = inputs$env_vars_reduced
grid_env = inputs$grid_env
sp_cols = inputs$sp_cols
zeta2 = inputs$zeta2
ispline_gdm_tab = inputs$ispline_gdm_tab
grid_spp = inputs$grid_spp
rsa = inputs$rsa
```





### 1. Predict current Zeta Diversity (zeta2) using `predict_dissim()`

In this step we use our fitted order-2 GDM (`zeta2`) to generate a spatial map of pairwise compositional turnover (ζ₂) under current conditions. By `calling predict_dissim()` we

1. compute each site’s sampling‐effort‐adjusted species richness and mean distance to all other sites;   
2. apply the same environmental I-spline transformations used in the model;   
3. predict the Jaccard-scaled turnover (ζ₂) on the 0–1 scale;   
4. optionally plot the resulting heatmap with your study boundary overlaid.

We set a random seed for reproducibility (so Monte Carlo sampling inside `predict_dissim()` yields the same results each time), pull out just the species columns once, then inspect the returned `predictors_df` to confirm its dimensions, column names, and a quick peek at the key model outputs.


``` r
# Predict current zeta diversity using `predict_dissim` with sampling effort, geographic distance and environmental variables
# Only non-colinear environmental variables used in `zeta2` model
set.seed(123) # set.seed to generate exactly the same random results i.e. sam=100
spp_cols = names(grid_spp_pa[,-(1:6)])
predictors_df   = dissmapr::predict_dissim(
  grid_spp      = grid_spp_pa,
  species_cols  = spp_cols,
  env_vars      = env_vars_reduced,# env_vars_reduced[,-8]
  zeta_model    = zeta2, # From simple order 2 run above
  # zeta_model = ispline_gdm_tab$zeta_gdm_list[[1]], # From list of Zeta.msgdm models
  grid_xy       = grid_env,
  x_col         = "centroid_lon",
  y_col         = "centroid_lat",
  bndy_fc       = rsa, # Optional feature collection to plot as boundary
  show_plot     = TRUE
)
#> Error in `dissmapr::predict_dissim()`:
#> ! lazy-load database '/Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/dissmapr/R/dissmapr.rdb' is corrupt

# Check results
dim(predictors_df)
#> Error:
#> ! object 'predictors_df' not found
names(predictors_df)
#> Error:
#> ! object 'predictors_df' not found
head(predictors_df[,5:11])
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'predictors_df' not found
```

### 2. Predict future Zeta Diversity using `predict_dissim()`

Below we expand our workflow to forecast how ζ₂ respond to three extreme climate futures (2030, 2040, 2050) alongside the current scenario.

First, we define and center-scale each future by adding large temperature increments and rainfall multipliers, then bundle them into a named list of four environmental data frames:
   

``` r
# 1. Identify species & env columns
# spp_cols  = names(grid_spp_pa)[-(1:6)]
all_vars  = names(env_vars_reduced)
temp_vars = grep("^temp", all_vars, value = TRUE)
rain_vars = grep("^rain", all_vars, value = TRUE)
iso_vars = grep("^iso", all_vars, value = TRUE)
obs_var = "obs_sum"

# 2. Extreme future shifts
horizons     = c("2030","2040","2050")
mean_delta   = list(
  temp  = c("2030"= +2,  "2040"= +4,  "2050"= +6),
  iso   = c("2030"= +0.5,"2040"= +1.0,"2050"= +1.5),
  rain  = c("2030"= 0.9, "2040"= 0.8, "2050"= 0.7),
  effort= c("2030"= 1.3, "2040"= 1.6, "2050"= 2.0)
)
exagg_factor = c("2030"=1.5, "2040"=2.0, "2050"=2.5)

# 3) helper to amplify deviation from the mean
amplify = function(x, factor) {
  m = mean(x, na.rm=TRUE)
  m + (x - m) * factor
}

# # 4. Save original scaling parameters
# sc_params = scale(env_vars_reduced)
# mu    = attr(sc_params, "scaled:center")
# sigma = attr(sc_params, "scaled:scale")

# 4. Build list of future env tibbles
env_scenarios = c(
  list(current = env_vars_reduced),
  map(horizons, function(yr) {
    df = env_vars_reduced
    # mean shifts
    df[temp_vars] = df[temp_vars] + mean_delta$temp[yr]
    df[iso_vars]  = df[iso_vars]  + mean_delta$iso[yr]
    df[rain_vars] = df[rain_vars] * mean_delta$rain[yr]
    df[[obs_var]] = df[[obs_var]] * mean_delta$effort[yr]
    # amplify spatial variation
    df[temp_vars] = map_dfc(df[temp_vars], amplify, factor = exagg_factor[yr])
    df[iso_vars]  = map_dfc(df[iso_vars],  amplify, factor = exagg_factor[yr])
    # clamp obs_sum
    df[[obs_var]] = pmin(pmax(df[[obs_var]], 50), 8000)
    df
  }) |> set_names(horizons)
)
#> Error in `numeric()`:
#> ! invalid 'length' argument
# names(env_scenarios) = names(horizons)

# 5. Prepend current conditions
# env_scenarios = c(list(current = env_vars_reduced), env_futures)
str(env_scenarios, max.level = 1)
#> Error:
#> ! object 'env_scenarios' not found
```

Next, we loop through each scenario, re-apply the original centering and scaling, and call our `predict_dissim()` helper to compute ζ₂. We tag each result with its scenario name and combine them into one tidy data frame:


``` r
set.seed(123)

scenario_dfs = purrr::imap(env_scenarios, ~ {
  df = dissmapr::predict_dissim(
    grid_spp     = grid_spp,
    species_cols = spp_cols,
    env_vars     = .x,
    zeta_model   = zeta2,
    grid_xy      = grid_env,
    x_col        = "centroid_lon",
    y_col        = "centroid_lat",
    skip_scale   = FALSE,
    show_plot    = FALSE
  )
  df$scenario = .y
  df
})
#> Error:
#> ! object 'env_scenarios' not found
str(scenario_dfs, max.level=1)
#> Error:
#> ! object 'scenario_dfs' not found

# all_preds = bind_rows(scenario_dfs) %>%
#   mutate(scenario = factor(scenario, levels = c("current", names(temp_shifts))))
all_preds = bind_rows(scenario_dfs) 
#> Error:
#> ! object 'scenario_dfs' not found
head(all_preds)
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'all_preds' not found
```

We can then quickly compare the spatial ζ₂ surfaces under each future:


``` r
ggplot(all_preds,
       aes(centroid_lon, centroid_lat, fill = pred_zetaExp)) +
  geom_tile() +
  facet_wrap(~ scenario, ncol = 2) +
  scale_fill_viridis_c(direction = -1, name = expression(zeta[2])) +
  geom_sf(data = rsa, fill = NA, color = "black", inherit.aes = FALSE) +
  coord_sf() +
  labs(x = "Longitude", y = "Latitude",
       title = expression("Predicted ζ"[2] * " under current & future scenarios")) +
  theme_minimal() +
  theme(strip.text = element_text(face = "bold"),
        panel.grid = element_blank())
#> Error:
#> ! object 'all_preds' not found
```


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

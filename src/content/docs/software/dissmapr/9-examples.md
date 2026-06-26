---
title: Compute orderwise examples
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Compute orderwise examples} %\VignetteEngine{knitr::rmarkdown}
  %\VignetteEncoding{UTF-8}'
lastUpdated: 2026-06-26
sidebar:
  label: Compute orderwise examples
  order: 10
source: https://github.com/b-cubed-eu/dissmapr/blob/master/vignettes/articles/9-examples.Rmd
---




``` r
# Load the objects this article needs from the single bundled snapshot.
library(ggplot2)
library(dplyr)
library(viridis)
library(dissmapr)
inputs = readRDS(system.file("extdata", "dissmapr_vignettes.rds", package = "dissmapr"))

grid_spp = inputs$grid_spp
sp_cols = inputs$sp_cols
rsa = inputs$rsa
```





## Analysis of Species Richness and Community Turnover

Below we demonstrate how to quantify biodiversity patterns using two common ecological metrics: species richness and community turnover (beta diversity). Both analyses utilize the `compute_orderwise()` function from the `dissmapr` package, applying the metric functions `richness()` and `turnover()` respectively, to spatial biodiversity data organised in the `grid_spp` dataset.

### Example 1 - Species Richness using `richness`()`

Here we calculate species richness across sites in the `block_sp` dataset, using the `compute_orderwise()` function. The `richness()` metric function is applied to the `grid_id` column for site identification, with species data specified by `sp_cols`. Orders 1 to 4 are computed i.e. for order=1, it computes basic species richness at individual sites, while higher orders (2 to 4) represent the differences in richness between pairwise and/or multi-site combinations. A subset of 1000 samples is used for higher-order computations to speed-up computation time. Parallel processing is enabled with 4 worker threads to improve performance. The output is a table summarizing species richness across specified orders.


``` r
# Compute species richness (order 1) and the difference thereof for orders 2 to 4
rich_o1234 = dissmapr::compute_orderwise(
  df = grid_spp,
  func = richness,
  site_col = 'grid_id',
  sp_cols = sp_cols,
  sample_no = 1000,
  order = 1:4,
  parallel = TRUE,
  n_workers = 4)
#> Error in `compute_value()`:
#> ! read failed on /Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/dissmapr/R/dissmapr.rdb

# Check results
head(rich_o1234)
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'rich_o1234' not found
```


``` r
# Plot species richness distribution by order
boxplot(sqrt(value) ~ order,
        data = rich_o1234,
        col = c('#4575b4', '#99ce8f', '#fefab8', '#d73027'),
        horizontal = TRUE,
        outline = FALSE,
        main = 'Distribution of √Species Richness by Order')
#> Error:
#> ! object 'rich_o1234' not found

# Link centroid coordinates back to `rich_o1234` data.frame for plotting
rich_o1234$centroid_lon = grid_spp$centroid_lon[match(rich_o1234$site_from, grid_spp$grid_id)]
#> Error:
#> ! object 'rich_o1234' not found
rich_o1234$centroid_lat = grid_spp$centroid_lat[match(rich_o1234$site_from, grid_spp$grid_id)]
#> Error:
#> ! object 'rich_o1234' not found

# Summarise turnover by site (spatial location)
mean_rich_o1234 = rich_o1234 %>%
  group_by(order, site_from, centroid_lon, centroid_lat) %>%
  summarize(value = mean(value, na.rm = TRUE))
#> Error:
#> ! object 'rich_o1234' not found

# Check results
head(mean_rich_o1234)
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'mean_rich_o1234' not found
```


``` r
# Plot Richness calculated using `compute_orderwise(..., func = richness, ...)`
ggplot() +
  geom_tile(data = mean_rich_o1234[mean_rich_o1234$order==1,],
            aes(x = centroid_lon, y = centroid_lat, fill = sqrt(value))) +
  scale_fill_gradientn(colors = viridis(8)) + #Apply viridis color palette
  geom_sf(data = rsa, fill = NA, color = "black", alpha = 0.5) +
  theme_minimal() +
  labs(x = "Longitude", y = "Latitude", fill = "√Species Richness") +
  theme(panel.grid = element_blank(),panel.border = element_blank()
  )
#> Error:
#> ! object 'mean_rich_o1234' not found
```

Plot order-wise richness (orders 2:5) calculated using `compute_orderwise(..., func = richness, ...)` to visualise spatial patterns of richness across different orders. Results highlight regions of high or low richness compared across orders.


``` r
# Plot order-wise richness (orders 2:5) calculated using `compute_orderwise(..., func = richness, ...)`
ggplot() +
  geom_tile(data = mean_rich_o1234, aes(x = centroid_lon, y = centroid_lat, fill = sqrt(value))) +
  scale_fill_viridis_c(option = "turbo", name = "Richness") +
  geom_sf(data = rsa, fill = NA, color = "black", alpha = 0.5) +
  theme_minimal() +
  labs(
    title = "Mean √Richness by Order",
    x = "Longitude",
    y = "Latitude"
  ) +
  facet_wrap(~ order, ncol = 2)
#> Error:
#> ! object 'mean_rich_o1234' not found
```

### Example 2 - Community Turnover using `turnover()`

Here we calculate species turnover (beta diversity) across sites in the `block_sp` dataset using the `compute_orderwise()` function again. The `turnover()` metric function is applied to the `grid_id` column for site identification, with species data specified by `sp_cols`. Order = 1 is not an option because turnover requires a comparison between sites. For orders 2 to 5, it computes turnover for pairwise and higher-order site combinations, representing the proportion of species not shared between sites. A subset of 1000 samples is used for higher-order comparisons. Parallel processing with 4 worker threads improves efficiency, and the output is a table summarizing species turnover across the specified orders.


``` r
# Compute community turnover for orders 2 to 5
turn_o2345 = dissmapr::compute_orderwise(
  df = grid_spp,
  func = turnover,
  site_col = 'grid_id',
  sp_cols = sp_cols, # OR `names(grid_spp)[-c(1:4)]`
  sample_no = 1000, # Reduce to speed-up computation
  order = 2:5,
  parallel = TRUE,
  n_workers = 4)
#> Error in `compute_value()`:
#> ! read failed on /Library/Frameworks/R.framework/Versions/4.5-arm64/Resources/library/dissmapr/R/dissmapr.rdb

# Check results
head(turn_o2345)
#> Error in `h()`:
#> ! error in evaluating the argument 'x' in selecting a method for function 'head': object 'turn_o2345' not found
```

To visualize the spatial patterns of turnover across sites, geographic coordinates are added back to the results. This allows spatial exploration of turnover patterns across different orders, highlighting regions of high or low turnover and enabling comparisons across orders. These visualizations provide valuable insights into spatial biodiversity dynamics.
Below we assign the geographic coordinates (x and y) from the block_sp dataset to the turn_o2345 results. Using match, it aligns the coordinates to the site_from column in turn_o2345 based on the corresponding grid_id values in block_sp. This prepares the dataset for spatial plotting.


``` r
# Add coordinates back to 'turn_o2345' for plotting
turn_o2345$centroid_lon = grid_spp$centroid_lon[match(turn_o2345$site_from, grid_spp$grid_id)]
#> Error:
#> ! object 'turn_o2345' not found
turn_o2345$centroid_lat = grid_spp$centroid_lat[match(turn_o2345$site_from, grid_spp$grid_id)]
#> Error:
#> ! object 'turn_o2345' not found

# Summarise turnover by site (spatial location)
mean_turn_o2345 = turn_o2345 %>%
  group_by(order, site_from, centroid_lon, centroid_lat) %>%
  summarize(value = mean(value, na.rm = TRUE))
#> Error:
#> ! object 'turn_o2345' not found

# Plot Beta Diversity (pairwise turnover i.e. only order 2) calculated using `compute_orderwise(..., func = turnover, ...)`
ggplot() +
  geom_tile(data = mean_turn_o2345[mean_turn_o2345$order==2,],
            aes(x = centroid_lon, y = centroid_lat, fill = value)) +
  scale_fill_gradientn(colors = viridis(8)) + #Apply viridis color palette
  geom_sf(data = rsa, fill = NA, color = "black", alpha = 0.5) +
  theme_minimal() +
  labs(x = "Longitude", y = "Latitude", fill = "Beta Diversity") +
  theme(panel.grid = element_blank(),panel.border = element_blank()
  )
#> Error:
#> ! object 'mean_turn_o2345' not found
```

Plot order-wise turnover (orders 2:5) calculated using `compute_orderwise(..., func = turnover, ...)` to visualise spatial patterns of turnover across different orders. Results highlight regions of high or low turnover and facilitate comparison across orders, providing insights into spatial biodiversity dynamics.


``` r
# Plot order-wise turnover (orders 2:5) calculated using `compute_orderwise(..., func = turnover, ...)`
ggplot() +
  geom_tile(data = mean_turn_o2345, aes(x = centroid_lon, y = centroid_lat, fill = value)) +
  scale_fill_viridis_c(option = "turbo", name = "Turnover") +
  geom_sf(data = rsa, fill = NA, color = "black", alpha = 0.5) +
  theme_minimal() +
  labs(
    title = "Mean Turnover by Order",
    x = "Longitude",
    y = "Latitude"
  ) +
  facet_wrap(~ order, ncol = 2)
#> Error:
#> ! object 'mean_turn_o2345' not found
```

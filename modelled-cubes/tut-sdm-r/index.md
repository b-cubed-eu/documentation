---
title: Species Distribution Modelling Tutorial
permalink: /tut-sdm-r/
nav_order: 4
---

# Species Distribution Modelling

## Getting started

This is an [R Markdown](http://rmarkdown.rstudio.com) Notebook. When you execute code within the notebook, the results appear beneath the code. 

Try executing this chunk by clicking the *Run* button within the chunk or by placing your cursor inside it and pressing *Ctrl+Shift+Enter*. 

## Load libraries
```r
# See https://rsh249.github.io/bioinformatics/spatial.html

# install.packages("ENMeval", INSTALL_opts="--no-multiarch")
library(dismo) # Species Distribution Modeling tools
library(raster) # R tools for GIS raster files >>> USE terra{} instead
library(spocc) # Access species occurrence data from GBIF/iNaturalist
library(ENMeval) # Tuning SDMs
# library(mapr) # Quick mapping tools
library(sf)
library(ggplot2)
library(geodata)
library(sfheaders)

library(dplyr)
library(tidyr)        ## spread()
library(reshape2)     ## dcast(), melt()

# library(gdm)
library(zetadiv)
```

## Download [WorldClim](https://www.worldclim.org/data/index.html) climate data
```r
# Download the WorldClim Bioclimatic variables for the world at a 10 arc-minute resolution
bio_10m = getData('worldclim', var='bio', res=10, path='D:/Workshops/Zeta_MSGDM/Data') # Set your own path directory

# Use geodata package instead
bio_10m_rsa = worldclim_country("South Africa", var="tmin", path='D:/Workshops/Zeta_MSGDM/Data')

summary(bio_10m)
bio_10m[[1]] #BIO1 = Annual Mean Temperature
```
Read descriptions/definitions of [Bioclimatic variables](https://www.worldclim.org/data/bioclim.html).

## Crop to your area of interest
```r
# Define 'extent' of boundary
# South Africa
rsa_ext = extent(16, 33, -35, -22)

# Crop Bioclimatic variables to extent of South African boundary
rsaExt_bio_10m = crop(bio_10m, rsa_ext)
plot(rsaExt_bio_10m[[1]]) # Basic plotting 
```

## Or crop to country borders
```r
# Using GADM (gives a SpatialPolygonsDataFrame)
rsa = getData('GADM', country='South Africa', level=0, path='D:/Workshops/Zeta_MSGDM/Data')
# rsa = sf::st_as_sf(rsa)

# OR use geodata instead
# rsa = gadm(country="ZA", level=1, path='D:/Workshops/Zeta_MSGDM/Data') # or path=tempdir()
# Use country_codes() to find correct code
# cc = country_codes()
# View(cc)

# Basic National map
ggplot()+
  geom_sf(data=sf::st_as_sf(rsa))+
  ggtitle("South Africa")
```

```r
# Crop Bioclimatic variables to South African border
rsa_bio_10m = crop(bio_10m, rsa)
plot(rsa_bio_10m[[1]]) # See result

# OR use geodata package instead
# rsa_bio_10m = worldclim_country("South Africa", var="tmin", path='D:/Workshops/Zeta_MSGDM/Data')
```

## Extract raster values to points
```r
# Create 100 random points across South Africa
random_pts = spsample(rsa, n=100, type="random")    

# See randomly generate points on RSA map
plot(rsa_bio_10m[[1]])
plot(random_pts, add=T)

# Extract data to points
bio_values_1 = extract(rsa_bio_10m, random_pts)

# Use cbind.data.frame to get results as data.frame
bio_values_df = cbind.data.frame(coordinates(random_pts), bio_values_1)
head(bio_values_df)
```

## Use your own tabular data
```r
# Read directly from csv file
all_lepidoptera.sf = st_as_sf(read.csv('D:/Workshops/Zeta_MSGDM/Data/0097482-230224095556074.csv'), coords = c("x", "y"), crs = 4326)  
plot(all_lepidoptera.sf['family'])

###############################################################################
# EXTRACT RASTER DATA TO POINT LOCALITIES
# Extract raster value by points
lepidop_enviro = raster::extract(rsa_bio_10m, all_lepidoptera.sf)
lepidop_enviro
# Combine raster values with point and save as a CSV file.
lepidop_enviro.ptData = cbind(all_lepidoptera.sf, lepidop_enviro)
# Check output
names(lepidop_enviro.ptData)
head(lepidop_enviro.ptData)
```

## Get data from [GBIF](https://www.gbif.org/)
See [https://poldham.github.io/abs/gbif.html](https://poldham.github.io/abs/gbif.html)  
First sign-up for a free account [here]().
```r
library(dplyr)
library(readr)  
library(rgbif) # for occ_download
```

```r
# fill in your gbif.org credentials 
user = "xxxxxx" # your gbif.org username 
pwd = "xxxxxx" # your gbif.org password
email = "xxxx@xxxxx" # your email
```

The main functions related to downloads are:  
`occ_download()`: start a download on GBIF servers.  
`occ_download_prep()`: preview a download request before sending to GBIF.  
`occ_download_get()`: retrieve a download from GBIF to your computer.  
`occ_download_import()`: load a download from your computer to R.  

```r
gbif_download = occ_data(scientificName='Lepidoptera',
                         country='ZA',
                         hasCoordinate=TRUE,
                         hasGeospatialIssue=FALSE,
                         limit=500)
lepidoptera.df = as.data.frame(gbif_download$data)
head(lepidoptera.df)

lepidop.df = lepidoptera.df[,c(1,3,4,16,31:33,42:46)]
# head(lepidop.df)

lepidop.sf = st_as_sf(lepidop.df, coords = c("decimalLongitude", "decimalLatitude"), crs = 4326)
plot(lepidop.sf['stateProvince'])
```

### Citing your download
If you end up using your download in a research paper, you will want to cite the download’s DOI. Please see these [citation guidelines](https://www.gbif.org/citation-guidelines) for properly citing your download.
When using this dataset please use the following citation: 
GBIF.org (16 March 2023) GBIF Occurrence Download [https://doi.org/10.15468/dl.uvu2qm](https://doi.org/10.15468/dl.uvu2qm)


## Working with species occurence and environmental data tables
```r
# CONVERT TO DATAFRAME
# all_lepidoptera.df = as.data.frame(all_lepidoptera.sf)
all_lepidoptera.df = as.data.frame(cbind(all_lepidoptera.sf, st_coordinates(all_lepidoptera.sf)))[,-11]
head(all_lepidoptera.df) 

# lepidop_enviro.df = as.data.frame(lepidop_enviro.ptData)
lepidop_enviro.df = as.data.frame(cbind(lepidop_enviro.ptData, st_coordinates(lepidop_enviro.ptData)))[,-30]
head(lepidop_enviro.df)

# OR use sfheaders{}
# lepidop_enviro.df = sf_to_df(lepidop_enviro.ptData, fill=TRUE)
# head(lepidop_enviro.df)
# str(lepidop_enviro.df)
# summary(lepidop_enviro.df)
```

```r
# SET COLUMN FORMATS
lepidop_enviro.df$nameF = as.factor(lepidop_enviro.df$scientific)
lepidop_enviro.df$dateT = as.Date(lepidop_enviro.df$date)
head(lepidop_enviro.df)

# Create unique SITE IDs
lepidop_enviro.df$unqIDF = as.factor(as.integer(as.factor(paste(lepidop_enviro.df$X,lepidop_enviro.df$Y, sep='_'))))
head(lepidop_enviro.df)
str(lepidop_enviro.df)
```

## Get your table into the right format
```r
# str(lepidop_enviro.df)
head(lepidop_enviro.df)

lepidop_enviro.pa =lepidop_enviro.df %>%
  group_by(unqIDF, across(28:29), nameF, across(9:27)) %>%
  tally() %>%
  spread(nameF, n, fill=0)
head(lepidop_enviro.pa)
# View(lepidop_enviro.pa)
```

## Multi-site generalised dissimilarity modelling for a set of environmental variables and distances
### How to Compute Compositional Turnover Using Zeta Diversity
Using zetadiv: [https://rdrr.io/cran/zetadiv](https://rdrr.io/cran/zetadiv/man/Zeta.msgdm.html)
```r
lepidop_enviro.pa_noNA = lepidop_enviro.pa[complete.cases(lepidop_enviro.pa), ] 
Sitexy = as.data.frame(lepidop_enviro.pa_noNA[,1:3])
# xy = st_as_sf(Sitexy, coords = c("X", "Y"), crs = 4326)
xy = as.data.frame(lepidop_enviro.pa_noNA[,2:3])

envRast = rsa_bio_10m
envTab = as.data.frame(lepidop_enviro.pa_noNA[,c(1:22)])
sppTab = as.data.frame(lepidop_enviro.pa_noNA[,c(1:3,23:1109)])

# envRast
# str(envTab) # 5430 obs(sites) of  20 variables(enviro)
# str(sppTab) # 5430 obs(sites) of  1088 variables(species)

# ##site-species, table-table
# exFormat1a = formatsitepair(sppTab, 1, siteColumn="unqIDF", XColumn="X", YColumn="Y", predData=envTab)
# exFormat1a
# 
# ##site-species, table-raster
# exFormat1b = formatsitepair(sppTab, 1, siteColumn="unqIDF", XColumn="X", YColumn="Y", predData=envRast)
# exFormat1b
# 
# # plot(exFormat1b, plot.layout=c(2,3))
# plot(exFormat1b[[1]])
```

```r
# OR USE tidyr
long = sppTab %>%
  pivot_longer(!c(unqIDF,X,Y), names_to = "nameF", values_to = "value")
```

```r
# Dealing with biases associated with presence-only data
#--------------------------------------
# weight by site richness
# long[complete.cases(long), ]

gdmTab = formatsitepair(long, bioFormat=2, XColumn="X", YColumn="Y",abundColumn='value',
                         sppColumn="nameF", siteColumn="unqIDF", predData=envTab)

gdmTab.rw = formatsitepair(long, bioFormat=2, XColumn="X", YColumn="Y",
                            sppColumn="nameF", siteColumn="unqIDF",abundColumn='value',
                            predData=envTab, weightType="richness")
# weights based on richness (number of species records)
gdmTab.rw$weights[1:5]

# remove sites with < 10 species records
gdmTab.sf = formatsitepair(long, bioFormat=2, XColumn="X", YColumn="Y",
                            sppColumn="nameF", siteColumn="unqIDF",abundColumn='value',
                            predData=envTab, sppFilter=10)
```

### `gdm`: Generalized Dissimilarity Modeling
[Read more about `gdm` analysis here](https://github.com/fitzLab-AL/GDM)

```r
gdm.1 = gdm(gdmTab.sf, geo=T)
#summary(gdm.1)
str(gdm.1)

# gdm plots
#--------------------------------------------------------
length(gdm.1$predictors) # get idea of number of panels
plot(gdm.1, plot.layout=c(4,3))

gdm.1.splineDat = isplineExtract(gdm.1)
str(gdm.1.splineDat)

par(mfrow=c(1,1))
plot(gdm.1.splineDat$x[,"Geographic"], gdm.1.splineDat$y[,"Geographic"], lwd=3,
     type="l", xlab="Geographic distance", ylab="Partial ecological distance")
```

```r
zeta.ispline = Zeta.msgdm(sppTab[,c(4:1088)], envTab[,c(4:20)], xy, order=2,
                          rescale = TRUE,
                          rescale.pred = TRUE,
                          method = "mean",
                          normalize = "Jaccard",
                          reg.type = "ispline",
                          sam = 100)

# zeta.ispline.r = Return.ispline(zeta.ispline, envTab[,c(4:20)], distance = TRUE)
# zeta.ispline.r

dev.new()
Plot.ispline(msgdm = zeta.ispline, data.env = envTab[c(4:20)], distance = TRUE)
```

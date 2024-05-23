---
title: Spatial Data in R
permalink: /tut-spatial-r/
nav_order: 3
---

# Spatial Data in R

## An introduction to spatial data in R
### Useful online resources
[Fundamentals of Spatial Analysis in R](https://mhweber.github.io/AWRA_2020_R_Spatial/index.html)  
[Spatial Data Science with R and ```terra```](https://rspatial.org/index.html)  
[Handling spatial data in R #3](https://www.ecologi.st/post/big-spatial-data/)  
[Geocomputation with R](https://r.geocompx.org/)  
[Using Spatial Data with R](https://cengel.github.io/R-spatial/)  

### Install packages
```r
install.packages(c('sf','terra','spData','sp','rgdal','raster','rasterVis'))
install.packages('spDataLarge', repos = 'https://nowosad.r-universe.dev')
```

### Load packages
```r
library(sf)           # classes and functions for vector data
library(terra)        # classes and functions for raster data
library(spData)       # load geographic data
library(spDataLarge)  # load larger geographic data

library(sp)
library(rgdal)
# library(tmap)

library(raster)
library(rasterVis)

library(tidyr)
library(ggplot2)

library(tmap)
library(dplyr)
```

### Set your working directory
```r
#You will need to set your own working directory
setwd('D:/Students/VictoriaO')
# setwd('D:\\Students\\VictoriaO') #Same thing
```

### Objectives of this tutorial
- Read in vector data using the sp and sf packages.
- Convert between the sp and sf data models.
- Define and transform datums and projections for vector data.
- Access and work with attribute data associated with vector features.
- Read in raster data using the raster package.
- Define and transform datums and projections for raster data.

### Vector data
#### Points - Lines - Polygons
```r
class(world)
world
names(world)
plot(world)

head(data.frame(world))
names(world[3:6])
plot(world[3:6])

plot(world["lifeExp"])
summary(world["lifeExp"])

#Subset
(world_mini = world[1:2, 1:3])
plot(world_mini['name_long'])

(world_africa = world[world$continent == "Africa", ])
plot(world_africa)
plot(world_africa["lifeExp"])

plot(world["pop"], reset = FALSE)
plot(world_africa["lifeExp"], add = TRUE, alpha=0.5)
```

#### Understanding projections
Read more from [epsg.io](https://epsg.io/)

```r
st_crs(world)
plot(world[,1])

# EPSG:3395 is WGS 84 / World Mercator
world.tm = st_transform(world, 3395)
st_crs(world.tm)
plot(world.tm[,1])
plot(world[,1])
#................................

#Calculate areas
RSA = world[world$name_long == "South Africa", ]
plot(RSA[,1])

st_area(RSA) # requires the s2 package in recent versions of sf
#> 1.216401e+12 [m^2] # output is in units of square meters (m2)
st_area(RSA) / 1000000
#> 1 216 401 [m^2] # square kilometres (km2)
# units::set_units(st_area(RSA), km^2)
#> 1 216 401 [km^2] 1,221 million km² #https://en.wikipedia.org/wiki/South_Africa
```

#### Where to find free GIS data layers

[https://mapcruzin.com/](https://mapcruzin.com/free-south-africa-arcgis-maps-shapefiles.htm)  
[https://data.humdata.org/dataset/](https://data.humdata.org/dataset/cod-ab-zaf?)  
[https://africaopendata.org/](https://africaopendata.org/group/south-africa?res_format=SHP)  
[https://egis.environment.gov.za/data_egis/](https://egis.environment.gov.za/data_egis/data_download/current)  
[https://bgis.sanbi.org/SpatialDataset](https://bgis.sanbi.org/SpatialDataset)  
[https://dataportal-mdb-sa.opendata.arcgis.com/](https://dataportal-mdb-sa.opendata.arcgis.com/)  
[http://geoportal.icpac.net/](http://geoportal.icpac.net/layers/?limit=100&offset=0)  

#### Add your own data layers

```r
#Create your own points
(pnts = rbind(c(-79, 36), c(-101, 41), c(-80, 27), c(-91, 52), c(-68, 42)))
(pnts.sp = SpatialPoints(pnts))
summary(pnts.sp)

#Plot those on map produced in 116
plot(pnts.sp)
plot(world_africa["lifeExp"])
plot(pnts.sp, add=T, col='white')

#Don't forget to add a coordinate system
is.projected(pnts.sp)
proj4string(pnts.sp) =CRS('+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs')
proj4string(pnts.sp) =CRS('+init=epsg:4326') #Different way to do same thing
summary(pnts.sp)
```

```r
#Read in data (shapefiles) *Data from getData {raster} 
#Using rgdal
(rsa_country = readOGR(dsn = 'Data', layer = 'gadm36_ZAF_0'))
plot(rsa_country)
(rsa_provinces = readOGR(dsn = 'Data', layer = 'gadm36_ZAF_1'))
plot(rsa_provinces)
(rsa_district = readOGR(dsn = 'Data', layer = 'gadm36_ZAF_2'))
head(rsa_district); plot(rsa_district)

plot(rsa_country)
plot(rsa_provinces)
plot(rsa_district)

#Using sf
(rsa_country_sf = st_read('Data/gadm36_ZAF_0.shp'))
(rsa_provinces_sf = st_read('Data/gadm36_ZAF_1.shp'))
(rsa_district_sf = st_read('Data/gadm36_ZAF_2.shp'))
plot(rsa_country_sf[,1])
```

#### Convert SPDF to SF
```r
#You will need to set your own working directory. 
rsa_country #SpatialPolygonsDataFrame
rsa_country_sf #Simple feature collection with 1 feature and 2 fields. Geometry type: MULTIPOLYGON
rsa_country_sp = readOGR(dsn = 'Data', layer = 'gadm36_ZAF_0')
rsa_country_sf = st_read('Data/gadm36_ZAF_0.shp')

(rsa_country_sp_from_sf = as(rsa_country_sf, Class='Spatial'))
(rsa_country_sf_from_sp = st_as_sf(rsa_country_sp))
```
```r
#Read in table of coordinates and create points
wdpa.df = read.csv('Data/WDPA_Africa.csv')
head(wdpa.df)
str(wdpa.df) #'data.frame':	2411 obs. of  19 variables:
names(wdpa.df)

(wdpa.sp = SpatialPointsDataFrame(wdpa.df[,3:4], wdpa.df[,c(5,7,16,19)], 
                                  proj4string=CRS('+init=epsg:4326'))) #SpatialPointsDataFrame
plot(wdpa.sp)

wdpa.sf = st_as_sf(wdpa.df, coords = c("Longitude", "Latitude"), crs = 4326)
wdpa.sf  
plot(wdpa.sf['NAME'])
```

##### More about coordinate systems
```r
st_crs(rsa_country_sf)
(proj_info = st_crs(rsa_country_sf))
(proj_info_proj4 = as.vector(proj_info$proj4string))

st_crs(rsa_country_sf) = NA
st_crs(rsa_country_sf)

st_crs(rsa_country_sf) = '+proj=longlat +ellps=WGS84 +datum=WGS84 +no_defs'
st_crs(rsa_country_sf)

st_crs(rsa_country_sf) = NA
st_crs(rsa_country_sf)

st_crs(rsa_country_sf) = 4326
st_crs(rsa_country_sf)
#................................

rsa_country_tm = st_transform(rsa_country_sf, crs=3395)
st_crs(rsa_country_tm)
```

#### Save vector data to local drive
```r
writeOGR(obj=rsa_district, dsn='Data', 
         layer='rsa_district2', driver='ESRI Shapefile')

st_write(rsa_district_sf, 'Data/rsa_country_tm.shp')
```

##### Convert center points and then write to local drive
```r
(rsa_district_pts = st_centroid(rsa_district_sf, of_largest = TRUE))
plot(rsa_district_pts)
plot(rsa_district_sf)
st_write(rsa_district_pts, 'rsa_district_pts2.shp', layer_options = 'GEOMETRY=AS_XY')
```

### Raster data
#### Raster Data Stucture
```r
(dem_ter = rast(system.file("raster/srtm.tif", package = "spDataLarge")))
class(dem_ter);plot(dem_ter)

(dem_ras = raster(system.file("raster/srtm.tif", package = "spDataLarge")))
class(dem_ras);plot(dem_ras)
```

#### Setup the coordinate systems 
```r
(geo = '+proj=longlat +datum=WGS84 +no_defs') # Unprojected world Geodetic System (degrees) CRS("+init=epsg:4326")
(utm36s = "+proj=utm +zone=36 +south +datum=WGS84 +units=m +no_defs") # Local UTM projection [36s] specific to KNP's longitude (meters)

rsa_country.geo = rsa_country
rsa_country.tm = spTransform(rsa_country.geo,CRS('+init=epsg:3395'))
rsa_country.tm
```

#### Create a new 20km2 raster based on the extent of SPDF
```r
(grid20km = raster(extent(rsa_country.tm),res=c(20000,20000), crs=CRS('+init=epsg:3395')))
(grid20km = raster(rsa_country.tm,res=c(20000,20000), crs=CRS('+init=epsg:3395')))
grid20km$site = 1:ncell(grid20km)
grid20km

#### Plot the raster
# Reset display settings
dev.off()

# Now plot
plot(grid20km)
plot(rsa_country.tm, add=T)
 
# Remember to mask the background to NA
# rsa_mask = rasterize(rsa_country.tm, grid20km)
rsa_mask = rasterize(rsa_country.tm, grid20km[[1]], background=NA)
plot(rsa_mask)
# grid20km_mask = mask(grid20km,rsa_mask)
# plot(grid20km_mask)
plot(rsa_country.tm, add=T)

#Plot this Single-Band Raster Data
#--------------------------------------------------
tm_shape(rsa_mask)+
  tm_raster(style='pretty')+
  tm_layout(legend.outside = TRUE)
#--------------------------------------------------
```

#### Save raster to local drive
```r
writeRaster(rsa_mask, filename='grid20km_mask', format = 'GTiff')
```
#### Get data and extract to area of interest

WorldClim (https://www.worldclim.org/data/index.html) global climatic and weather data @ 30 arc-second (~1km) grid

***Bioclim variables***
Variable Description
- BIO1 	Annual Mean Temperature
- BIO2 	Mean Diurnal Range (Mean of monthly (max temp - min temp))
- BIO3 	Isothermality (BIO2/BIO7) (* 100)
- BIO4 	Temperature Seasonality (standard deviation *100)
- BIO5 	Max Temperature of Warmest Month
- BIO6 	Min Temperature of Coldest Month
- BIO7 	Temperature Annual Range (BIO5-BIO6)
- BIO8 	Mean Temperature of Wettest Quarter
- BIO9 	Mean Temperature of Driest Quarter
- BIO10 	Mean Temperature of Warmest Quarter
- BIO11 	Mean Temperature of Coldest Quarter
- BIO12 	Annual Precipitation
- BIO13 	Precipitation of Wettest Month
- BIO14 	Precipitation of Driest Month
- BIO15 	Precipitation Seasonality (Coefficient of Variation)
- BIO16 	Precipitation of Wettest Quarter
- BIO17 	Precipitation of Driest Quarter
- BIO18 	Precipitation of Warmest Quarter
- BIO19 	Precipitation of Coldest Quarter

```r
bioclim = getData('worldclim', var='bio', res=10, path='Data') 
bioclim
# gain(bioclim)=0.1 # Must be multipled by 0.1 to convert back to degrees Celsius. 
# # Also precipitation is in mm, so a gain of 0.1 would turn that into cm.

plot(bioclim[[1:4]]) # just the first 3, since its slow
```
#### Subsetting and spatial cropping
***Crop using a Spatial polygon***
```r
# bio1.rsa = crop(bioclim[[1]], bbox(rsa_country))
bio1.rsa = crop(bioclim[[1]], rsa_country)
plot(bio1.rsa) #dimensions : 76, 98, 7448  (nrow, ncol, ncell) | resolution : 0.1666667, 0.1666667  (x, y)

# Note: Masking is different to cropping i.e. you get NA values for outside polygon area
bio1.rsa.mask = mask(bio1.rsa, rsa_country)
plot(bio1.rsa.mask)
```
#### Spatial aggregation
```r
# Aggregate using a function
bio1.rsax3 = aggregate(bio1.rsa, 3, fun=mean)
plot(bio1.rsax3) #dimensions : 26, 33, 858  (nrow, ncol, ncell) | resolution : 0.5, 0.5  (x, y)

# Raster calculations
cellStats(bio1.rsa,range);cellStats(bio1.rsa,mean)
```
#### Extracting Raster Data
```r
(bioclim.rsa = crop(bioclim, rsa_country))
plot(bioclim.rsa[[1]])
plot(bioclim.rsa[[1:4]])

# define a new dataset of points to play with
pts = sampleRandom(bioclim.rsa,100,xy=T,sp=T)
# plot(pts);axis(1);axis(2)
plot(bioclim.rsa[[1]])
plot(pts, add=T)
head(pts)

# Extract data using a SpatialPoints object
ptsEmpty = pts[,1:2]
head(ptsEmpty)
pts.data = raster::extract(bioclim.rsa[[1:4]], ptsEmpty, df=T, sp=T)
head(pts.data)

# Create histogram of extracted values
summary(pts.data)
```
#### Bin data using custom breaks
```r
pts.data@data = pts.data@data %>% mutate(binBio1 = cut(bio1, breaks=c(0, 128, 150, 200, 241)))

#perform binning with specific number of bins
pts.data@data = pts.data@data %>% mutate(binBio1 = cut(bio1, breaks=3))

# Plot histograms - examples
# counts
ggplot(data.frame(pts.data@data), aes(x=binBio1)) +
  geom_bar()

ggplot(data = pts.data@data, mapping = aes(x=binBio1,y=log10(bio1))) + 
  geom_jitter(aes(color='blue'),alpha=0.2) +
  geom_boxplot(fill="bisque",color="black",alpha=0.3) + 
  labs(x='log bio1 value per bin') +
  guides(color=FALSE) +
  theme_minimal() 
```

### QGIS Workshop (in progress)
A Free and Open Source Geographic Information System
[https://qgis.org/en/site/](https://qgis.org/en/site/)
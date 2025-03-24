---
title: How to build a species occurrence cube from a GBIF checklist
sidebar:
  label: Build a cloud native data cube
  order: 5
---

Suggestion citation:

> Trekels M 2025). Converting GBIF data cubes in cloud native data formats. <https://docs.b-cubed.eu/tutorials/conversion-cube-to-zarr/>

# Using B3 data cubes on AWS S3 storage
This tutorial is going step by step over the creation of two additional data formats to store the B3 data cubes. We are focusing on GeoParquet and Zarr as potential candidates that contain the geometry within the files. 0

In this example, we are using the GPKG files for Extended Quarter Degree Grid Cells that were created by GBIF: https://download.gbif.org/grids/EQDGC/

## Initializing the environment

### Loading the Python packages


```python
import os
import pandas as pd
import geopandas as gpd
import dask.dataframe as dd
import xarray as xr
import s3fs
import zarr
from shapely import wkt
```

### Setting environmental variables


```python
# File paths to the stored files
gbif_cube = "/location/of/gbif/download.csv"
geometry_file = "/location/of/grid.gpkg"

'''
REMARK: in this example we use pre-generated GPKG files of the geospacial grids.
However, it is possible to generate this file from any geospatial file format to GPKG using GDAL.
'''

# Evironment variables
os.environ["AWS_ACCESS_KEY_ID"] = "your AWS access key ID"
os.environ["AWS_SECRET_ACCESS_KEY"] = "your AWS secret access key"

# S3 region
s3_region = "region" # e.g. eu-north-1

# Location to which the GeoParquet file needs to be stored
geoparquet_path = "/path/to/cube.parquet"

# Link to S3 Bucket to store the Zarr file
s3_path = "s3://your/S3/bucket/cubeName.zarr"
```

## Loading the data in GeoDataFrame


```python
# Load CSV
data = pd.read_csv(gbif_cube, sep='\t')

# Load GRID (Geopackage)
qdgc_ref = gpd.read_file(geometry_file, engine='pyogrio', use_arrow=False)

# Ensure CRS is set (modify CRS if another datum is used!)
if qdgc_ref.crs is None:
    qdgc_ref.set_crs("EPSG:4326", inplace=True)

# Merge Data, in this step you need to check the columns on which to perform the matching
test_merge = pd.merge(data, qdgc_ref, left_on='eqdgccellcode', right_on='cellCode')
gdf = gpd.GeoDataFrame(test_merge, geometry='geometry')
```

## Exporting the data to GeoParquet


```python
gdf.to_parquet(geoparquet_path, geometry_encoding='WKB')
```

## Exporting the data to Zarr in an AWS S3 bucket


```python
# Convert to Dask DataFrame
ddf = dd.from_pandas(gdf, npartitions=max(1, gdf["specieskey"].nunique() // 1000))  # Dynamic partitioning
columns_to_compute = ["yearmonth", "eqdgccellcode", "familykey", "family", "specieskey",
                      "species", "occurrences", "distinctobservers",
                      "familycount", "geometry"]

pdf = ddf[columns_to_compute].compute()

# Ensure geometry is still a GeoSeries before conversion
if not isinstance(pdf["geometry"], gpd.GeoSeries):
    pdf["geometry"] = gpd.GeoSeries(pdf["geometry"], crs="EPSG:4326")

# Convert geometry column to WKT (text format for serialization)
pdf["geometry"] = pdf["geometry"].apply(lambda geom: geom.wkt if geom and geom is not None else "")

# Ensure all other columns have appropriate types
for col in pdf.columns:
    if pdf[col].dtype.name == "string[pyarrow]":  
        pdf[col] = pdf[col].astype(str).fillna("")  # Convert to string and replace NaN
    elif pdf[col].dtype.kind in ['i', 'f']:  
        pdf[col] = pdf[col].fillna(0)  # Replace NaN with 0 for numbers
    elif pdf[col].dtype == "object":  
        pdf[col] = pdf[col].astype(str).fillna("")  # Ensure object columns are converted to string

# Convert to Xarray
ds = xr.Dataset.from_dataframe(pdf)
ds = ds.chunk({"index": 10000})  # Optimize chunking for large datasets

# S3 Config
s3_kwargs = {
    "key": os.getenv("AWS_ACCESS_KEY_ID"),
    "secret": os.getenv("AWS_SECRET_ACCESS_KEY"),
}
fs = s3fs.S3FileSystem(client_kwargs={'region_name': s3_region})  

# Ensure no existing file conflict
if fs.exists(s3_path):
    fs.rm(s3_path, recursive=True)

# Save to Zarr (Local Write First, Then Move to S3)
try:
    ds.to_zarr("local_temp.zarr", mode="w")
    fs.put("local_temp.zarr", s3_path, recursive=True, batch_size=50)
    print("Zarr store written to S3 successfully.")
except Exception as e:
    print(f"Error writing to Zarr: {e}")
```

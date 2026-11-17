---
title: Convert a species occurrence cube to an EBV NetCDF cube
lastUpdated: 2026-07-07
sidebar: 
  label: Create an EBV NetCDF cube
  order: 4
source: https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/README.md
---

## How to cite

> Estupinan-Suarez LM (2024). Convert a species occurrence cube to an EBV NetCDF cube. <https://docs.b-cubed.eu/tutorials/cube-to-ebv-netcdf/>, <https://doi.org/10.5281/zenodo.13798783>

## Introduction

In 2024, we published the first two Essential Biodiversity Data (EBV) datasets to the [EBV Data Portal](https://portal.geobon.org/) derived from a species occurrence cube and using B-Cubed software (especially the [ebvcube](/software/ebvcube/readme/) R package). The datasets we published are:

1. Annex I of the Birds Directive (~200 species) <https://doi.org/10.25829/mbw554>
2. The list of Invasive Alien Species of EU concern (88 species) <https://doi.org/10.25829/w0vf54>

The workflow we used to create the species occurrence cube and convert it to an EBV NetCDF cube - the format used by the EBV Data Portal - is described below.

:::note
This tutorial was written before the species occurrence cubes could be created with [rgbif](/software/rgbif/readme).
:::


## Birds Directory Annex I

The following table lists the steps and scripts we used to mobilize data from GBIF to the EBV Data Portal for the Birds Directive Annex I. Scripts can be found in the directory [scripts/Rmd/birds](https://github.com/EBVcube/B-Cubed_data_mobilisation/tree/main/scripts/Rmd/birds).

Step | Code | Output
--- | --- | ---
Pre-processing notebook - Harmonisation of species keys for the JSON query of species listed in the Annex I of the Birds Directive* | [00_preparing_specieskey](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/00_preparing_specieskey.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/00_preparing_specieskey.pdf)
Notebook 01 - Prototype for creating a occurrence cube of birds listed in the Annex I of the Birds Directive | [01_birds_create_occurrence_cubes](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/01_birds_annex1_create_occurrence_cubes.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/01_birds_annex1_create_occurrence_cubes.pdf)
Notebook 02 - Data exploration of species listed in the Birds Directive Annex I | [02_birds_annex1_data_exploration](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/02_birds_annex1_data_exploration.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/02_birds_annex1_data_exploration.pdf)
Notebook 03 - Calculation of Metrics for the Birds Directive Annex I Using Occurrence Cubes (Part I) | [03_birds_annex1_computing_metrics_1_2_3](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/03_birds_annex1_computing_metrics_1_2_3.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/01_birds_annex1_create_occurrence_cubes.pdf)
Notebook 04 - Calculation of Metrics for the Birds Directive Annex I Using Occurrence Cubes (Part II) | [04_birds_annex1_computing_metrics_4_5_6](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/04_birds_annex1_computing_metrics_4_5_6.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/01_birds_annex1_create_occurrence_cubes.pdf)
Notebook 05 - Creation of the EBV NetCDF for the Birds Directive occurrences cube metrics | [05_birds_metrics2ebvcube](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/05_birds_metrics2ebvcube.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/birds/05_birds_metrics2ebvcube.pdf)

## Invasive Alien Species of EU concern

The following table lists the steps and scripts we used to mobilize data from GBIF to the EBV Data Portal for the Invasive Alien Species (IAS) of Union Concern. Scripts can be found in the directory [scripts/Rmd/ias](https://github.com/EBVcube/B-Cubed_data_mobilisation/tree/main/scripts/Rmd/ias).

Step | Code | Output
--- | --- | ---
Inputs for occurrence cubes rasterisation using the 10 Km EEA vector grid* | [00_eeagrid10km_to_centroids](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/00_eeagrid10km_to_centroids.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/00_eeagrid10km_to_centroids.pdf)
Notebook 01 - Prototype for creating a occurrence cube of IAS | [01_ias_create_occurrence_cubes](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/01_ias_create_occurrence_cubes.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/01_ias_create_occurrence_cubes.pdf)
Notebook 02 - Data exploration of the IAS occurrence cube |  [02_ias_data_exploration](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/02_ias_data_exploration.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/02_ias_data_exploration.pdf)
Notebook 03 - Metrics computation for the IAS occurrences cube | [03_ias_computing_metrics_cubes](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/03_ias_computing_metrics_cubes.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/03_ias_computing_metrics_cubes.pdf)
Notebook 04 - Creation of the EBV NetCDF for the IAS occurrences cube metrics0 | [04_ias_metrics2ebvcube](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/04_ias_metrics2ebvcube.Rmd) | [Pdf](https://github.com/EBVcube/B-Cubed_data_mobilisation/blob/main/scripts/Rmd/ias/03_ias_computing_metrics_cubes.pdf)

# B-Cubed_data_mobilisation [![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.13798783.svg)](https://doi.org/10.5281/zenodo.13798783)
This repository documents the development of the first B-Cubed data mobilisation. Data has been mobilised from GBIF to the EBV Portal using both the B-Cubed software developed by GBIF and the ebvcube package.

We have started by mobilising the occurrence of species listed in:
1. The list of Invasive Alien Species (IAS) of EU concern (88 species).
2. Annex I of the Birds Directive (~200 species)

Later we will mobilise:
3. The Global Reptile Assessment (~10000 species) 

The specifications for the generation of the occurence cubes (JSON format) can be found in separate files in this repository. 

The code is available in Rmarkdown and rendered as HTML and PDF notebooks. The notebooks are listed in Table 1 for Annex I of the Birds Directive and in Table 2 for IAS of Union concern.


Table 1. Data Mobilisation Notebooks from GBIF to the EBV Data Portal for the Birds Directive Annex I (path: scripts/Rmd/birds). _*Preprocessing notebook_.
| Title/Subtitle                                                                                                                      | File name                                   |
|-------------------------------------------------------------------------------------------------------------------------------------|---------------------------------------------|
| Pre-processing notebook - Harmonisation of species keys for the JSON query of species listed in the Annex I of the Birds Directive* | 00_preparing_specieskey.Rmd                 |
| Notebook 01 - Prototype for creating a occurrence cube of birds listed in the Annex I of the Birds Directive                        | 01_birds_create_occurrence_cubes.Rmd        |
| Notebook 02 - Data exploration of species listed in the Birds Directive Annex I                                                     | 02_birds_annex1_data_exploration            |
| Notebook 03 - Calculation of Metrics for the Birds Directive Annex I Using Occurrence Cubes (Part I)                                | 03_birds_annex1_computing_metrics_1_2_3.Rmd |
| Notebook 04 - Calculation of Metrics for the Birds Directive Annex I Using Occurrence Cubes (Part II)                               | 04_birds_annex1_computing_metrics_4_5_6.Rmd |
| Notebook 05 - Creation of the EBV NetCDF for the Birds Directive occurrences cube metrics                                           | 05_birds_metrics2ebvcube.Rmd                |


Table 2. Data Mobilisation Notebooks from GBIF to the EBV Data Portal for IAS of Union Concern (path: scripts/Rmd/ias). _*Preprocessing notebook._
| Title/Subtitle                                                                      | File name                          |
|-------------------------------------------------------------------------------------|------------------------------------|
| Inputs for occurrence cubes rasterisation using the 10 Km EEA vector grid*          | 00_eeagrid10km_to_centroids.Rmd    |
| Notebook 01 - Prototype for creating a occurrence cube of IAS                       | 01_ias_create_occurrence_cubes.Rmd |
| Notebook 02 - Data exploration of the IAS occurrence cube                           |  02_ias_data_exploration.Rmd       |
|  Notebook 03 - Metrics computation for the IAS occurrences cube                     | 03_ias_computing_metrics_cubes.Rmd |
| Notebook 04 - Creation of the EBV NetCDF for the IAS occurrences cube metrics0      | 04_ias_metrics2ebvcube.Rmd         |

The resulting datasets can be visualised and accessed through the [EBV Data Portal](https://portal.geobon.org/home) [DOI 10.25829/mbw554](https://doi.org/10.25829/mbw554) and [DOI 10.25829/w0vf54](https://doi.org/10.25829/w0vf54).

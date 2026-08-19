---
title: Download a species occurrence cube from GBIF.org
sidebar:
  label: Download a cube from GBIF.org
  order: 1
---

## How to cite

> Desmet P (2025). Download a species occurrence cube from GBIF.org. <https://docs.b-cubed.eu/tutorials/download-a-cube-from-gbif/>

## Steps

Here are the steps to create and download a species occurrence cube from GBIF.org:

1. Go to <https://gbif.org>.
2. Log into your GBIF account (you can register for free):

    ![login screenshot](/tutorials/download-a-cube-from-gbif/login.png)

3. Go to the [occurrence search](https://www.gbif.org/occurrence/search?occurrence_status=present) and look for the data you want to include in your cube. Here we select occurrences of animals from Poland, recorded since 2000:

    ![occurrence search screenshot](/tutorials/download-a-cube-from-gbif/occurrence-search.png)

4. Go to the `Download` tab, scroll to `Occurrence cube` and click `Configure`:

    ![occurrence download](/tutorials/download-a-cube-from-gbif/occurrence-download.png)

5. Choose how the data should be cubed, including its `Dimensions`, `Measures` and `Data quality` aspects. Here we choose 3 dimensions: taxonomic (by species), temporal (by year and month) and spatial (using the EEA reference grid with 1 km grid cells):

    ![cube options](/tutorials/download-a-cube-from-gbif/cube-options.png)

6. If you want more advanced options, click `Edit as SQL` at the bottom to completely customize your query:

    ![cube sql](/tutorials/download-a-cube-from-gbif/cube-sql.png)

7. Click `Continue` and agree to the terms.

    ![cube terms](/tutorials/download-a-cube-from-gbif/cube-terms.png)

8. Click `Create download` and your cube will be generated:

    ![cube processing](/tutorials/download-a-cube-from-gbif/cube-processing.png)

9. You will receive an email at the address linked with your GBIF account when the data are ready for download. You can also find all your downloads in [your profile](https://www.gbif.org/user/download).

10. Click the link to open the [unique landing page](https://doi.org/10.15468/dl.c33mk5) for your cube. Here you can download the data, see how to cite it using its DOI, get an overview of all the parameters that were used and learn what datasets contributed data to it:

    ![download page](/tutorials/download-a-cube-from-gbif/download-page.png)

11. Download the data and unzip it. It is a tab-delimited text file, where each row represents the requested measures per dimension combination:

    ```
    kingdom	kingdomkey	phylum	phylumkey	class	classkey	order	orderkey	family	familykey	genus	genuskey	species	specieskey	yearmonth	eeacellcode	kingdomcount	phylumcount	classcount	ordercount	familycount	genuscount	occurrences	mintemporaluncertainty	mincoordinateuncertaintyinmeters
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea alba	GCHR	2022-01	1kmE4601N3317	2	2	2	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2012-05	1kmE4604N3425	10	10	10	1	1	1	1	60	1235.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea alba	GCHR	2022-10	1kmE4643N3286	15	15	15	2	2	2	2	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2024-08	1kmE4644N3434	4	4	4	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea alba	GCHR	2023-04	1kmE4645N3286	55	55	55	3	3	3	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2023-04	1kmE4645N3286	55	55	55	3	3	3	2	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2023-10	1kmE4658N3323	15	15	15	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea alba	GCHR	2023-12	1kmE4669N3232	22	22	22	4	4	4	2	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2023-12	1kmE4669N3232	22	22	22	4	4	4	2	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea alba	GCHR	2021-05	1kmE4682N3462	10	10	10	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2024-08	1kmE4693N3242	2	2	2	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2022-08	1kmE4744N3323	12	12	12	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2024-07	1kmE4772N3148	4	4	4	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea alba	GCHR	2023-08	1kmE4777N3159	14	14	14	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2022-08	1kmE4777N3297	37	37	37	4	4	4	3	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea alba	GCHR	2022-08	1kmE4777N3297	37	37	37	4	4	4	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2016-05	1kmE4782N3530	14	14	14	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2022-08	1kmE4784N3533	15	15	15	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2021-05	1kmE4791N3266	58	58	58	1	1	1	1	86400	1000.0
    Animalia	N	Chordata	CH2	Aves	V2	Pelecaniformes	3RZ	Ardeidae	6PB	Ardea	32FH	Ardea cinerea	GCHS	2023-12	1kmE4804N3067	16	16	16	2	2	2	2	86400	1000.0
    ```

See the **software** and **tutorials** on this website for ways to explore and process the data. The steps describe above can also be repeated programmatically, using the [GBIF SQL download API](/infrastructure/gbif-api/).

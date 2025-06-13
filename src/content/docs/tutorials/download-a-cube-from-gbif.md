---
title: Download a species occurrence cube from GBIF.org
sidebar:
  label: Download a cube from GBIF.org
  order: 1
---

Suggestion citation:

> Desmet P (2024). Download a species occurrence cube from GBIF.org. <https://docs.b-cubed.eu/tutorials/download-a-cube-from-gbif/>

Here are the steps to create and download a species occurrence cube from GBIF.org:

1. Go to <https://gbif.org>.
2. Log into your GBIF account (you can register for free):

    ![login screenshot](/tutorials/download-a-cube-from-gbif/login.png)

3. Go to the [occurrence search](https://www.gbif.org/occurrence/search?occurrence_status=present) and look for the data you want to include in your cube. Here we select occurrences of animals from Poland, recorded during or after 2000:

    ![occurrence search screenshot](/tutorials/download-a-cube-from-gbif/occurrence-search.png)

4. Go to the `Download` tab and select `Cube`:

    ![occurrence download](/tutorials/download-a-cube-from-gbif/occurrence-download.png)

5. In the window that appears, choose how the data should be cubed, including its `Dimensions`, `Measures` and `Data quality` aspects. Here we choose 3 dimensions: taxonomic (by species), temporal (by year and month) and spatial (using the EEA reference grid with 1 km grid cells):

    ![cube options](/tutorials/download-a-cube-from-gbif/cube-options.png)

6. Click the `Download` button at the bottom of the window and your cube will be generated:

    ![cube processing](/tutorials/download-a-cube-from-gbif/cube-processing.png)

7. You will receive an email linked with your GBIF account when the data are ready for download. You can also find all your downloads in [your profile](https://www.gbif.org/user/download).

8. Click the link to open the [unique landing page](https://doi.org/10.15468/dl.c733pv) for your cube. Here you can download the data, see how to cite it using its DOI, get an overview of all the parameters that were used and learn what datasets contributed data to it:

    ![download page](/tutorials/download-a-cube-from-gbif/download-page.png)

9. Download the data and unzip it. It is a tab-delimited text file, where each row represents the requested measures per dimension combination:

    ```
    kingdom	kingdomkey	phylum	phylumkey	class	classkey	order	orderkey	family	familykey	genus	genuskey	species	specieskey	yearmonth	eeacellcode	familycount	genuscount	occurrences	mintemporaluncertainty	mincoordinateuncertaintyinmeters
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Brachionidae	3880	Brachionus	1000593	Brachionus calyciflorus	4984102	2012-06	1kmE4880N3502	1	1	1	86400	1000.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Brachionidae	3880	Brachionus	1000593	Brachionus angularis	4984131	2011-05	1kmE4900N3354	1	1	1	86400	1000.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Brachionidae	3880	Brachionus	1000593	Brachionus calyciflorus	4984102	2005-05	1kmE4941N3511	2	1	1	86400	1000.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Bdelloidea	1234	Philodinidae	8058	Rotaria	1000832	Rotaria neptunia	1000873	2011-05	1kmE4741N3096	4	4	3	2678400	10.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Bdelloidea	1234	Philodinidae	8058	Rotaria	1000832	Rotaria rotatoria	1000850	2011-05	1kmE4741N3096	4	4	1	2678400	10.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Trichocercidae	8115	Trichocerca	1001946	Trichocerca similis	1002086	2011-08	1kmE4955N3318	1	1	1	2678400	10.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Brachionidae	3880	Kellicottia	1002568	Kellicottia longispina	1002569	2012-05	1kmE4692N3116	1	1	1	86400	1000.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Brachionidae	3880	Keratella	1002582	Keratella quadrata	1002648	2010-08	1kmE4909N3535	1	1	1	86400	1000.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Brachionidae	3880	Keratella	1002582	Keratella quadrata	1002648	2004-04	1kmE4944N3524	1	1	1	86400	1000.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Synchaetidae	3887	Synchaeta	1003145	Synchaeta fennica	1003148	2008-08	1kmE4765N3590	1	1	1	86400	1000.0
    Animalia	1	Rotifera	91	Eurotatoria	307	Ploima	1235	Synchaetidae	3887	Synchaeta	1003145	Synchaeta pectinata	1003169	2011-05	1kmE4920N3191	2	1	1	2678400	10.0
    Animalia	1	Arthropoda	54	Ostracoda	353	Podocopida	1438	Cyprididae	9259	Eucypris	1029198	Eucypris virens	1029200	2001-06	1kmE4813N3271	9	9	9	86400	1000.0
    Animalia	1	Arthropoda	54	Insecta	216	Mecoptera	1000	Panorpidae	7925	Panorpa	1031814	Panorpa communis	5742495	2023-06	1kmE4976N3237	2	2	2	1	7.0
    Animalia	1	Arthropoda	54	Insecta	216	Mecoptera	1000	Panorpidae	7925	Panorpa	1031814	Panorpa communis	5742495	2021-05	1kmE5148N3216	1	1	1	60	15.0
    Animalia	1	Arthropoda	54	Insecta	216	Mecoptera	1000	Panorpidae	7925	Panorpa	1031814	Panorpa communis	5742495	2023-07	1kmE5193N3200	1	1	1	1	27.0
    Animalia	1	Arthropoda	54	Insecta	216	Psocodea	7612838	Pediculidae	7930	Pediculus	1031922	Pediculus humanus	4987991	2022-06	1kmE5240N3179	1	1	1	60	1534.0
    Animalia	1	Arthropoda	54	Insecta	216	Coleoptera	1470	Hydrochidae	4734	Hydrochus	1033653	Hydrochus elongatus	5745443	2002-06	1kmE5166N3022	1	1	1	86400	1000.0
    Animalia	1	Arthropoda	54	Insecta	216	Coleoptera	1470	Hydrophilidae	7830	Cryptopleurum	1034240	Cryptopleurum minutum	1034242	2012-05	1kmE4984N2979	8	3	3	950400	1000.0
    Animalia	1	Arthropoda	54	Insecta	216	Coleoptera	1470	Hydrophilidae	7830	Cryptopleurum	1034240	Cryptopleurum minutum	1034242	2013-05	1kmE5041N2957	7	1	1	86400	1000.0
    Animalia	1	Arthropoda	54	Insecta	216	Coleoptera	1470	Hydrophilidae	7830	Cercyon	1034418	Cercyon impressus	1034479	2013-05	1kmE5217N2980	1	1	1	86400	1000.0
    ```

See the **software** and **tutorials** on this website for ways to explore and process the data. The steps describe above can also be repeated programmatically, using the [GBIF SQL download API](/software/gbif-api/).

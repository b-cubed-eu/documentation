---
title: How to build a species occurrence cube based on a GBIF checklist
description: >
  This document shows how to generate occurrence cubes for taxa listed in GBIF checklists.
citation: >
  Oldoni D (2024). How to build a species occurrence cube based on a GBIF checklist. <https://docs.b-cubed.eu/cube-from-checklist/>
permalink: /cube-from-checklist/
---


## Introduction

At the moment there is no automatic way of automatically downloading occurrences or creating an occurrence cube for the taxa listed in a GBIF checklist. In this page we will show how to build an occurrence cube starting from a GBIF checklist. We will do it by explaining the main steps, first, followed by some instructive examples. 

The main steps are:
1. Get taxa from checklists and match to GBIF Backbone
2. Adapt the SQL query, e.g. by specifying the spatial extension or adapting filters
3. Trigger occurrence cube download(s)
4. Post-processing

## Step 1: Get taxa from checklists and match to GBIF Backbone

A GBIF checklist is a list of "names". GBIF tries to link those names to the GBIF Backbone. That's the way we can link "names" to occurrences worldwide. A 100% taxon match is possible, although not likely.

Examples of GBIF checklists with perfect match af the moment of writing:
- The [Red list of dragonflies in Flanders, Belgium](https://www.gbif.org/dataset/72aa797d-42a4-4176-9e19-5b3ddd551b79)
- The [List of Invasive Alien Species of Union concern](https://www.gbif.org/dataset/79d65658-526c-4c78-9d24-1870d67f8439)

We submitted a feature request ([#746](https://github.com/ropensci/rgbif/issues/746)) to add a function to [rgbif](https://docs.ropensci.org/rgbif/index.html) R package to retrieve the taxa from the GBIF backbone matching the taxa of a checklist. At the moment, such functionality is on hold. We will probably add this functionality to a stand alone R package.

Meanwhile, you can find the code in a [gist](https://gist.github.com/damianooldoni/104d6f30cc0755c8fcd2298d432f7c3b): <script src="https://gist.github.com/damianooldoni/104d6f30cc0755c8fcd2298d432f7c3b.js"></script>

It's extremely unlikely to have occurrences linked to a taxon not matched to GBIF Backbone. Most likely this occurs when both the checklist and the occurrence dataset are published by the same researchers.

The code in the [gist](https://gist.github.com/damianooldoni/104d6f30cc0755c8fcd2298d432f7c3b) allows you to get automatically all **accepted taxa** by using `name_backbone_gbif_checklist(datasetKey = your_dataset_key, allow_synonyms = FALSE)`.


## Step 2: Adapt the SQL query

### Spatial dimension

Typically the spatial constraints are defined by:

- continent (`continent`):
```sql
SELECT ...
FROM ...
WHERE
  continent = 'EUROPE'
```

- country (`countryCode`):

```sql
SELECT ...
FROM ...
WHERE
  countryCode = 'BE'
```

- administrative region (see [GADM](https://gadm.org/) database):

```sql
SELECT ...
FROM ...
WHERE
  level1gid = 'BEL.2_1' -- Flanders region (Vlaanderen)
```

See json query, [`/examples/other_examples/gdam_id_vlaanderen.json`](assets/documents/gdam_id_vlaanderen.json) and the resulting cube to [download](https://doi.org/10.15468/dl.8ckvqu). Notice that for provinces, the right GBIF term will be `level2gid`, for example `level2gid = 'BEL.2.5_1'` for West-Flanders. Maybe useful to know that you can download data for each country at each administrative level via https://gadm.org/download_country.html.

- by polygon:

```sql
SELECT ...
FROM ...
WHERE
   GBIF_Within('POLYGON ((3.959198 51.056934, 3.886414 51.016347, 3.944092 50.976588, 4.000397 50.91429, 4.159698 50.929007, 4.128113 51.031895, 4.096527 51.074194, 3.959198 51.056934))')
```

The polygon must be written using the [WKT standard](https://en.wikipedia.org/wiki/Well-known_text_representation_of_geometry) and so it needs to be written in an anticlockwise order. See [`/examples/other_examples/polygon.json`](assets/documents/polygon.json) for the full SQL query. See also the resulting occurrence cube: https://doi.org/10.15468/dl.7vh5y7. The polygon has been created using geopick: https://geopick.gbif.org/?locationid=geopick-v2.1.0-2024-09-04T13-00-23.219Z-132.


### Quality filters

In the [GBIF occurrence cube example](https://techdocs.gbif.org/en/data-use/data-cubes#write-full-query), a standard spatial coordinates quality filter is applied:

```sql
SELECT ...
FROM ...
WHERE
  ...
  AND NOT ARRAY_CONTAINS(issue, 'ZERO_COORDINATE')
  AND NOT ARRAY_CONTAINS(issue, 'COORDINATE_OUT_OF_RANGE')
  AND NOT ARRAY_CONTAINS(issue, 'COORDINATE_INVALID')
  AND NOT ARRAY_CONTAINS(issue, 'COUNTRY_COORDINATE_MISMATCH')
  ...
```

Sometimes, it's worth to add other quality filters related to other aspects, for example taxonomic identification (`identificationVerificationStatus`) to filter out unverified occurrences like this one, https://www.gbif.org/occurrence/4519610580, which is `unverified`.

```sql
SELECT ...
FROM ...
WHERE
  ...
    AND (
      LOWER(identificationVerificationStatus) NOT IN (
        'unverified',
        'unvalidated',
        'not validated',
        'under validation',
        'not able to validate',
        'control could not be conclusive due to insufficient knowledge',
        'uncertain',
        'unconfirmed',
        'unconfirmed - not reviewed',
        'validation requested'
        )
      OR identificationVerificationStatus IS NULL
    )
...
```


Check the differences by comparing these two json query examples triggering two species occurrence cubes for observations of muskrat (genus _Ondatra_, `genusKey` = `5219857`) taken in 2024 and published in dataset [waarnemingen.be](https://www.gbif.org/dataset/9a0b66df-7535-4f28-9f4e-5bc11b8b096c) (`datasetKey` = `9a0b66df-7535-4f28-9f4e-5bc11b8b096c`). The first, [`muskrat_waarnemingen_be_2024.json`](assets/documents/muskrat_waarnemingen_be_2024.json), contains no filtering at identification/verification level (see resulting occurrence cube: https://doi.org/10.15468/dl.8fydcb), while [`muskrat_waarnemingen_be_2024_verified.json`](assets/documents/muskrat_waarnemingen_be_2024_verified.json) applies the filtering shown in chunk above (see resulting occurrence cube: https://doi.org/10.15468/dl.2terux).

The problem of such screening is that `identificationVerificationStatus` is a free field and there is no way to know which values are present in advance. In other words, you cannot screen via neither GBIF website, neither via rgbif facetting. The next rgbif commando in R will not work, as `identificationVerificationStatus` is not a valid facet:

```r
> occ_count(genusKey = 5219857, country = "BE", year = "2024", occurrenceStatus = "PRESENT", facet='identificationVerificationStatus')
Error in occ_count(genusKey = 5219857, country = "BE", year = "2024",  : 
  Bad facet arg.
```

The only way is triggering an occurrence download and going through all the possible values of the `identificationVerificationStatus` field. If your goal is creating a cube based on a huge amount of occurrences, screening them is not trivial. Discarding the values listed in the SQL chunk above can be in many cases a good-enough filter.


## Trigger occurrence cube download(s)

This step can be very easy or quite complex, depending on the taxa in the checklists. There are three factors to be considered: taxon match, taxonomic status (accepted, synonym) and taxonomic rank.

1. A taxon in the checklist has **no match** with the GBIF Backbone: it is very unlikely to have occurrences linked to them, see Section "Get taxa from checklists and match to GBIF Backbone" above. Most of the time a match can be found by adding/improving the authorship of the scientific names.
2. The matched taxon is a **synonym** (`taxonomicStatus`: `HETEROTYPIC_SYNONYM`, `HOMOTYPIC_SYNONYM`, `PROPARTE_SYNONYM`, `SYNONYM`): searching occurrences of a synonym will result in less occurrences than the accepted. Only use the taxon key of the synonym if you have strong doubts about the match proposed by the GBIF Backbone. In this case, the SQL query for that specific taxon will look like this:

```sql
WHERE
  taxonKey = your_taxon_key
  ...
GROUP BY
  ...
  taxonKey,
  scientificName -- eventually `canonicalName`
```
3. The matched taxon has an **higher taxonomic rank** than species, e.g. genus. You have two options depending on your needs. Either you group occurrences by species as typically done or you filter and group occurrences by the given rank. The two queries will look like this:

```sql
...
WHERE
  speciesKey IN (your_species_keys) OR genusKey = your_genus_key
  ...
GROUP BY
  ...
  speciesKey,
  species
```

```sql
...
WHERE
  genusKey = your_genus_key
  ...
GROUP BY
  ...
  genusKey,
  genus
```

4. The matched taxon has a **lower taxonomic rank** than species (subspecies, variety, form). We need to work at `taxonKey` level. The SQL query will look like this:
```sql
WHERE
  taxonKey = your_taxon_key
  ...
GROUP BY
  ...
  taxonKey,
  scientificName
```

## Examples

Nothing better than showing some examples using checklists with increasing level of complexity.

- The checklist matches 100% to **accepted species**. You are lucky, as it doesn't happen so often! Example: [Digital Catalogue of Biodiversity of Poland — Animalia: Arthropoda: Hexapoda: Insecta: Strepsiptera](https://www.gbif.org/dataset/bcdbb4e2-b9eb-448d-9467-733e744f2b9a).
- The checklist matches almost 100% to **accepted species**. Example: [Digital Catalogue of Biodiversity of Poland — Animalia: Bryozoa](https://www.gbif.org/dataset/54448929-97ad-4e8b-8c12-26c2de5006e5).
- The checklist matches 100%. Some returned taxa are **synonyms** of **accepted species**. Example: [Red list of dragonflies in Flanders, Belgium](https://www.gbif.org/dataset/72aa797d-42a4-4176-9e19-5b3ddd551b79).
- The checklist matches 100% to a mix of accepted species, accepted subspecies and synonym subspecies. Example: [Checklist of alien mammals of Belgium](https://www.gbif.org/dataset/9a52d8bf-864a-4abb-95ba-319c4edfca8d).
- The checklist matches 100% to a mix of accepted and synonym species, accepted genera and families, accepted and synonym subspecies, forms, varieties. I don't think you will encounter something more complex than this. Example: [Global Register of Introduced and Invasive Species - Belgium](https://www.gbif.org/dataset/6d9e952f-948c-4483-9807-575348147c7e).


In the next examples we will always:
- Group by year
- Randomize the point using the `coordinateUncertaintyInMeters`, default to 1000m, as shown in [GBIF cube SQL full query](https://techdocs.gbif.org/en/data-use/data-cubes#write-full-query)
- Apply a sampling bias expression at class level (`class` and `classKey` as partitions)
- Do a cube for continent Europe
- Apply a basic filter to exclude unverified occurrences and occurrences with coordinates issues

###  Example 1: Digital Catalogue of Biodiversity of Poland — Insecta: Strepsiptera

[Digital Catalogue of Biodiversity of Poland — Animalia: Arthropoda: Hexapoda: Insecta: Strepsiptera](https://www.gbif.org/dataset/bcdbb4e2-b9eb-448d-9467-733e744f2b9a) has 7 records at the time of writing and 100% taxon match. The matched taxa of the GBIF Backbone are also species. So, you can use `speciesKey`  as you are familiar with.

In SQL term, it means:

```sql
...
WHERE
  ...
  AND speciesKey IN (4480653, 4480642, 4480637, 4480628, 4480626, 4480624, 9719065)
  ...
```

See [`digital_cat_biodiversity_poland_strepsiptera.json`](assets/documents/digital_cat_biodiversity_poland_strepsiptera.json) for the full SQL query. See also the returned species occurrence cube: https://doi.org/10.15468/dl.hsj57z.

### Example 2: Digital Catalogue of Biodiversity of Poland — Animalia: Bryozoa

The checklist [Digital Catalogue of Biodiversity of Poland — Animalia: Bryozoa](https://www.gbif.org/dataset/54448929-97ad-4e8b-8c12-26c2de5006e5) has no 100% match: 18 out of 19 taxa have a match at the time of writing. The matched taxa are all species. So, the SQL query is similar to the previous one:

```sql
...
WHERE
  ...
  AND speciesKey IN (
    1003567,
    1003574,
    1003642,
    1003614,
    1003625,
    1003588,
    1003611,
    10329226,
    4559524,
    1010304,
    7552441,
    4985433,
    1010587,
    1008388,
    1007770,
    4984866,
    1006399,
    4984953)
  ...
```

See [`digital_cat_biodiversity_poland_bryozoa.json`](assets/documents/digital_cat_biodiversity_poland_bryozoa.json) for the full SQL query. See also the returned species occurrence cube: https://doi.org/10.15468/dl.ad7r3u.


### Example 3: Red list of dragonflies in Flanders, Belgium

The checklist [Red list of dragonflies in Flanders, Belgium](https://www.gbif.org/dataset/72aa797d-42a4-4176-9e19-5b3ddd551b79) matches 100% the GBIF Backbone. There are 64 accepted species, and 2 synonyms at the moment of writing. The two synonyms (`taxonKey`: [`5051950`](https://www.gbif.org/species/5051950), [`1425042`](https://www.gbif.org/species/1425042)) link to two accepted species (`speciesKey`: [5051901](https://www.gbif.org/species/5051901), [5791733](https://www.gbif.org/species/5791733)), so if you trust the GBIF Backbone, you can run a query at species level using the 66 acepted species:

```sql
...
WHERE 
  ...
  AND speciesKey IN (
    1425203, 1425240, 1425264, 4513948, 1425221, 1425177, 1425166, 5051775,
    5051752, 1425146, 5791733, 1427067, 1427037, 1423259, 1422001, 1422025, 
    1422012, 1421964, 1421980, 1422010, 5051273, 1423027, 1423018, 1423011,
    1423395, 1423317, 1423114, 1423540, 7936251, 1429717, 1430083, 7951391,
    1429997, 1429969, 1430023, 5051901, 5051947, 5051951, 1426293, 5865098,
    1424076, 1424045, 1424038, 1424067, 1424207, 1427721, 1429178, 1429207,
    1429194, 1429173, 1427883, 1427936, 1427915, 1428715, 1428686, 1428583,
    1428334, 1428235, 1428248, 5791800, 1428308, 1428280, 1428217, 1428345,
    1428311, 1423859
  )
  ...
```

See [`red_list_dragonflies_in_flanders.json`](assets/documents/red_list_dragonflies_in_flanders.json) for the full SQL query. See also the returned species occurrence cube: https://doi.org/10.15468/dl.txa67z.

What if you don't trust the link synonyms - accepted taxa? Then you have to run two separate SQL queries resulting in two occurrence cubes: 
- SQL query for the accepted species at species key level: [`red_list_dragonflies_in_flanders_only_accepted_species.json`](assets/documents/red_list_dragonflies_in_flanders_only_accepted_species.json). Occurrence cube: https://doi.org/10.15468/dl.f98tza.
- SQL query for the synonyms only at taxon key level: [`red_list_dragonflies_in_flanders_only_synonyms_species.json`](assets/documents/red_list_dragonflies_in_flanders_only_synonyms_species.json). Occurrence cube: https://doi.org/10.15468/dl.ppa8zm.

It's up to the user to merge the two occurrence cubes at a second stage. Still, notice that the taxonomy related column names are different: `species` and `specieskey` versus `taxonkey` and `scientificname`. Maybe worth a renaming. You can use for example `taxonkey` and `scientificname` for both the cubes.

**IMPORTANT**: even if `taxonKey` is equal to `speciesKey` for accepted species, using taxonKey in `WHERE` filter, e.g.

 ```sql
WHERE
  ...
  taxonKey IN ( 5051901 )
  ...
 ```

 will exclude occurrences of synonyms! This is an important difference with the standard occurrence API, where occurrences of synonyms are still returned. Example: https://www.gbif.org/occurrence/search?taxon_key=5051901 returns also occurrences of synonym _Gomphus flavipes (Charpentier, 1825)_ (`taxonKey`: [5051950](https://www.gbif.org/species/5051950)). See correspondent occurrence download: https://doi.org/10.15468/dl.j76qvd. So, **use `speciesKey` whenever possible**.


### Example 4: Checklist of alien mammals of Belgium

The [Checklist of alien mammals of Belgium](https://www.gbif.org/dataset/9a52d8bf-864a-4abb-95ba-319c4edfca8d) matches 100% the GBIF Backbone. It contains 34 accepted species, one accepted subspecies and one synonym of a subspecies. As we did for synonyms of species, we have first to decide whether we trust the link between the [synonym](https://www.gbif.org/species/9457305) and [accepted taxon](https://www.gbif.org/species/6165157). But in this case, even if we trust the link we need to run a SQL query at taxon key level (`taxonKey`) as the accepted taxa are also subspecies. We removed also `speciesKey IS NOT NULL` from the `WHERE` statement (filter) as it is redundant: subspecies have a `speciesKey` and even if they would not have it, it's not an issue as we are not grouping occurrences at species level for those 2 subspecies. See [`alien_mammals_in_flanders_only_accepted_subspecies.json`](assets/documents/alien_mammals_in_flanders_only_accepted_subspecies.json) for the full SQL query of the two (accepted) subspecies: `taxonKey IN (6165157, 5218913)`. See also the returned occurrence cube: https://doi.org/10.15468/dl.wr6ts4. The SQL query for the accepted species is similar to the ones done before. See [`alien_mammals_in_flanders_only_accepted_species.json`](assets/documents/alien_mammals_in_flanders_only_accepted_species.json) for the full SQL query. See also the resulting species occurrence cube: https://doi.org/10.15468/dl.d6awvf.


### Example 5: Global Register of Introduced and Invasive Species - Belgium

The [Global Register of Introduced and Invasive Species - Belgium](https://www.gbif.org/dataset/6d9e952f-948c-4483-9807-575348147c7e) matches 100% the GBIF Backbone and it is quite complex taxonomically speaking. Still, the previous examples already cover most of the situations we find in this checklist. We know how to deal with subspecies and synonyms of both species and subspecies. Notice that what we wrote about subspecies holds true also for other ranks lower than species, e.g. form and variety. We trust the links synonyms-accepted taxa too. We can therefore retrieve the final list of accepted taxa using `name_backbone_gbif_checklist(datasetKey = "6d9e952f-948c-4483-9807-575348147c7e", allow_synonyms = FALSE)` as shown before. In this checklist we found a new taxonomicStatus value: `DOUBTFUL`. Taxa with `taxonomicStatus` = `DOUBTFUL` can be treated as accepted taxa in our workflow. It is also clear we need to generate several occurrence cubes to cover the taxonomy of the entire checklist:

- Generate a species occurrence cube for all 3670 species. The resulting SQL query is quite long as there is a list with 3670 numbers in `WHERE` statement: `speciesKey IN (...)`. See [`griis_belgium_species.json`](assets/documents/griis_belgium_species.json) for the full SQL query. See also the resulting species occurrence cube: https://doi.org/10.15468/dl.vyyrs3.
- Generate an occurrence cube for the 192 taxa with rank lower than species: subspecies, form, variety. See [`griis_belgium_subspecies_form_variety.json`](assets/documents/griis_belgium_subspecies_form_variety.json) for the full SQL query. See also the resulting occurrence cube: https://doi.org/10.15468/dl.8na5s2.
- Generate an occurrence cube for the 29 genera (rank: genus). The SQL query is similar to the one for species: just replace `species` with `genus` and `speciesKey` with `genusKey`. See [`griis_belgium_genus.json`](assets/documents/griis_belgium_genus.json) for the full SQL query. See also the resulting occurrence cube: https://doi.org/10.15468/dl.4btuga.
- Generate an occurrence cube for the  families (rank: family). The SQL query is similar to the one for species: just replace `species` with `family` and `speciesKey` with `familyKey`. See [`griis_belgium_family.json`](assets/documents/griis_belgium_family.json) for the full SQL query. See also the resulting occurrence cube: https://doi.org/10.15468/dl.2fjd4x.


Do not forget to rename the taxonomic related columns before merging the cubes. Again, we suggest to use `taxonkey` and `scientificname` as column names for the key column (`specieskey`, `genuskey`, `familykey`, `taxonkey`) and the name column (`species`, `genus`, `family`, `scientificname`) respectively.

I will be happy to hear users feedback. Was this tutorial helpful? Something you would like to improve? Create an [issue](https://github.com/b-cubed-eu/documentation/issues) on GitHub or [contact](mailto:damiano.oldoni@inbo.be) me. Happy cubing! 📦

---
title: Guidelines for reliable indicator and trend calculations from occurrence cubes
sidebar:
  label: Data quality
  order: 6
---

:::tip[Read more]
This guide is based on a deliverable report. For full details and analyses, consult the [original report](https://b-cubed.eu/storage/app/uploads/public/69a/943/ea1/69a943ea17e66799908588.pdf).
:::

This guide provides practical guidance for assessing the reliability of species status and trend estimates derived from aggregated occurrence cubes from the Global Biodiversity Information Facility (GBIF), building on a comparative analysis between occurrence cubes from unstructured GBIF data and structured monitoring datasets from Flanders (Belgium) and the Western Cape (South Africa). The aim of that analysis was to determine under which conditions, such as sampling effort, taxonomic consistency, spatial precision, and detectability, indicators can be considered sufficiently robust for reporting and policy use.

## How to cite

If you use this guide, please cite the deliverable report from which it was derived:

> Langeraert W, Faulkner K, Cartuyvels E, Groom Q, Van Daele T (2026) Report on the criteria for data quality and species characteristics for estimating species status and trends. B3 project deliverable D4.3. <https://b-cubed.eu/storage/app/uploads/public/69a/943/ea1/69a943ea17e66799908588.pdf>

## Evidence base and scope

### Evidence and validation approach

This guidance is grounded in a comparative assessment of indicators derived from occurrence cubes from unstructured GBIF data ("unstructured occurrence cubes") and indicators derived from structured bird monitoring schemes in Flanders (Belgium) and the Western Cape (South Africa). Rather than assuming that large data volumes automatically produce reliable indicators, the analysis explicitly tested when and under which conditions cube-based estimates align with structured monitoring results.

The results show that unstructured occurrence cubes require careful quality control and explicit assessment of biases and uncertainty.

### Biases, uncertainty, and practical implications

Several recurring issues directly affect the reliability of indicators derived from unstructured occurrence cubes:

* **Spatial uncertainty**, where large coordinate uncertainty can blur or distort spatial patterns.
* **Taxonomic inconsistencies**, including unresolved or unlinked names that inflate species counts or introduce artificial turnover.
* **Publication delays**, which can create apparent declines or recent breaks in temporal trends.
* **Dataset dominance**, where a small number of contributing datasets disproportionately influence results.

The deliverable report emphasizes the importance of explicitly quantifying three complementary aspects of observation: **survey effort**, **survey completeness**, and **species detectability**. Survey effort captures the volume, temporal replication, seasonal coverage, and taxonomic breadth of observations, summarised in a component-based survey-effort score. Survey completeness probabilistically estimates the proportion of the local species pool likely observed given the survey effort, with uncertainty quantified via bootstrap resampling. Species detectability metrics measure the likelihood that a given species is recorded on a survey day, conditional on confirmed presence, helping to distinguish genuine ecological patterns from biases introduced by observation practices, technology, or observer behaviour. Together, these diagnostics ensure that cube-based indicators reflect real biodiversity patterns rather than artefacts of the observation process.

Taken together, these findings lead to several practical implications for analysts:

* Large data volumes do not guarantee reliable indicators: explicit quality control and bias assessment is essential.
* Survey effort, survey completeness, and species detectability should be quantified and, where possible, incorporated into analyses.
* Coarser spatial resolutions and longer temporal aggregations generally improve robustness when using heterogeneous occurrence data.
* Indicators derived from cubes may be sensitive to dominant component datasets and should be tested for such dependence.
* Technical issues such as spatial uncertainty, taxonomic harmonisation, and publication delay should be evaluated before interpretation.

### Software support for occurrence cubes

Several tools developed within the B3 project support working with occurrence cubes in practice. The [**gcube**](https://docs.b-cubed.eu/software/gcube/readme/) R package allows simulation of multi-species occurrence cubes, including variation in sampling processes, detection probability, and spatial uncertainty, enabling exploration of indicator sensitivity under controlled scenarios. The [**dubicube**](https://docs.b-cubed.eu/software/dubicube/readme/) R package provides diagnostics for examining the structure, quality, and uncertainty of empirical occurrence cubes, translating insights from the deliverable into practical checks for applied analyses.

## Quality and reliability guidance for occurrence cubes

### Cube preparation and baseline data filtering

This first step defines the analytical boundaries and removes technically invalid records. It establishes the spatial, temporal, and biological scope within which indicators will be calculated.

1. Explicitly **define the spatial and temporal scope of the analysis** before generating occurrence cubes, including grid resolution, geographic extent, and intended indicator type (spatial vs. temporal).

2. Apply **baseline data quality filters** in the SQL query to remove obvious technical errors and unsuitable records:

```sql
occurrenceStatus = 'PRESENT'
AND NOT occurrence.basisofrecord IN ('FOSSIL_SPECIMEN', 'LIVING_SPECIMEN')
AND NOT ARRAY_CONTAINS(issue, 'ZERO_COORDINATE')
AND NOT ARRAY_CONTAINS(issue, 'COORDINATE_OUT_OF_RANGE')
AND NOT ARRAY_CONTAINS(issue, 'COORDINATE_INVALID')
AND NOT ARRAY_CONTAINS(issue, 'COUNTRY_COORDINATE_MISMATCH')
AND speciesKey IS NOT NULL
AND decimalLatitude IS NOT NULL
AND decimalLongitude IS NOT NULL
```

### Exploratory assessment of data coverage and structure

This step is descriptive and diagnostic. Its purpose is to understand how the data are distributed and structured before defining analytical constraints or exclusion rules.

1. Examine the **spatial distribution** within the occurrence cube to ensure the study area is well covered and that data density is sufficient for the chosen grid resolution.

2. Summarise **coordinate uncertainty** to quantify the proportion of missing or large uncertainties.

3. Inspect the **temporal distribution** within the occurrence cube to identify gaps, irregularities, or strong drop-offs in recent years.

4. Perform **basic taxonomic checks**, including counts of species, identification of unlinked accepted names, and detection of unexpected or implausible occurrences that may indicate misidentifications or taxonomic inconsistencies.

5. Inspect the **contribution of individual datasets.** Assess how many datasets contribute to the occurrence cube and how uneven their contributions are in terms of observations and species coverage. Strong dominance by a few datasets is common and should be expected.

6. **Group-level sensitivity analyses** can help to explore how indicator values respond to the inclusion or exclusion of predefined groups (e.g. datasets, species, spatial units, or time periods). Such analyses are useful for identifying influential components, understanding structural properties of indicators, and distinguishing methodological effects from patterns that may otherwise be interpreted as ecological signals. Sensitivity analysis supports more informed interpretation of indicator results when working with heterogeneous occurrence data.

### Operational quality criteria and documentation

This step translates the study design and diagnostic findings into explicit, reproducible analytical rules. It defines what data are considered suitable for indicator calculation at the chosen resolution and how decisions are documented.

1. **Define coordinate uncertainty thresholds consistent with the spatial scale and indicator purpose**. For spatial indicators, exclude records with coordinate uncertainty exceeding the grid resolution and treat records with missing uncertainty conservatively. For temporal indicators covering broad areas, prioritise data completeness while documenting potential spatial imprecision.

2. **Define temporal inclusion criteria, including cut-off years where necessary**, particularly for recent years. Publication delays can lead to incomplete data for the most recent periods, and apparent declines or anomalies in temporal trends should not be interpreted without first confirming data completeness.

3. **Apply taxonomic harmonisation procedures where required**, including unlinked accepted names, incorrect taxonomic mappings during data publication, and potential species misidentifications. Such issues can result in artificial species duplication, missing species, or implausible occurrences outside known distributions, and may require local harmonisation or reporting issues to GBIF.

4. Where exploratory **sensitivity analyses reveal strong dependence** on specific datasets, taxa, spatial units, or time periods, explicitly define and implement alternative subsets (e.g. excluding dominant datasets or specific taxonomic groups), recalculate the indicator under these conditions, and quantify how results differ from the main analysis.

5. **Document all filtering, harmonisation, and data-quality decisions transparently**, including uncertainty thresholds, temporal cut-off dates, taxonomic corrections, and any dataset-level decisions to ensure reproducibility and transparency.

### Examples

Below are examples from the SQL query to obtain the unstructured occurrence cube used in the spatial analysis of bird data for the Western Cape of South Africa. The query followed the recommendations above.

1. Data used covers 2015-2023 for an analysis performed in 2025\.

```sql
AND \"year\" >= 2015 
AND \"year\" <= 2023
```

2. The analysis was performed at the quarter-degree grid cell resolution, and thus occurrences with an coordinate uncertainty \> 27 000 m (27 km) have been filtered out.

```sql
AND (coordinateUncertaintyInMeters <= 27000 OR coordinateUncertaintyInMeters IS NULL)
```

3. Unknown coordinate uncertainties have been set to 27 000 m (the length of the edge of the grid cells).  
   
```sql
COALESCE(coordinateUncertaintyInMeters, 27000)) 
```

4. Coordinates have been randomly assigned to grid cells within their uncertainty.  

```sql
MIN(COALESCE(coordinateUncertaintyInMeters, 27000)) AS minCoordinateUncertaintyInMeters
```

5. Suggested data quality filters have been implemented.

```sql
AND occurrenceStatus = 'PRESENT'
AND NOT occurrence.basisofrecord IN ('FOSSIL_SPECIMEN', 'LIVING_SPECIMEN') 
AND NOT ARRAY_CONTAINS(issue, 'ZERO_COORDINATE') 
AND NOT ARRAY_CONTAINS(issue, 'COORDINATE_OUT_OF_RANGE') 
AND NOT ARRAY_CONTAINS(issue, 'COORDINATE_INVALID') 
AND NOT ARRAY_CONTAINS(issue, 'COUNTRY_COORDINATE_MISMATCH') 
AND speciesKey IS NOT NULL 
AND decimalLatitude IS NOT NULL 
AND decimalLongitude IS NOT NULL
```

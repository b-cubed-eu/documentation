---
title: Background
output: rmarkdown::html_vignette
vignette: '%\VignetteIndexEntry{Background} %\VignetteEngine{knitr::rmarkdown} %\VignetteEncoding{UTF-8}'
lastUpdated: 2025-07-09
sidebar:
  label: Background
  order: 2
source: https://github.com/b-cubed-eu/impIndicator/blob/main/vignettes/Background.Rmd
---



# Introduction
*Extracted from the report of Indicators on Impact of Alien Taxa, B3 project deliverable. 5.3*. To read full report visit (https://b-cubed.eu/library)

The negative impact of alien species is one of the leading causes of biodiversity loss  [1]. A challenge to the appropriate management of such impact is the lack of sufficient evidence-based indicators for the impact caused by alien species that satisfy Findable, Accessible, Interoperable, and Reusable (FAIR) principles of data [2]. As there is growing information on distributions (GBIF, 2025), and standard assessments of the impact caused by alien species across different native ecosystems become available [e.g., 3–6] ,there is room for a standard method to infer the impact of alien species as indicators from the combination of their occurrences and impact assessment. In terms of policy, the indicator will allow for the prioritisation of key species and sites, tracking the response of controls, and forecasting the impact under possible future scenarios [7].

Various indicators have been proposed to be used to track invasions over time (Vicente et al., 2022; Wilson et al., 2018). Indicators focussing on the occurrence of the alien species include the cumulative number of established alien species (Henriksen et al., 2024) and the relative abundance of alien species [8,9]. While indicators based on species occurrence provide trends of invasion generally, they do not necessarily depict the trend of the impact on the ecosystem. Also, they do not capture the variability of the magnitude of the impact caused by the alien species. This occurrence-based indicator can be advanced by incorporating impact variability between species to account for these limitations.

The Red List Index (RLI) of alien species is an impact indicator that uses the change in extinction risk of native species caused by alien species as evidence of impact on the ecosystem [10–12]. The RLI is based on the IUCN Red List of Threatened Species which categorises species into a status between the range of Least Concern to Extinct. Changes in Red List categories can be attributed to factors such as alien species. Because of this, these changes can serve as a useful proxy for gauging the magnitude of alien species’ impacts on native biodiversity [12]. Although the RLI reflects variation in how alien species affect native species, it does not fully capture the specific magnitude of impacts or the mechanisms by which alien species exert those impacts on the broader ecosystem. These species’ impact magnitude and mechanisms coupled with alien species distribution can provide a better representation of alien species impact on the recipient ecosystem. Moreover, the RLI is not an evidence based classification and relies heavily on expert opinion, which makes comparison across timescales difficult.

The Environmental Impact Classification for Alien Taxa (EICAT), recently adopted by the IUCN, offers information about the impact of alien species and mechanisms thereof [13]. Alien species are categorised from Minimal to Massive levels of concern, depending on the magnitude of impact reported on native species [14,15]. Combining the impact of alien species and their occurrence can give the representation of the alien species in a particular region [16]. The combination of data on impacts and occurrences has been proposed as an indicator of the impact of invasions [9], but there has been no standardised methodology to achieve this in practice.  Recent research has seen significant practical developments to address this shortcoming. For example, [7] used EICAT and species distribution to map the impact of Acacia species in South Africa. The authors transformed the EICAT categories into numerical values and computed the impact score for each site. Building on their approach, we now derive species-specific impact values over time to produce more refined impact indicators. In doing so, we expand the methods of [7] and [17] by integrating open-source EICAT assessments and species occurrence data, making the impact indicators taxonomically, spatially, and temporally explicit. As part of the B3 project (https://b-cubed.eu/), we developed a workflow to calculate the impact indicator which visualises the impact of alien species over time and across space. The workflow is embedded in an R package following a standard software development guide [18]. The workflow produces three main products which include (i) a species impact indicator, (ii) a site impact indicator and (iii) an overall impact indicator.

# Method

## Ocurrences data

The workflow uses the Global Biodiversity Information Facility (GBIF) occurrence data (https://www.gbif.org/). GBIF is the largest database for biodiversity information that adheres to FAIR Data Principles and is the most widely used for scientific purposes, demonstrating its reliability. The workflow uses an occurrence cube - a data format which aggregates occurrences along spatial, taxonomical and temporal scale - suitable for modelling and computational analysis. The GBIF provides options for spatial resolution for aggregating occurrences, such as the European Environmental Agency (EEA) or the Extended Quarter Degree Grid Cells (QDGC) commonly employed in South African atlas projects. The downloaded GBIF occurrence cube is then processed using the b3gbi R package. This ensures standardised input data for further analysis and verifies that the data format is correct. Alternatively, an occurrence cube with customised site resolution and code can be built from GBIF occurrence data within the workflow. To correct for sampling bias, all computations convert multiple species occurrences at each site per year into binary presence (1) or absence (0) values. 

## Impact data

The workflow uses EICAT impact assessments which categorise the impact of an alien species into minimal concern (MC), minor (MN), moderate (MO), major (MR), or massive (MV) based on the severity of the species’ negative impact caused on the native species of the recipient community. Specifically, a species is assigned \
MC - if there is no reduction in the performance of individuals of a native species \
MN - if the performance of individuals is reduced, but there is no decrease in native species population size \
MO - if the native species’ population reduces \
MR - if impact led to species’ local extinction but naturally reversible \
MV - if impact led to naturally irreversible extirpation or extinction. \

The impacts are also classified based on the 12 mechanisms described by the IUCN which include competition, predation, hybridisation, transmission of disease, parasitism, poisoning/toxicity, bio-fouling or other direct physical disturbance, grazing/herbivory/browsing, chemical impact on ecosystem, physical impact on ecosystem, structural impact on ecosystem, indirect impact through interactions with other species. Additional information such as the location of the impact is also reported. 

The data collection process for EICAT assessments involves several key steps. First, raw impact records for the alien species are gathered through an established search protocol using scientific literature, databases, and other relevant sources. These impacts are then categorised according to EICAT criteria. Each assessment undergoes a rigorous review by the EICAT Authority, comprising experts from diverse taxonomic groups and geographic regions, to ensure accuracy and consistency. Once validated, assessments are published on the IUCN Global Invasive Species Database (GISD), making them accessible to scientists, conservation practitioners, and policymakers for prioritising management actions and developing preventive or mitigation measures (IUCN, 2020b). Currently, EICAT assessments in the GISD are not fully open or FAIR, although efforts to address this are underway (personal communication, P Genovesi). Available EICAT data can presently be downloaded from https://www.iucngisd.org/gisd/. For species lacking published assessments, users can independently conduct assessments within the workflow.

## Transforming EICAT impact categories to numerical values

The EICAT categories are semi-quantitative (ordinal) data which need to be transformed into numerical values to enable computation. The transformation depends on the assumptions of the relationship between the impact categories (e.g., linear) and the interpretation of the minimal concern (e.g., zero impact). The transformation \
- **MC = 0, MN = 1, MO = 2, MR = 3 and MV = 4** assumes the categories have a linear relationship and minimal impact implies zero impact since no impact was found on the native species (e.g., Hagen & Kumschick 2018).\
-	**MC = 1, MN = 2, MO = 3, MR = 4 and MV = 5** assumes a linear relationship with minimal concern implying some concern even if no impact was found on the native species’ individual (e.g., Jansen & Kumschick 2022).
-	**MC = 0, MN = 10, MO = 100, MR = 1000 and MV = 10000** assumes impact categories have an exponential relationship and minimal concern is equal to zero impact (e.g., Rumlerová et al., 2016). 

# Species impact indicator

Species are often reported to have multiple impact categories specific to different study locations and mechanisms through which they exert the impact. For example, Acacia dealbata has been categorised as MR in Drakensberg, South Africa through structural impact but MN in Biobio region, Chile (see dataset of Jansen & Kumschick 2022). To get an estimate of a likely impact category which could apply more broadly, we aggregate the multiple impact scores per species into one impact score per species. Aggregation methods include, overall maximum, sum across maximum mechanism and overall mean. Additional statistics will be included in future updates. \
-	maximum: The maximum method assigns a species the maximum impact across all records of the species (Blackburn et al., 2014; IUCN, 2020a; Kumschick et al., 2024). It is best for precautionary approaches. Also, the assumption is that the management of the highest impact can cover for the lower impact caused by a species and can be the best when there is low confidence in the multiple impacts of species of interest. However, the maximum method can overestimate the impact of a species especially when the highest impact requires specific or rare conditions and many lower impacts were recorded.\
-	sum across maximum mechanism: Assigns a species the summation of the maximum impact per mechanism (Nentwig et al., 2010). The assumption is that species with many mechanisms of impact have a higher potential to cause impact.\
-	mean: Assigns a species the mean impact of all the species impact. This method computes the expected impact of the species considering all species impact without differentiating between impacts (D’hondt et al., 2015). This method is adequate when there are many impact records per species.
Finally, to compensate for regions (spatial areas or ranges of occurrence data) with many sites (grid cells covering a region) having higher overall impact value, we divide the impact value of each by the number of sites occupied in the region.

# Site impact indicator 

Multiple alien species can co-occur in a site. To get information on how sites are affected by alien species (i.e. site impact), we aggregate the different impacts per species in each site using one of five methods proposed by Boulesnane-Genguant et al. (submitted). These methods are precautionary, precautionary cumulative, mean, mean cumulative, and cumulative which depend on the combinations of aggregation within species and across species.\
-	precautionary: This method uses the maximum method to aggregate each species’ impact and then compute the maximum impact across species in each site.\
-	precautionary cumulative: Uses the maximum method to aggregate each species’ impact and then compute the summation of all impacts in each site. The precautionary cumulative method provides the highest impact score possible for each species but considers the number of co-occurring species in each site.\
-	mean: Uses the mean method to aggregate each species’ impact and then computes the mean of all species in each site. The mean provides the expected impact within individual species and across all species in each site.\
-	mean cumulative: Uses the mean method to aggregate each species’ impact and then computes the summation of all impact scores in each site. The mean cumulative provides the expected impact score within individual species but adds co-occurring species’ impact scores in each site.\
-	cumulative: Uses the sum across maximum mechanism method to aggregate each species’ impact and then computes the summation of all species’ impacts per site. The cumulative method provides a comprehensive view of the overall impact while considering the impact and mechanisms of multiple species. 


# Overall impact indicator

Furthermore, to estimate the impacts of all the species in a study area, we sum the impact values of all the sites for each year. Also, to compensate for regions with many sites having higher overall impact value, we divide the impact value of each by the number of sites occupied in the region. 

$$I_i = \frac{\sum{S_i}}{N}$$\
- $I_i$ is impact score at year $i$.\
- $S_i$ is the sum of risk map value, where $S=\{s_1,s_2,\dots,s_n\}$ and $s_n$ is the site score for site $n$\
- $N$ is number of sites occupied through out the study years of the region.

## References

1. 	Bacher S, Galil B, Nunez M, Ansong M, Cassey P, Dehnen-Schmutz K, et al. Chapter 4. Impacts of invasive alien species on nature, nature’s contributions to people, and good quality of life. IPBES Invasive Alien Species Assessment. 2023;1–222. 
2. 	Vicente JR, Vaz AS, Roige M, Winter M, Lenzner B, Clarke DA, et al. Existing indicators do not adequately monitor progress toward meeting invasive alien species targets. Conservation Letters. 2022;15(5):e12918. 
3. 	Evans T, Kumschick S, Blackburn TM. Application of the Environmental Impact Classification for Alien Taxa (EICAT) to a global assessment of alien bird impacts. Diversity and Distributions. 2016;22(9):919–31. 
4. 	Canavan S, Kumschick S, Le Roux JJ, Richardson DM, Wilson JRU. Does origin determine environmental impacts? Not for bamboos. PLANTS, PEOPLE, PLANET. 2019;1(2):119–28. 
5. 	Volery L, Jatavallabhula D, Scillitani L, Bertolino S, Bacher S. Ranking alien species based on their risks of causing environmental impacts: A global assessment of alien ungulates. Global Change Biology. 2021;27(5):1003–16. 
6. 	Jansen C, Kumschick S. A global impact assessment of Acacia species introduced to South Africa. Biol Invasions. 2022 Jan 1;24(1):175–87. 
7. 	Kumschick S, Journiac L, Boulesnane-Genguant O, Botella C, Pouteau R, Rouget M. Mapping potential environmental impacts of alien species in the face of climate change. Biol Invasions. 2025 Jan;27(1):43. 
8. 	Delavaux CS, Crowther TW, Zohner CM, Robmann NM, Lauber T, Van den Hoogen J, et al. Native diversity buffers against severity of non-native tree invasions. Nature. 2023;621(7980):773–81. 
9. 	Wilson JRU, Faulkner KT, Rahlao SJ, Richardson DM, Zengeya TA, Van Wilgen BW. Indicators for monitoring biological invasions at a national level. Bellard C, editor. Journal of Applied Ecology. 2018 Nov;55(6):2612–20. 
10. 	Butchart SHM. Red List Indices to measure the sustainability of species use and impacts of invasive alien species. Bird Conservation International. 2008 Sep;18(S1):S245–62. 
11. 	Butchart SHM, Akçakaya HR, Chanson J, Baillie JEM, Collen B, Quader S, et al. Improvements to the Red List Index. PLOS ONE. 2007 Jan 3;2(1):e140. 
12. 	Rabitsch W, Genovesi P, Scalera R, Biała K, Josefsson M, Essl F. Developing and testing alien species indicators for Europe. Journal for Nature Conservation. 2016 Feb 1;29:89–96. 
13. 	IUCN. IUCN EICAT Categories and Criteria: The Environmental Impact Classification for Alien Taxa. IUCN Gland, Switzerland; 2020a. 
14. 	Blackburn TM, Essl F, Evans T, Hulme PE, Jeschke JM, Kühn I, et al. A Unified Classification of Alien Species Based on the Magnitude of their Environmental Impacts. PLOS Biology. 2014 May 6;12(5):e1001850. 
15. 	IUCN. Guidelines for using the IUCN Environmental Impact Classification for Alien Taxa (EICAT) Categories and Criteria. Version 1.1. IUCN Gland Switzerland, Cambridge, UK; 2020b. 
16. 	Latombe G, Pyšek P, Jeschke JM, Blackburn TM, Bacher S, Capinha C, et al. A vision for global monitoring of biological invasions. Biological Conservation. 2017 Sep 1;213:295–308. 
17. 	Boulesnane-Guengant O, Rouget M, Becker-Scarpitta A, Botella C, Kumschick S. Spatialising the ecological impacts of alien species into risk maps. Submitted; 
18. 	Huybrechts P, Trekels M, Abraham L, Desmet P. B-Cubed software development guide [Internet]. B-Cubed documentation. 2024 [cited 2025 Mar 18]. Available from: https://docs.b-cubed.eu/guides/software-development/



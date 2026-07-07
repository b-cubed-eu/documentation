---
title: pygbif
lastUpdated: 2026-05-13
sidebar:
  label: Introduction
  order: 1
source: https://raw.githubusercontent.com/gbif/pygbif/refs/heads/master/README.rst
---



[![pypi](https://img.shields.io/pypi/v/pygbif.svg)](https://pypi.python.org/pypi/pygbif)
[![docs](https://readthedocs.org/projects/pygbif/badge/?version=latest)](http://pygbif.rtfd.org/)
[![ghactions](https://github.com/gbif/pygbif/workflows/Python/badge.svg)](https://github.com/gbif/pygbif/actions?query=workflow%3APython)
[![coverage](https://codecov.io/gh/gbif/pygbif/branch/master/graph/badge.svg?token=frXPREGk1D)](https://codecov.io/gh/gbif/pygbif)
[![black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

Python client for the [GBIF API](https://www.gbif.org/developer/summary)

[Source on GitHub at gbif/pygbif](https://github.com/gbif/pygbif)

Other GBIF clients:

- R: <span class="title-ref">rgbif</span>,
  [ropensci/rgbif](https://github.com/ropensci/rgbif)
- Ruby: <span class="title-ref">gbifrb</span>,
  [sckott/gbifrb](https://github.com/sckott/gbifrb)
- PHP: <span class="title-ref">php-gbif</span>,
  [restelae/php-gbif](https://gitlab.res-telae.cat/restelae/php-gbif)

Contributing:
[CONTRIBUTING.md](https://github.com/gbif/pygbif/blob/master/.github/CONTRIBUTING.md)

# Installation

Stable from pypi

``` console
pip install pygbif
```

Development version

``` console
[sudo] pip install git+git://github.com/gbif/pygbif.git#egg=pygbif
```

<span class="title-ref">pygbif</span> is split up into modules for each
of the major groups of API methods.

- Registry - Datasets, Nodes, Installations, Networks, Organizations
- Species - Taxonomic names
- Occurrences - Occurrence data, including the download API
- Maps - Maps, get raster maps from GBIF as png or mvt

You can import the entire library, or each module individually as
needed.

In addition there is a utils module, currently with one method:
<span class="title-ref">wkt_rewind</span>, and a
<span class="title-ref">caching</span> method to manage whether HTTP
requests are cached or not. See
<span class="title-ref">?pygbif.caching</span>.

# Registry module

registry module API:

- <span class="title-ref">organizations</span>
- <span class="title-ref">nodes</span>
- <span class="title-ref">networks</span>
- <span class="title-ref">installations</span>
- <span class="title-ref">datasets</span>
- <span class="title-ref">dataset_metrics</span>
- <span class="title-ref">dataset_suggest</span>
- <span class="title-ref">dataset_search</span>

Example usage:

``` python
from pygbif import registry
registry.dataset_metrics(uuid='3f8a1297-3259-4700-91fc-acc4170b27ce')
```

# Species module

species module API:

- <span class="title-ref">name_backbone</span>
- <span class="title-ref">name_suggest</span>
- <span class="title-ref">name_usage</span>
- <span class="title-ref">name_lookup</span>
- <span class="title-ref">name_parser</span>

Example usage:

``` python
from pygbif import species
species.name_suggest(q='Puma concolor')
```

# Occurrences module

occurrences module API:

- <span class="title-ref">search</span>
- <span class="title-ref">get</span>
- <span class="title-ref">get_verbatim</span>
- <span class="title-ref">get_fragment</span>
- <span class="title-ref">count</span>
- <span class="title-ref">count_basisofrecord</span>
- <span class="title-ref">count_year</span>
- <span class="title-ref">count_datasets</span>
- <span class="title-ref">count_countries</span>
- <span class="title-ref">count_schema</span>
- <span class="title-ref">count_publishingcountries</span>
- <span class="title-ref">download</span>
- <span class="title-ref">download_meta</span>
- <span class="title-ref">download_list</span>
- <span class="title-ref">download_get</span>
- <span class="title-ref">download_citation</span>
- <span class="title-ref">download_describe</span>
- <span class="title-ref">download_sql</span>

Example usage:

``` python
from pygbif import occurrences as occ
occ.search(taxonKey = 3329049)
occ.get(key = 252408386)
occ.count(isGeoreferenced = True)
occ.download('basisOfRecord = PRESERVED_SPECIMEN')
occ.download('taxonKey = 3119195')
occ.download('decimalLatitude > 50')
occ.download_list(user = "sckott", limit = 5)
occ.download_meta(key = "0000099-140929101555934")
occ.download_get("0000066-140928181241064")
occ.download_citation("0002526-241107131044228")
occ.download_describe("simpleCsv")
occ.download_sql("SELECT gbifid,countryCode FROM occurrence WHERE genusKey = 2435098")
```

> [!NOTE]
> Download endpoints require GBIF credentials. Set them as environment
> variables:
>
> ``` bash
> export GBIF_USER="your_gbif_username"
> export GBIF_PWD="your_gbif_password"
> ```
>
> You can also pass credentials directly via `user=` and `pwd=`
> arguments.

# Maps module

maps module API:

- <span class="title-ref">map</span>

Example usage:

``` python
from pygbif import maps
out = maps.map(taxonKey = 212, year = 1998, bin = "hex",
       hexPerTile = 30, style = "classic-noborder.poly")
out.response
out.path
out.img
out.plot()
```

<img src="https://github.com/gbif/pygbif/raw/master/gbif_map.png"
style="width:25.0%" alt="image" />

# utils module

utils module API:

- <span class="title-ref">wkt_rewind</span>

Example usage:

``` python
from pygbif import utils
x = 'POLYGON((144.6 13.2, 144.6 13.6, 144.9 13.6, 144.9 13.2, 144.6 13.2))'
utils.wkt_rewind(x)
```

# Contributors

- [Scott Chamberlain](https://github.com/sckott)
- [Robert Forkel](https://github.com/xrotwang)
- [Jan Legind](https://github.com/jlegind)
- [Stijn Van Hoey](https://github.com/stijnvanhoey)
- [Peter Desmet](https://github.com/peterdesmet)
- [Nicolas Noé](https://github.com/niconoe)

# Meta

- License: MIT, see [LICENSE file](LICENSE)
- Please note that this project is released with a [Contributor Code of
  Conduct](CONDUCT.md). By participating in this project you agree to
  abide by its terms.

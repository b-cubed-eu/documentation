---
title: Versioning
parent: Software development guide
nav_order: 4
authors:
- name: Maarten Trekels
  orcid: 0000-0001-8282-8765
last_modified: 2024-02-28
---

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {:.text-delta}
- TOC
{:toc}
</details>

{:.important-title}
> B-Cubed software requirements
> 
> - Software MUST use semantic versioning.
> - Major and minor versions MUST have an associated GitHub release.
> - Starting from version 1.0, all releases MUST be published to Zenodo.

Code versioning (or version control) is an essential aspect of software development. It provides a mechanism to keep a detailed history of the changes that are made to the source code, as well as the decisions leading to those changes. This allows for a deeper understanding of the code and facilitates code audits/reviews. Code versioning also serves as a backup and recovery mechanism of the code. In case of critical errors or functionality loss, it is possible to revert to a previous working release of the software. Finally, versioning is an important communication mechanism for users of the software, especially software using it as a dependency. It indicates what changes can potentially break or alter existing functionality, offering the users the option to adapt their code or use a previous version.

## Semantic versioning

Software MUST use [semantic versioning](https://semver.org/), where the version number is of the form MAJOR.MINOR.PATCH. An example of version changes could be the following:

```bash
0.1       # First release
0.2       # Minor release
0.2.1     # Critical bug fix
0.3       # Minor release
1.0-rc.1  # Release candidate for version 1.0
1.0       # First release of the public API (i.e. the collection of user facing functions)
1.1       # Minor release
1.1.1     # Critical bug fix
1.2       # Minor release
```


There is no semantic difference between `x.y.0` and `x.y`.

## Git commits

Versioning is built into git, where changes are expressed as commits. Try to create logical commits, where related changes are bundled together (and leave unrelated changes for a following commit). Document your commit with a concise commit message in the active tense (`Add Pieter as contributor`, `Use 'invalid' over 'incorrect'`, etc.) and where necessary, document the reasoning in the commit description.

## GitHub releases

Major and minor versions MUST have an associated GitHub release:

1. Follow the [Manage releases](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository) instructions.
2. Use the semantic version number for the tag (e.g. `0.1`, `1.1.1`)

Starting from release 1.0, authors MUST also publish their releases on Zenodo. Zenodo and GitHub are integrated, allowing this publication to be automated. See [this tutorial](https://inbo.github.io/tutorials/tutorials/git_zenodo/) for details.  [following tutorial](https://inbo.github.io/tutorials/tutorials/git_zenodo/).

## Data products

The purpose of this chapter is to outline the requirements for software and scripts that are developed within the B-Cubed project. Data products are out-of-scope. However, many of the principles mentioned in this document can be applied to data products as well. For more details, we refer to the upcoming deliverable "D3.3 Guidelines on the FAIR and open depositing of data products to ensure that B-Cubed data cubes are compatible with the EBV Data Portal and other outlets for data cube dissemination".

## Changelog

To communicate and explain version changes, each repository SHOULD have a changelog. This changelog SHOULD be expressed as a `NEWS.md` file for R code (see the [rOpenSci recommendations](https://devguide.ropensci.org/releasing.html#news)).

In R you can create a `NEWS.md` file using:

```r
usethis::use_news_md()
```

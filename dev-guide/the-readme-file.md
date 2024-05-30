---
title: The README file
authors:
- name: Pieter Huybrechts
  orcid: 0000-0002-6658-6062
last_modified: 2024-02-28
---

<div class="alert alert-secondary" markdown="1">
## B-Cubed software requirements

- The README file MUST be written in Markdown, unless the software language recommends otherwise.
- The README file MUST start with a title.
- The README file MUST include a brief introduction to the repository/software.
</div>

A README file communicates the most important information about your repository/software. It will serve as a welcome sign for users, meaning that it will be the first and maybe most important piece of metadata that users will encounter. It often also serves as the landing page for a [documentation website](/dev-guide/r-packages/#documentation-website).

Maintainers SHOULD extend a README beyond its initial template when it was created as soon as possible, as it helps to define scope and expectations and facilitates [collaboration](/dev-guide/code-collaboration/). General guidance on writing a README can be found in GitHub’s [About READMEs](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-readmes) or [Make a README](https://www.makeareadme.com/), while software languages (e.g. [Python](https://docs.python-guide.org/writing/documentation/) or [R](https://devguide.ropensci.org/building.html#readme)) often have specific instructions. Some suggestions for its contents are detailed in the sections below. See the [README.md](https://github.com/frictionlessdata/frictionless-r/#readme) of the [frictionless](https://docs.ropensci.org/frictionless/) package as an example.

{:.alert .alert-warning}
All steps below can be completed in the browser. For more information on GitHub terms, see the [GitHub glossary](https://docs.github.com/en/get-started/quickstart/github-glossary).

## Format

The README file MUST be written in Markdown (and therefore be named `README.md`), unless the software language recommends otherwise. Python for example [recommends structured text](https://docs.python-guide.org/writing/documentation/#restructuredtext-ref). See the GitHub’s [Basic formatting syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) guide for more information on how to write Markdown.

## Title

A README MUST start with an H1 title with the (human-readable) name of the repository/software. The title is generally the same as the name of the package, see [Naming your package](/dev-guide/r-packages/#naming-your-package).

## Badges

Right below the title you can optionally show badges or shields to convey the current development status, link to a publication or archive, test coverage and more. Many GitHub workflows come with a [status badge](https://docs.github.com/en/actions/monitoring-and-troubleshooting-workflows/adding-a-workflow-status-badge) and static shields can easily be created using [https://shields.io/badges](https://shields.io/badges). Vincent A. Cicirello provides a general overview in [this blog post](https://dev.to/cicirello/badges-tldr-for-your-repositorys-readme-3oo3).

Maintainers SHOULD at least include a repo status or lifecycle badge, to indicate the maturity/support for the repository/software. See [repostatus.org](https://www.repostatus.org/) for statuses or [lifecycle](https://lifecycle.r-lib.org/articles/stages.html) and how to add it as a badge.

## Description

Below the Title and the optional badges, a brief, title-less introduction MUST be provided, explaining the rationale and/or scope of the repository/software. A software package might initially limit its scope to only part of a bigger problem, and signal this in its description. For example a package wrapping an API might only support reading from that API, not writing to it. Or an analysis library might only initially offer statistical functionality, but not any visualization of results.

## Installation instructions

While it can be very clear how to install a software package for those who were closely involved in writing them, the same is not always true for external users. Thus minimal instructions SHOULD be included in the README on how to install the software and its dependencies.

## Examples or usage instructions

Similar to the installation instructions at least one example of the functionality of the analysis workflow or software SHOULD be included in the README.

## README files for data

A repository can have additional README files beyond the one in the root. These typically serve as an introduction to a specific directory. These SHOULD NOT be used, as there are better ways to [document code](/dev-guide/r-packages/#documenting-functions), but it can serve as a quick way to describe data files. See [this guide](https://data.research.cornell.edu/data-management/sharing/readme/) by Cornell University Data Services or Dryad’s [best practices document](https://datadryad.org/stash/best_practices#describe-your-dataset-in-a-readme-file) for guidance. Better yet is to deposit your data elsewhere.

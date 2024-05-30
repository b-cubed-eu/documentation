---
title: Code repositories
authors:
- name: Peter Desmet
  orcid: 0000-0002-8442-8025
last_modified: 2024-02-28
---

{:.important-title}
> B-Cubed software requirements
> 
> - All software code MUST be maintained on GitHub.
> - An installable software tool MUST be maintained in its own repository.
> - A repository MUST contain a `.gitignore` file.
> - A repository MUST contain a `LICENSE` file and be licenced under the MIT licence.
> - A repository MUST contain a `README.md` file.
> - A repository MUST contain a `CITATION.cff` file.

All software code MUST be maintained on GitHub. Code is maintained in a **repository**, which contains all files, discussions and version history related to a single software package or analysis.

{:.note-title}
> Note
> 
> All steps below can be completed in the browser. For more information on GitHub terms, see the [GitHub glossary](https://docs.github.com/en/get-started/quickstart/github-glossary).

## Create a repository

You first need to define the scope of your repository. An installable software tool (R package, Python library, etc.) MUST be maintained in its own repository. For an analysis, choose a scope that is easy to manage and collaborate on.

It is RECOMMENDED that you start your repository before you write code. That way, you can follow best practices, others can contribute and all version history is captured from the start.

The easiest way to create a repository is in your browser:

1. Login to GitHub (<https://github.com>).
2. Go to <https://github.com/orgs/b-cubed-eu/repositories>. If you do not see a `New repository` button (green), then you are not yet invited to the B-Cubed organization on GitHub. Email your GitHub username to [GitHub B-Cubed admin](mailto:laura.abraham@plantentuinmeise.be) and wait with the following steps until you are invited.
3. Follow the [Quickstart for repositories](https://docs.github.com/en/repositories/creating-and-managing-repositories/quickstart-for-repositories) instructions and create a new repository at <https://github.com/organizations/b-cubed-eu/repositories/new>:
    1. Choose `b-cubed-eu` as owner. If that option is not available, see step 2.
    2. The repository name SHOULD be lowercase, dash-separated and short.
    3. The description SHOULD be a descriptive, one-sentence title (without period at the end), such as `R package to read and write Frictionless Data Packages`.
    4. The visibility MUST be set to `public`. This makes it easier to collaborate and reference files and code.
    5. Check `Add a README file`.
    6. You MUST select a `.gitignore` template (e.g. R, Python)
    7. You MUST select a licence and you MUST set it to `MIT License`. This conforms to the [B-Cubed Data Management Plan](https://b-cubed.eu/storage/app/uploads/public/64e/f45/6cd/64ef456cd4da1356663578.pdf).

If you already have your code (locally), follow [About adding existing source code to GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github#initializing-a-git-repository). Using GitHub Desktop is the easiest option.

If your code is already on GitHub under a personal account, it MUST be transferred to the `b-cubed-eu` organization or your institution, if it has a well-established track record of maintaining code on GitHub. Contact the [GitHub B-Cubed admin](mailto:laura.abraham@plantentuinmeise.be) to gain the rights to transfer your repository to the `b-cubed-eu` organization.

Once you have created a repository (see [Figure 1](#figure-1)), you SHOULD complete a number of additional steps.

{:#figure-1}
![Screenshot of a newly created repository](/assets/dev-guide/code-repository.png)
**Figure 1: Screenshot of a newly created repository.**

## Set the copyright holder

1. Go to the `LICENSE` file.
2. Click the pencil icon.
3. Select `Choose a license template`.
4. Choose `MIT License`.
5. Select the `year` the software was started.
6. Set `Full name` to the institution where the maintainer of the software is employed (e.g. `Research Institute for Nature and Forest (INBO)`). When in doubt, leave as `B-Cubed`.
7. Commit the changes.

## Ignore Mac .DS_Store files

Mac operating systems create [.DS_Store](https://en.wikipedia.org/wiki/.DS_Store) files to store attributes of a directory. These can clutter your repository and should be ignored.

1. Go to the `.gitignore` file.
2. Click the pencil icon.
3. Scroll to the bottom and add the following code (before the empty line):

    ```.gitignore
    # Mac OS
    .DS_Store
    ```

4. Commit the changes.

## Add a CITATION.cff file

Repositories MUST contain a `CITATION.cff` file so users know how to cite the software. Its metadata also gets picked up when depositing a repository to Zenodo (see [releases](/dev-guide/versioning/#github-releases)). For more information see [What is a CITATION.cff file](https://citation-file-format.github.io/#/what-is-a-citation-cff-file) or GitHub’s [About CITATION files](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-citation-files).

1. Go to the main page of your repository.
2. Click `Add file` then `Create new file`.
3. Name your file `CITATION.cff`.
4. An info box will appear, select `Insert example`.
5. Include the name and ORCID of the maintainers.
6. Remove the lines `doi` and `date-released`.
7. Commit the changes.

Note: this file can be updated later (manually or through functions).

Note: a `CITATION.cff` is different from the R-specific `CITATION` file ([without an extension](/dev-guide/r/#citation)).

## Add topics

1. Follow the [Classify with topics](https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/classifying-your-repository-with-topics).
2. Add a number of topics, including the language (`r` and `rstats` or `python`), the type of software (e.g. `r-package`, `analysis`) and related subjects (e.g. `invasive-species`), cf. the section on [GitHub repo topics](https://devguide.ropensci.org/grooming.html#github-repo-topics) in the rOpenSci Packages guide.

## Hide irrelevant tabs

1. Go to the `Settings` tab.
2. In `Features`, turn off `Wikis` and `Projects`. These features will likely not be used.

## Invite collaborators

1. Contact the [GitHub B-Cubed admin](mailto:laura.abraham@plantentuinmeise.be) to indicate who you want to invite. The admin can then organize the collaborators in teams.
2. Follow the [Invite collaborators](https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-personal-account-on-github/managing-access-to-your-personal-repositories/inviting-collaborators-to-a-personal-repository) instructions (these are for personal repositories, but many of the steps apply to organization repositories).
3. Type the GitHub name of the collaborator you want to add.
4. Indicate the rights (`Read`, `Triage`, `Write`,  `Maintain`, or `Admin`).
5. The collaborator will receive an email invitation to collaborate.

## Extend your README.md file

See the [README file](/dev-guide/the-readme-file/) chapters.

## Setup your local environment, contribute code and collaborate

See the [Code collaboration](/dev-guide/code-collaboration/) chapter.

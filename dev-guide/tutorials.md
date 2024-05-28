---
title: Tutorials
parent: Software development guide
nav_order: 10
authors:
- name: Laura Abraham
  orcid: 0000-0003-4070-2982
last_modified_date: 2024-02-29
---

# Tutorials
{:.no_toc}

Lead author: Laura Abraham

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
> - Each package and analysis MUST have at least one tutorial.
> - Tutorials MUST be included in the B-Cubed documentation website.
> - Tutorials MUST be written in English using literate programming documents. 

To make software more welcoming to users, each package and analysis MUST have at least one tutorial guiding users through its main functionality. These tutorials MUST be included (copied or referenced) in the [B-Cubed documentation website](https://docs.b-cubed.eu/).

## Documenting software and code in B-Cubed

Tutorials MUST be written in English and presented as literate programming documents (e.g. Jupyter notebooks, RMarkdown or Quarto) to provide both narrative context and executable code snippets. The documentation website will be versioned and an automated testing mechanism will be set up to guarantee that provided documentation works for a specific release of the B-Cubed toolbox. Ensure that your tutorial passes automated tests.

## Creating a new tutorial

1. Create a new branch in <https://github.com/b-cubed-eu/documentation> following the [Github flow](/dev-guide/code-collaboration/#github-flow). 
2. Go to the `tutorials` folder in the documentation repository or use [this link](https://github.com/b-cubed-eu/documentation/tree/main/tutorials).
3. Click `Add file` and then `Create new file`.
4. Name your file `name-of-tutorial/index.md`. Use lowercase and dashes (`create-occurrence-cube/index.md`).
5. Start your Markdown file with front matter:

    ```
    ---
    title: [Your tutorial title]
    description: [Short description of your tutorial]
    authors:
      - name: [Author name]
        orcid: [Author ORCID]
    last_modified_date: [YYYY-MM-DD]
    categories: [category]
    source: [url]
    ---
    ```

6. Replace `[Your tutorial title]` with the actual title of your tutorial, provide a description and fill in the author’s information. You can include multiple authors by adding additional items under the `authors` field. The `last_modified_date` field should be filled with the publication or last modification date and the `categories` field can be customised based on the content of your tutorial. The `source` is the URL of your tutorial if it is maintained elsewhere. 
7. Commit the changes.

You now have a directory for your tutorial, which can contain any files (images, small datasets, reproducible notebook) related to your tutorial. The `index.md` will serve as the public page for your tutorial.

## Writing your tutorial

You can write your tutorial directly in the `index.md`, but if it includes code snippets, it is RECOMMENDED to write it as a reproducible R Markdown, Quarto or Jupyter Notebook. This makes it easier to run and test (cf. a [README.Rmd over a README.md](/dev-guide/r-packages/#readme)).

Such files can then be rendered to HTML/Markdown, and will not only include the text and the code snippets, but also the results of running the code ([example](https://docs.ropensci.org/frictionless/articles/frictionless.html)). That rendered HTML/Markdown can be copied to `index.md`, under the frontmatter.

As for the content of your tutorial:

- Clearly state the purpose of the tutorial.
- Include step-by-step instructions on how to install the software. 
- Specify dependencies and system requirements if applicable.
- Detail how to use the software.
- Include at least one example and explain key features.
- Write in a clear and concise manner for a diverse audience.

Once your tutorial is ready, submit your branch as a pull request for review.

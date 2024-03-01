---
title: Code collaboration
parent: Software development guide
nav_order: 3
authors:
- name: Peter Desmet
  orcid: 0000-0002-8442-8025
last_modified_date: 2024-02-28
---

# Code collaboration
{: .no_toc }

Lead author: Peter Desmet

<details closed markdown="block">
  <summary>
    Table of contents
  </summary>
  {: .text-delta }
- TOC
{:toc}
</details>

{: .important-title }
> B-Cubed software requirements
> 
> - All software MUST have a code of conduct (as a `CODE_OF_CONDUCT.md` file following the [Contributor Covenant template](https://www.contributor-covenant.org/)).
> - All participants to software MUST abide by its code of conduct.
> - Maintainers MUST watch the repository they maintain.
> - Code contributions MUST follow the GitHub flow.
> - The main branch MUST contain the software code in a state that can be installed without issue.

Open source software relies on **collaboration**. Participants in this process are not only developers, but anyone interacting with the software (code), such as maintainers, contributors, testers, users reporting issues, etc. To facilitate the collaboration process, it is good to adopt a number of community standards and best practices (see below).

For more information on open source software collaboration, see [Finding ways to contribute to open source on GitHub](https://docs.github.com/en/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github) (also useful for non-developers) and GitHub’s [Open source guides](https://opensource.guide/). See how well your repository is adopting community standards at `https://github.com/b-cubed-eu/<your-repo>/community`.

{: .note-title}
> Note
> 
> All steps below can be completed in the browser. For more information on GitHub terms, see the [GitHub glossary](https://docs.github.com/en/get-started/quickstart/github-glossary).

## Add a Code of conduct

A [code of conduct](https://opensource.guide/code-of-conduct/) is a document that establishes expectations for behaviour from all software participants. Adopting and enforcing it can help to create a safe and positive working space.

All software MUST have a code of conduct, as a `CODE_OF_CONDUCT.md` file following the [Contributor Covenant](https://www.contributor-covenant.org/) template. All participants to software MUST abide by its code of conduct.

To add a `CODE_OF_CONDUCT.md`:

1. Follow the [Add a code of conduct](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/adding-a-code-of-conduct-to-your-project) instructions.
2. In step 5, choose the  `Contributor Covenant` template.
3. Add as `Contact method`: `b-cubedsupport@meisebotanicgarden.be` (this email is monitored by MeiseBG staff).
4. Before committing the changes, change the file name to `.github/CODE_OF_CONDUCT.md`.

Alternatively, you can complete these steps in R using:

```r
usethis::use_tidy_coc()
```

But update the default email address (`codeofconduct@posit.co`) in "Enforcement" to `b-cubedsupport@meisebotanicgarden.be` before committing the file.

## Enable notifications

[Notifications](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/about-notifications#default-subscriptions) are (email) alerts of participant activity in a repository or issue thread you are subscribed to. They facilitate collaboration and relieve you from having to check into GitHub.com. Activities that can trigger a notification include issues, pull requests and releases. Commits do not trigger a notification, which is why the [GitHub flow](#github-flow) (i.e. pull requests) is recommended to inform collaborators of important changes. You also won’t receive notifications for your own actions.

You are [automatically subscribed](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/setting-up-notifications/about-notifications#default-subscriptions) to notifications based on your actions (like commenting on an issue) or the actions of others (like [@mentioning](https://docs.github.com/en/get-started/quickstart/github-glossary#mention) or assigning you). You don’t need to be an official contributor to be notified, anyone can do so by clicking the `Watch` button on a repository homepage. Maintainers MUST watch the repository they maintain. If you receive too many notifications, you can [control what events](https://docs.github.com/en/account-and-profile/managing-subscriptions-and-notifications-on-github/managing-subscriptions-for-activity-on-github/managing-your-subscriptions) you want to be notified of.

When receiving a notification by email, click the `view it on GitHub` link at the bottom to interact. This generally provides better context and formatting options than your email client (see [Report issues](#report-issues)).

{: #github-flow }
## Follow the GitHub flow

The GitHub flow is an easy-to-adopt practice for code collaboration that MUST be followed for all code contributions to B-Cubed software. It consists of making a **branch**, making changes, creating a **pull request**, addressing review comments, merging the pull request and deleting the branch. See [GitHub flow](https://docs.github.com/en/get-started/using-github/github-flow) for more information, including links to further documentation for all the steps.

## Protect the main branch

The `main` branch MUST contain the software code in a state that can be installed without issue. To ensure code contributions (via pull requests) are reviewed before these are merged into the `main` branch, you can configure your repository to do so:

1. Follow the [Branch protection rule](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/managing-a-branch-protection-rule) instructions.
2. For `Branch name pattern`, choose `main`.
3. `Require a pull request before merging` SHOULD be enabled, with the default `Require approvals`.

See also [GitHub flow](#github-flow) for working with branches.

## Contributing guide

Maintainers SHOULD clarify how participants can contribute to their software, by adding a contributing guide as a `CONTRIBUTING.md` file in the `.github` directory.

To add a `CONTRIBUTING.md` file:

1. Follow the [Contributor guidelines](https://docs.github.com/en/communities/setting-up-your-project-for-healthy-contributions/setting-guidelines-for-repository-contributors) instructions.
2. Copy/paste a template such as Peter Desmet’s [CONTRIBUTING.md](https://gist.github.com/peterdesmet/e90a1b0dc17af6c12daf6e8b2f044e7c) or the [Contributing to tidyverse](https://tidyverse.tidyverse.org/CONTRIBUTING.html).
3. Adapt where necessary.
4. Make sure the instructions do not contradict with the [Github flow](#github-flow).

Alternatively, you can complete these steps in R using:

```r
usethis::use_tidy_contributing()
```

Which will use the [Contributing to tidyverse](https://tidyverse.tidyverse.org/CONTRIBUTING.html) template.

## Report issues

While the [GitHub flow](#github-flow) lowers the barrier for making code contributions, it is useful (and saves you from writing unnecessary code) to interact with the maintainer(s) before suggesting changes. The easiest way to do so is by [creating an issue](https://docs.github.com/en/issues/tracking-your-work-with-issues/creating-an-issue).

Issues can be used to report and discuss a bug, idea or task. Issues are typically not used to ask for support in using the software. Anyone can create an issue or comment on it, and all participants watching the repository will get a [notification](#enable-notifications-15). Once an issue is resolved (by fixing the bug, implementing the feature, or deciding not to act upon it) it can be closed. Closed issues are still accessible and can act as a history of decisions ([BES 2019][bes_2019]).

Writing a good issue takes skill, see [this blog post](https://dev.to/opensauced/how-to-write-a-good-issue-tips-for-effective-communication-in-open-source-5443) or the [tidyverse code review guide](https://code-review.tidyverse.org/issues/) for guidance, and follow the [contributing guide](#contributing-guide).

Just like the [README file](/dev-guide/the-readme-file/), issues (and pull request) support **Markdown** formatting that can improve readability, link issues to code and other issues, and notify people. See the GitHub’s [Basic formatting syntax](https://docs.github.com/en/get-started/writing-on-github/getting-started-with-writing-and-formatting-on-github/basic-writing-and-formatting-syntax) guide for more information.

As a maintainer, you can nudge participants in the right direction by providing an issue template. Follow the [Configuring issue templates for your repository](https://docs.github.com/en/communities/using-templates-to-encourage-useful-issues-and-pull-requests/configuring-issue-templates-for-your-repository) instructions to do so. Alternatively, you can complete these steps in R using:

```r
usethis::use_tidy_issue_template()
```

But update or remove the references to `https://stackoverflow.com` or `https://community.rstudio.com` before committing the file.

## Local development

While some contributions can be made directly in the browser (one file at a time), most software development will be done locally, in an environment where it can be run and tested. Git (and the [GitHub flow](#github-flow)) allow these changes to be synchronized. Rather than explaining how to use git, we recommend the use of [GitHub Desktop](https://desktop.github.com/) to facilitate this process.

GitHub desktop is a visual interface that allows you to commit your changes (include file parts and multiple related files), push those to GitHub.com, pull changes from contributors, resolve merge conflicts, and switch branches. It works well next to other code editors such as R Studio. See the [GitHub Desktop](https://docs.github.com/en/desktop/installing-and-authenticating-to-github-desktop/setting-up-github-desktop) instructions to get started.

<!-- References -->
[bes_2019]: https://www.britishecologicalsociety.org/wp-content/uploads/2019/06/BES-Guide-Reproducible-Code-2019.pdf "British Ecological Society, Croucher M, Graham L, James T, Krystalli A, Michonneau F (2017). Reproducible code."

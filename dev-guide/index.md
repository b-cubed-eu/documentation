---
title: Software development guide
permalink: /dev-guide/
has_children: true
nav_order: 3
---

# Software development guide

{: .note-title}
> Note
> 
> This software development guide was first published as "Quality requirements for software" in [Huybrechts et al. (2024)][huybrechts_2024]. While it was written for B-Cubed software, the suggestions and recommendations are general enough to be used by anyone who wants to improve their research software code.

This guide specifies high-level requirements for software, computational tools and resources developed for B-Cubed (referred to in the chapters as only "software") to ensure that the produced software meets the intended quality, openness, portability and reusability.

These requirements were carefully selected from numerous existing best practices and guidelines, and aim to promote a consistent **open source development** cycle that allows collaboration and reuse within and outside of the consortium. Emphasis is placed on standardized metadata (files) that make it easier for both humans and search engines to find the software, and thus to increase its discoverability and reuse. In this same vein, emphasis is placed on the **portability** of the produced software to make sure it is functional on different platforms now and in the future with minimal modifications. Following existing paradigms and design patterns makes the behaviour of the software more predictable and makes results easier to replicate. By following the recommendations in this document, interoperability between software packages can be achieved.

The chapters include requirements, as well as hands-on instructions and examples. They cover topics such as [code repositories](/dev-guide/code-repositories/) and [collaboration](/dev-guide/code-collaboration/), and in-depth development best practices, including testing and documentation, for both the [R](/dev-guide/r/) and [Python](/dev-guide/python/) programming languages. The final chapter offers guidelines for the creation of [tutorials](/dev-guide/tutorials/) for the produced software. At the head of every chapter an overview is offered that summarizes the minimal requirements (MUST as per RFC 2119). The text of the chapter can include additional recommendations (SHOULD, RECOMMENDED as per RFC 2119).

The key words MUST, MUST NOT, REQUIRED, SHALL, SHALL NOT, SHOULD, SHOULD NOT, RECOMMENDED, MAY, and OPTIONAL in this document are to be interpreted as described in [RFC 2119](https://www.rfc-editor.org/rfc/rfc2119).

## Citation

> Huybrechts P, Trekels M, Abraham L, Desmet P (2024). Software development guide. <https://docs.b-cubed.eu/dev-guide/>

[huybrechts_2024]: https://b-cubed.eu/library "Huybrechts P, Trekels M, Abraham L, Desmet P (2024). Quality requirements for software. B3 project deliverable D3.1."

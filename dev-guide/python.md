---
title: Python
parent: Software development guide
nav_order: 9
authors:
- name: Maarten Trekels
  orcid: 0000-0001-8282-8765
last_modified: 2024-02-29
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
> - Code development MUST be done in a virtual environment.
> - The repository MUST contain a `requirements.txt` file.
> - Python code MUST adhere to the [PEP 8 style guide][https://peps.python.org/pep-0008/].
> - Package and module names MUST be lowercase and short.
> - Class names MUST use CamelCase.
> - Indentation MUST be done using 4 spaces.
> - All Python code MUST reach a test coverage of at least 75% calculated using [pytest-cov](https://pytest-cov.readthedocs.io/en/).
> - Unit tests MUST be implemented using the [pytest](https://docs.pytest.org/en/latest) package.
> - Documentation MUST be created using [Sphinx](https://docs.readthedocs.io/en/stable/intro/getting-started-with-sphinx.html).
> - Classes and functions MUST be documented using docstrings.

Many of the principles that are outlined in the chapters on [R](/dev-guide/r/) and [R packages](/dev-guide/r-packages/), also apply to writing Python code. In this chapter, we will outline some additional requirements for Python. A very good reference to Python programming can be found in [The Hitchhicker’s Guide to Python](https://docs.python-guide.org/) ([Reitz & Schlusser 2016][reitz_schlusser_2016]).

## Repository structure

After creating a [new code repository](/dev-guide/code-repositories/), the preferred structure for a repo named `sample` is as follows:

```
.gitignore
requirements.txt
README.md
LICENSE
Makefile
setup.py
pyproject.toml
sample/
  __init__.py
  core.py
  helpers.py
tests/
  tests_basic.py
  tests_advanced.py
docs/
  index.rst
  conf.py
  requirements.in
data/
  mydata.csv
CHANGE.md
CITATION.cff
.github/
  CODE_OF_CONDUCT.md
```

## Virtual environments

You MUST use a virtual environment to develop your Python code. Virtual environments provide control over the version of Python and the installed packages. This will also make it easier to create a `requirements.txt`. There are several options to do this, but it is recommended to either use [virtualenv](https://virtualenv.pypa.io/en/stable/user_guide.html) or [conda](https://conda.io/projects/conda/en/latest/user-guide/index.html).

## Dependencies

All Python projects MUST contain a `requirements.txt` file containing all dependencies of the code. A guide on the preparation of this requirements file can be found in [this documentation](https://pip.pypa.io/en/stable/user_guide/#requirements-files). The requirements file guarantees that the code can be executed in a reproducible manner. Also, when creating a Python package, this allows PIP to install all dependencies together with the package. 

## Code style

Python code must adhere to the [PEP 8 style guide for Python code](https://peps.python.org/pep-0008/). Some of the main elements that should be taken into consideration when writing code are outlined below.

### Use explicit code

The most explicit and straightforward way of coding is preferred. E.g.:

```python
# Bad
def make_complex(*args):
    x, y = args
    return dict(**locals())

# Good
def make_complex(x, y):
    return {'x': x, 'y': y}
```

## One statement per line

Although in some particular cases it might be reasonable to have multiple statements per line, in general this is bad practice to have more than one disjointed statement on one line:

```r
# Bad
print("one"); print("two")

# Good
print("one")
print("two")
```

### Line breaks with binary operations

In order to improve the readability of the code, it is recommended to use line breaks before the binary operator:

```python
# Bad
income = (gross_wages +
          taxable_interest +
          (dividends - qualified_dividends) -
          ira_deduction -
          student_loan_interest)
# Good
income = (gross_wages
          + taxable_interest
          + (dividends - qualified_dividends)
          - ira_deduction
          - student_loan_interest)
```

### Check your code against PEP 8

It is recommended that each piece of Python code is checked using [pycodestyle](https://pypi.org/project/pycodestyle/). Your code can be checked by using:

```bash
pycodestyle --first yourcode.py
```

For more advanced usage of the package, please refer to [its documentation website](https://pypi.org/project/pycodestyle/).

## Testing

In general, testing should be performed on small units of functionality. As a good practice, it is recommended that each function has a corresponding test associated with. All testing MUST be performed using the [pytest](https://docs.pytest.org/en/latest) package. Several guidelines on using the package are available on its [documentation website](https://docs.pytest.org/en/latest/how-to/index.html#how-to).

Another good practice is to include a test for each bug that is/was present in the code. In that case, please refer to the corresponding bug report in the test documentation. 

## Packages

Although there might be several use cases where it is sufficient to develop a Python module (single file), it is RECOMMENDED to package your code into a Python package. A comprehensive guide to creating a Python package can be found [here](https://packaging.python.org/). When adhering to the recommended repository structure, many of the requirements for a Python package are covered.

## Documentation

Documentation for your packages MUST be created using [Sphinx](https://docs.readthedocs.io/en/stable/intro/getting-started-with-sphinx.html). Sphinx is a very powerful documentation generator tool which is widely used within the Python community. 

The way Classes and functions are documented is using docstrings. A Sphinx docstring has the following structure:

```python
"""[Summary]

:param [ParamName]: [ParamDescription], defaults to [DefaultParamVal]
:type [ParamName]: [ParamType](, optional)
...
:raises [ErrorType]: [ErrorDescription]
...
:return: [ReturnDescription]
:rtype: [ReturnType]
"""
```

## Continuous integration with GitHub actions

GitHub Actions SHOULD be used to test, build and release your Python packages. A step-by-step guide to publish your releases can be found [here](https://packaging.python.org/en/latest/guides/publishing-package-distribution-releases-using-github-actions-ci-cd-workflows/).

<!-- References -->
[reitz_schlusser_2016]: https://docs.python-guide.org/ "Reitz K, Schlusser T (2016). The Hitchhiker's guide to Python: best practices for development. O'Reilly Media, Inc."

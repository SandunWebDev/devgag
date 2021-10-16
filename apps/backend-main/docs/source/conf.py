# type: ignore

# Configuration file for the Sphinx documentation builder.
#
# This file only contains a selection of the most common options. For a full
# list see the documentation:
# https://www.sphinx-doc.org/en/master/usage/configuration.html

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.

import os
import sys

import myst_parser
import sphinx_rtd_theme

sys.path.insert(0, os.path.abspath("../../src"))


# -- Project information -----------------------------------------------------
project = "DevGag Backend Main API"
copyright = "2021, Sandun"
author = "Sandun"
release = "0.1"  # The full version, including alpha/beta/rc tags


# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
extensions = [
    # Built In Extentions
    "sphinx.ext.autodoc",  # Generate docs and summary form docstrings.
    "sphinx.ext.autosummary",
    "sphinx.ext.napoleon",  # Nicer argument formatting.
    #
    # Third Party Extentions
    "sphinx_rtd_theme",  # Read The Docs Theme.
    "myst_parser",  # .md File Parser.
]

# Add any paths that contain templates here, relative to this directory.
templates_path = ["_templates"]

# List of patterns, relative to source directory, that match files and
# directories to ignore when looking for source files.
# This pattern also affects html_static_path and html_extra_path.
exclude_patterns = []

# ----------------------------------------------------------------------------
# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.
html_theme = "sphinx_rtd_theme"

# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ["_static"]

# ----------------------------------------------------------------------------
# -- Other -------------------------------------------------------------------
source_suffix = {
    ".rst": "restructuredtext",
    ".txt": "markdown",
    ".md": "markdown",
}


# -----------------------------------------------------------------------------
# -- Extention Configurations -------------------------------------------------

# -- autoclass and autodoc
autoclass_content = "both"  # include both class docstring and __init__
autodoc_default_options = {
    # Make sure that any autodoc declarations show the right members
    "members": True,
    "inherited-members": True,
    "private-members": True,
    "show-inheritance": True,
}
autosummary_generate = True  # Make _autosummary files and include them

# -- napoleon
napoleon_numpy_docstring = False  # Force consistency, leave only Google
napoleon_use_rtype = False  # More legible

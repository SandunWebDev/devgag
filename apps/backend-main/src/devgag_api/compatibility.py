"""Python 2/3 compatibility module."""

import sys

PY2 = int(sys.version[0]) == 2

if PY2:
    text_type = unicode
    binary_type = str
    string_types = (str, unicode)
    unicode = unicode  # noqa: WPS434
    basestring = basestring  # noqa: WPS434
else:
    text_type = str
    binary_type = bytes
    string_types = (str,)
    unicode = str
    basestring = (str, bytes)

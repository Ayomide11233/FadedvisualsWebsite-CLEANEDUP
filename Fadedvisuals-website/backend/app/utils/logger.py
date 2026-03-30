"""
app/utils/logger.py
===================
Structured application logger.
Suspicious request events (rate-limit hits, auth failures, injection attempts)
are emitted at WARNING level so they can be forwarded to a SIEM / alerting system.
"""

import logging
import sys


def get_logger(name: str = "faded_visuals") -> logging.Logger:
    logger = logging.getLogger(name)

    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        fmt = logging.Formatter(
            "%(asctime)s | %(levelname)-8s | %(name)s | %(message)s",
            datefmt="%Y-%m-%dT%H:%M:%S",
        )
        handler.setFormatter(fmt)
        logger.addHandler(handler)
        logger.setLevel(logging.INFO)

    return logger


logger = get_logger()

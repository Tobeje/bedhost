from typing import Dict, List, Tuple, Union
from fastapi import Path
from pydantic import BaseModel
from enum import Enum


class DBResponse(BaseModel):
    """
    Database response data model
    """

    columns: List
    data: Union[List[List], List[Dict], Tuple, Dict]


RemoteClassEnum = Enum(
    "RemoteClassEnum",
    {"http": "http"},
)

BedsetDigest = Path(
    ...,
    description="BED set digest",
    regex=r"^\w+$",
    max_length=32,
    min_length=32,
    # example=ex_bedset_digest,
)


class BedList(BaseModel):
    md5sums: list


ex_chr = "chr1"

# API query path definitions
BedDigest = Path(
    ...,
    description="BED digest",
    regex=r"^\w+$",
    max_length=32,
    min_length=32,
    # example=ex_bed_digest,
)

chromosome_number = Path(
    ...,
    description="Chromosome number",
    regex=r"^\S+$",
    example=ex_chr,
)

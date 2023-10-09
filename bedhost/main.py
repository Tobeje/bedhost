import logging
import sys
import os
from typing import Dict, List, Optional

import bbconf
import coloredlogs
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from bedhost import _LOGGER
from bedhost.cli import build_parser
from bedhost.const import (
    CFG_PATH_KEY,
    CFG_PATH_PIPELINE_OUTPUT_KEY,
    CFG_REMOTE_KEY,
    CFG_SERVER_HOST_KEY,
    CFG_SERVER_KEY,
    CFG_SERVER_PORT_KEY,
    PKG_NAME,
    STATIC_PATH,
    SERVER_VERSION,
)

from bedhost.helpers import BedHostConf, FileResponse

try:
    bbc = BedHostConf(
        "/home/bnt4me/virginia/repos/bedbase_all/bedhost/bedbase_configuration_compose.yaml"
    )
except Exception as e:
    pass

_LOGGER_BEDHOST = logging.getLogger("uvicorn.access")
coloredlogs.install(
    logger=_LOGGER_BEDHOST,
    level=logging.INFO,
    datefmt="%b %d %Y %H:%M:%S",
    fmt="[%(levelname)s] [%(asctime)s] [BEDHOST] %(message)s",
)


app = FastAPI(
    title=PKG_NAME,
    description="BED file/sets statistics and image server API",
    version=SERVER_VERSION,
    docs_url="/api/docs",
)

origins = [
    "http://localhost",
    "http://localhost:8000",
    "http://localhost:5173",
    "https://bedbase.org",
    "*",
]

# uncomment below for development, to allow cross origin resource sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
async def index():
    """
    Display the dummy index UI page
    """
    return FileResponse(os.path.join(STATIC_PATH, "index.html"))


def attach_routers(app):
    _LOGGER.debug("Mounting routers")
    from bedhost.routers import bed_api, bedset_api, private_api, base, search_api

    app.include_router(base.router)
    app.include_router(bed_api.router)
    app.include_router(bedset_api.router)
    app.include_router(search_api.search_router)
    # app.include_router(private_api.router, prefix="/_private_api")

    if not CFG_REMOTE_KEY in bbc.config:
        _LOGGER.debug(
            f"Using local files for serving: "
            f"{bbc.config[CFG_PATH_KEY][CFG_PATH_PIPELINE_OUTPUT_KEY]}"
        )
        # app.mount(
        #     bbc.get_bedstat_output_path(),
        #     StaticFiles(directory=bbc.get_bedstat_output_path()),
        #     name=BED_TABLE,
        # )
        # app.mount(
        #     bbc.get_bedbuncher_output_path(),
        #     StaticFiles(directory=bbc.get_bedbuncher_output_path()),
        #     name=BEDSET_TABLE,
        # )
    else:
        _LOGGER.debug(
            f"Using remote files for serving. Prefix: {bbc.config[CFG_REMOTE_KEY]['http']['prefix']}"
        )


def register_globals(cfg: str) -> None:
    """
    TODO: what does it meand?
    """
    _LOGGER.debug("Registering uvicorn globals")

    _LOGGER.setLevel(logging.DEBUG)
    stream = logging.StreamHandler(sys.stdout)
    stream.setLevel(logging.DEBUG)
    _LOGGER.addHandler(stream)

    global bbc
    _LOGGER.info("Getting bedbase cfg...")
    bbc = BedHostConf(bbconf.get_bedbase_cfg(cfg))
    _LOGGER_BEDHOST.info("Finish getting bedbase cfg")


def main():
    parser = build_parser()
    args = parser.parse_args()
    if not args.command:
        parser.print_help()
        print("No subcommand given")
        sys.exit(1)

    register_globals(args.config)

    if args.command == "serve":
        attach_routers(app)
        _LOGGER.info(f"Running {PKG_NAME} app...")
        uvicorn.run(
            app,
            host=bbc.config[CFG_SERVER_KEY][CFG_SERVER_HOST_KEY],
            port=bbc.config[CFG_SERVER_KEY][CFG_SERVER_PORT_KEY],
        )


if __name__ != "__main__":
    # Establish global config when running through uvicorn CLI
    if os.environ.get("BEDBASE_CONFIG"):
        register_globals(os.environ.get("BEDBASE_CONFIG"))
        attach_routers(app)
    else:
        raise EnvironmentError(
            "No BEDBASE_CONFIG found. Can't configure server. Check documentation to create config file"
        )

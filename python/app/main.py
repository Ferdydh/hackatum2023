from dotenv import load_dotenv
load_dotenv(override=True)

import logging

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.controller import api_controller, stream_api_controller, ws_controller
from app.middleware import time_middleware

logging.config.fileConfig("logging.conf", disable_existing_loggers=False)
logger = logging.getLogger(__name__)

logger.info("Application Started")

app = FastAPI(title="Ducky", docs_url="/")

origins = [
    '*'
    # "http://localhost",
    # "http://localhost:8080",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(time_middleware.TimeMiddleware)

app.include_router(api_controller.router, prefix="/v1/api", tags=["Query"])
app.include_router(stream_api_controller.router, prefix="/v1/stream_api", tags=["Query"])
app.include_router(ws_controller.router, prefix="/v1/ws", tags=["Query"])
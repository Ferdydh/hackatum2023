import logging

from fastapi import FastAPI

from app.controller import api_controller
from app.middleware import time_middleware

logging.config.fileConfig("logging.conf", disable_existing_loggers=False)
logger = logging.getLogger(__name__)

logger.info("Application Started")

app = FastAPI(title="Ducky", docs_url="/")

app.add_middleware(time_middleware.TimeMiddleware)

app.include_router(api_controller.router, prefix="/v1/api", tags=["Query"])
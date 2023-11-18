import logging

logger = logging.getLogger(__name__)
logger.setLevel(logging.CRITICAL)

def hello(query_string: str) -> str:
    logger.info("called")
    return "hello" + query_string
import os
from dotenv import find_dotenv, load_dotenv

# Connect the path with your '.env' file name
load_dotenv(find_dotenv())

EXAMPLE_ENV = os.getenv("EXAMPLE_ENV")

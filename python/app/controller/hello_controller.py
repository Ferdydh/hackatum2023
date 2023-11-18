from fastapi import APIRouter
from app.services import hello_service
from pydantic import BaseModel

router = APIRouter()


# TEST
@router.get("/test")
def hello_controller(query_string: str):
    result = hello_service.hello(query_string)
    return result


# Endpoints
# @router.post("/user_action")
# def user_action_controller(: str):
from fastapi import APIRouter
from app.services import hello_service

router = APIRouter()


@router.get("/test")
def hello_controller(query_string: str):
    result = hello_service.hello(query_string)
    return result

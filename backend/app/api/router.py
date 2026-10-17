from fastapi import APIRouter

from app.routes.characters import router as characters_router
from app.routes.questions import router as questions_router

api_router = APIRouter()

api_router.include_router(characters_router)
api_router.include_router(questions_router)

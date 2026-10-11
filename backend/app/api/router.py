from fastapi import APIRouter

from app.routes.characters import router as characters_router

api_router = APIRouter()

api_router.include_router(characters_router)

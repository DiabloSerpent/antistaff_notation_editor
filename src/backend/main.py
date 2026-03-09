from fastapi import APIRouter, FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

from src.backend.antistaff import DemoAntistaffSheet

app = FastAPI(title="Antistaff Notation Editor", version="1.0.0")

@app.get("/")
async def home() -> FileResponse:
    return FileResponse("./src/frontend/index.html")

examples_router = APIRouter(prefix="/examples", tags=["Examples"])

@examples_router.get("/{file_name}")
async def getExampleImage(file_name: str) -> FileResponse:
    return FileResponse(f"./examples/{file_name}")

app.include_router(examples_router)

app.mount("/", StaticFiles(directory="src/frontend"), name="static")
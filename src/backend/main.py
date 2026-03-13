from typing import Any

from fastapi import APIRouter, FastAPI
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from src.backend.antistaff import DemoAntistaffSheet, DemoNote, DemoNoteSizeChange, DemoSymbol, DemoBlank

# 34 squares wide x 44 squares long
# The graph paper I have uses 4 squares per inch and is 8.5'' x 11''
defaultWidth  = 34
defaultHeight = 44

sheets: list[DemoAntistaffSheet] = [DemoAntistaffSheet(defaultWidth, defaultHeight)]

for i in range(0,8):
    l = "ABCDEFGA"
    o = "012345678"
    sheets[0].contents[37+i] = DemoNote(l[i]+o[i])
    sheets[0].contents[34+37+i] = DemoNoteSizeChange(o[-i]+"\\"+o[i])
    sheets[0].contents[34*2+37+i] = DemoNote(l[i]+o[i])

app = FastAPI(title="Antistaff Notation Editor", version="1.0.0")


@app.get("/")
async def home() -> FileResponse:
    return FileResponse("./src/frontend/index.html")

@app.get("/favicon.ico")
async def getIcon() -> FileResponse:
    return FileResponse("AntistaffEditorIcon.ico")

examples_router = APIRouter(prefix="/examples", tags=["Examples"])


@examples_router.get("/{file_name}")
async def getExampleImage(file_name: str) -> FileResponse:
    # Could do a small validation check to ensure the thing being requested is just a file and not a path
    return FileResponse(f"./examples/{file_name}")


sheets_router = APIRouter(prefix="/sheets", tags=["Examples"])


@sheets_router.put("/{sheet_id}/{cell_id}")
async def getSheetCell(sheet_id: int, cell_id: int, new_cell_raw: dict) -> None:
    new_cell: DemoSymbol

    match (new_cell_raw["cls"]):
        case "n":
            new_cell = DemoNote(**new_cell_raw)
        case "c":
            new_cell = DemoNoteSizeChange(**new_cell_raw)
        case _:
            new_cell = DemoBlank()
    sheets[sheet_id].contents[cell_id] = new_cell
    return None

@sheets_router.delete("/{sheet_id}/{cell_id}")
async def deleteSheetCell(sheet_id: int, cell_id: int) -> None:
    sheets[sheet_id].contents[cell_id] = DemoBlank()
    return None

@sheets_router.get("/{sheet_id}")
async def getSheet(sheet_id: int) -> DemoAntistaffSheet:
    return sheets[sheet_id]


app.include_router(examples_router)
app.include_router(sheets_router)

app.mount("/", StaticFiles(directory="src/frontend"), name="static")

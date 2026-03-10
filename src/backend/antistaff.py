from pydantic import BaseModel, Field

# 34 squares wide x 44 squares long
# The graph paper I have uses 4 squares per inch and is 8.5'' x 11''
defaultWidth  = 34
defaultHeight = 44

type DemoSymbol = DemoBlank | DemoNote | DemoNoteSizeChange

class DemoBlank(BaseModel):
    cls: str = ""

class DemoNote(BaseModel):
    cls: str = "n"
    letter: str # A to G
    octave: str # 0 to 8
    # pitch_mod: str = "" # blank, n, s, f

class DemoNoteSizeChange(BaseModel):
    cls: str = "c"
    lh: str
    rh: str

class DemoAntistaffSheet(BaseModel):
    page_size: tuple[int,int]  = (defaultWidth, defaultHeight)
    contents: list[DemoSymbol] = [DemoBlank() for _ in range(0, defaultWidth * defaultHeight)]



class Symbol(BaseModel):
    pass
    # value: str = Field(alias="v")

class Note(BaseModel):
    # Total note range: A0 to C8
    letter: str # A to G
    octave: int # 0 to 8?
    pitch_mod: str = "" # blank, n, s, f
    arpeggio: bool = False

class Measure(BaseModel):
    time_sig: dict[str, int] = {"count": 4, "size": 4}
    # Should always have 7 notes, can't use Note class b/c it has a different visual format
    key: list[Symbol]
    pre_note_symbols: list[Symbol]
    rh_columns: list[Note | Symbol]
    rh_height: int = 1
    size_changes: list[Symbol]
    lh_columns: list[Note | Symbol]
    lh_height: int = 1
    width: int

class AntistaffSheet(BaseModel):
    page_size: tuple[int,int]
    title: str
    title_offset: tuple[int,int]
    first_measure_number: int = 1
    measures: list[Measure]
    measure_offset: tuple[int,int]




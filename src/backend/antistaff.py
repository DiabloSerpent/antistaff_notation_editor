from pydantic import BaseModel, Field

class DemoSymbol(BaseModel):
    pass

class DemoNote(DemoSymbol):
    letter: str # A to G
    octave: int # 0 to 8
    # pitch_mod: str = "" # blank, n, s, f

class DemoNoteSizeChange(DemoSymbol):
    lh_size: int
    rh_size: int

class DemoAntistaffSheet(BaseModel):
    page_size: tuple[int,int]
    contents: list[DemoSymbol]



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




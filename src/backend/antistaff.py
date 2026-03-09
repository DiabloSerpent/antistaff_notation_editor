from pydantic import BaseModel, Field


class Symbol(BaseModel):
    value: str = Field(alias="v")

class Note(BaseModel):
    # Total note range: A0 to C8
    letter: str # A to G
    octave: int # 0 to 8?
    pitch_mod: str = "" # blank, n, s, f
    arpeggio: bool = False

class Measure(BaseModel):
    time_sig: dict[str, int] = {"count": 4, "size": 4}
    key: list[Note] # Should always have 7 notes
    extra_symbols: list[Symbol]
    # Should be formatted: rh symbols, rh notes, note sizes, lh notes, lh symbols, lower symbols
    columns: list[Note | Symbol]
    height: int = 3
    width: int

class AntistaffSheet(BaseModel):
    page_size: tuple[int,int]
    title: str
    title_offset: tuple[int,int]
    first_measure_number: int = 1
    measures: list[Measure]
    measure_offset: tuple[int,int]




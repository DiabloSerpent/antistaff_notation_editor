import re
from typing import Any, ClassVar

from pydantic import BaseModel, Field

type DemoSymbol = DemoBlank | DemoNote | DemoNoteSizeChange

class DemoBlank(BaseModel):
    cls: str = ""

class DemoNote(BaseModel):
    str_format: ClassVar[re.Pattern] = re.compile(r"([A-G])([0-8])")

    cls: str = "n"
    letter: str # A to G
    octave: str # 0 to 8
    # pitch_mod: str = "" # blank, n, s, f

    def __init__(self, full_note: str | None = None, /, **kwds: Any) -> None:
        if full_note is not None:
            m: re.Match | None = re.fullmatch(self.str_format, full_note)

            if m is not None:
                super().__init__(
                    letter = m.group(1),
                    octave = m.group(2),
                    **kwds)
            else:
                # raise some validation error idk
                pass
        else:
            # Let pydantic handle the validation if kwargs were used
            super().__init__(**kwds)

class DemoNoteSizeChange(BaseModel):
    # Only note sizes from 1 to 64 are allowed, I don't see the point of making a special
    # case for 128 notes, if those even exist in the wild.
    str_format: ClassVar[re.Pattern] = re.compile(r"(\d\d?)\\(\d\d?)")

    cls: str = "c"
    lh: str
    rh: str

    def __init__(self, full_size_change: str | None = None, /, **kwds: Any) -> None:
        if full_size_change is not None:
            m: re.Match | None = re.fullmatch(self.str_format, full_size_change)

            if m is not None:
                super().__init__(
                    lh = m.group(1),
                    rh = m.group(2),
                    **kwds)
            else:
                # raise some validation error idk
                pass
        else:
            # Let pydantic handle the validation if kwargs were used
            super().__init__(**kwds)

class DemoAntistaffSheet(BaseModel):
    page_size: tuple[int,int]
    contents: list[DemoSymbol]

    def __init__(self, width_cells: int, height_cells: int, /, **kwds: Any) -> None:
        super().__init__(
            page_size=(width_cells, height_cells),
            contents=[DemoBlank() for _ in range(0, width_cells * height_cells)],
            **kwds
        )



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




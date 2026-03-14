(async () => {
    const baseApiUrl = "http://127.0.0.1:8000";

    const imageAspectRatio = 34 / 44;

    let asDiv = document.getElementById("container");

    let currentSheet = null;
    let totalSheets  = null;
    let mainSheet    = null;
    let pageSquares  = null;
    let mainCells    = null;
    
    let selectedCell = null;
    let CTX          = null;

    let pageWidth  = null;
    let pageHeight = null;
    let squareSize = null;

    setSheet(0);
    getTotalSheets();
    displayNoteSelector();

    async function getTotalSheets() {
        let r = await fetch(`${baseApiUrl}/sheets/amount`);
        totalSheets = await r.json();
        
        for (let i = 0; i < totalSheets; i++) {
            displayNewSheetTab(i);
        }
    }
    async function setSheet(id) {
        if (id === currentSheet) {
            return;
        }

        currentSheet = id;
        mainSheet = await getSheet(id);

        pageSquares = mainSheet.page_size;
        mainCells   = mainSheet.contents;

        displayAntistaffCanvas();
    }

    async function getSheet(id) {
        const r = await fetch(`${baseApiUrl}/sheets/${id}`);
        return r.json();
    }
    async function putCell(sheet_id, cell_id, new_contents) {
        fetch(`${baseApiUrl}/sheets/${sheet_id}/${cell_id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(new_contents),
        });
    }
    async function deleteCell(sheet_id, cell_id) {
        fetch(`${baseApiUrl}/sheets/${sheet_id}/${cell_id}`, {
            method: "DELETE",
        });
    }

    function displayAntistaffCanvas() {
        pageHeight = Math.floor(asDiv.offsetHeight * 0.99);
        pageWidth  = Math.floor(pageHeight * pageSquares[0] / pageSquares[1]);
        squareSize = pageWidth / pageSquares[0];

        asDiv.innerHTML = `
            <canvas id="main-display" width="${pageWidth}" height="${pageHeight}"></canvas>
        `;

        let asCanvas = document.getElementById("main-display");
        let ctx = asCanvas.getContext("2d");
        CTX = ctx;

        asCanvas.addEventListener("click", onCanvasClick);
        drawAntistaffCanvas(ctx);
    }
    document.getElementById("antistaff-editor").addEventListener("click", displayAntistaffCanvas);

    function onCanvasClick(e) {
        if (CTX === null) {
            // I don't think this is possible? Doesn't hurt to check.
            return;
        }
        
        if (e.detail > 1) {
            drawAntistaffCanvas(CTX);
            selectedCell = null;
            return;
        }
        else if (selectedCell !== null) {
            return;
        }

        let sx = Math.floor(e.offsetX / squareSize);
        let sy = Math.floor(e.offsetY / squareSize);

        selectedCell = sy * pageSquares[0] + sx;
        drawCellSelection(CTX, sx, sy);
    }

    function drawAntistaffCanvas(ctx) {
        ctx.clearRect(0, 0, pageWidth, pageHeight);
        drawGrid(ctx);
        drawSymbols(ctx);
    }

    function drawGrid(ctx) {
        ctx.beginPath();
        //Horizontal Lines
        for (let i = 0; i <= pageSquares[1]; i++) {
            ctx.moveTo(0, i * squareSize);
            ctx.lineTo(pageWidth, i * squareSize);
        }

        // Vertical Lines
        for (let i = 0; i <= pageSquares[0]; i++) {
            ctx.moveTo(i * squareSize, 0);
            ctx.lineTo(i * squareSize, pageHeight);
        }

        ctx.closePath();
        ctx.stroke();
    }

    function drawSymbols(ctx) {
        for (let x = 0; x < pageSquares[0]; x++) {
            for (let y = 0; y < pageSquares[1]; y++) {
                let c = mainCells[y*pageSquares[0] + x];
                let sx = squareSize * x;
                let sy = squareSize * y;

                switch (c.cls) {
                    case "n":
                        drawNote(ctx, sx, sy, c);
                        break;
                    case "c":
                        drawNoteSizeChange(ctx, sx, sy, c);
                        break;
                    default:
                }
            }
        }
    }

    function drawNote(ctx, sx, sy, c) {
        ctx.save();
        ctx.translate(sx+squareSize/2, sy+squareSize/2);
        ctx.rotate(45 * Math.PI / 180);
        let fs = Math.floor(0.7 * squareSize);
        ctx.font = `${fs}px sans-serif`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "end";
        ctx.fillText(`${c.letter}`, -1, 0);
        ctx.textAlign = "start";
        ctx.fillText(`${c.octave}`, 1, 0);
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(sx, sy+squareSize);
        ctx.lineTo(sx+squareSize, sy);
        ctx.closePath();
        ctx.stroke();
    }

    function drawNoteSizeChange(ctx, sx, sy, c) {
        ctx.save();
        ctx.translate(sx+squareSize/2, sy+squareSize/2);
        ctx.rotate(-45 * Math.PI / 180);
        let fs = Math.floor(0.7 * squareSize);
        ctx.font = `${fs}px sans-serif`;
        ctx.textBaseline = "middle";
        ctx.textAlign = "end";
        ctx.fillText(`${c.lh}`, -1, 0);
        ctx.textAlign = "start";
        ctx.fillText(`${c.rh}`, 1, 0);
        ctx.restore();

        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(sx+squareSize, sy+squareSize);
        ctx.closePath();
        ctx.stroke();
    }

    function drawCellSelection(ctx, sx, sy) {
        ctx.save();
        ctx.fillStyle = "rgba(150, 150, 150, 0.5)";
        ctx.beginPath();
        ctx.moveTo(sx*squareSize, sy*squareSize);
        ctx.lineTo(sx*squareSize, sy*squareSize+squareSize);
        ctx.lineTo(sx*squareSize+squareSize, sy*squareSize+squareSize);
        ctx.lineTo(sx*squareSize+squareSize, sy*squareSize);
        ctx.lineTo(sx*squareSize, sy*squareSize);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
    }

    function displayAntistaffExample() {
        pageWidth = pageHeight * imageAspectRatio;

        asDiv.innerHTML = `
            <img id="main-display" src="examples/witch_in_gold_antistaff.jpg" width="${pageWidth}" height="${pageHeight}"
            alt="IRL Witch in Gold Antistaff Version">
        `;
        CTX = null;
        selectedCell = null;
    }
    document.getElementById("antistaff-example").addEventListener("click", displayAntistaffExample);

    function displaySheetExample() {
        pageWidth = pageHeight * imageAspectRatio;

        asDiv.innerHTML = `
            <img id="main-display" src="examples/witch_in_gold_sheet.jpg" width="${pageWidth}" height="${pageHeight}"
            alt="IRL Witch in Gold Sheet Version">
        `;
        CTX = null;
        selectedCell = null;
    }
    document.getElementById("sheet-example").addEventListener("click", displaySheetExample);

    document.getElementById("symbol-type").addEventListener("change", e => {
        switch (e.target.value) {
            case "n":
                displayNoteSelector();
                break;
            case "c":
                displaySizeSelector();
                break;
        }
    });

    function displayNoteSelector() {
        let optDiv = document.getElementById("edit-options");
        optDiv.innerHTML = `
            <label>Letter:<select id="note-letter">
                <option value="A">A</option>
                <option value="B">B</option>
                <option value="C" selected="selected">C</option>
                <option value="D">D</option>
                <option value="E">E</option>
                <option value="F">F</option>
                <option value="G">G</option>
            </select></label>
            <label>Octave:<select id="note-octave">
                <option value="0">0</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4" selected="selected">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
            </select></label>
            <br>
            <button id="update-to-note">Update</button>
        `;
        document.getElementById("update-to-note").addEventListener("click", e => {
            e.preventDefault();

            if (selectedCell === null || CTX == null) {
                return;
            }

            let l = document.getElementById("note-letter").value;
            let o = document.getElementById("note-octave").value;
            let nc = {"cls": "n", "letter": l, "octave": o};
            mainCells[selectedCell] = nc;
            putCell(0, selectedCell, nc);
            
            selectedCell = null;
            drawAntistaffCanvas(CTX);
        });
    }

    function displaySizeSelector() {
        let optDiv = document.getElementById("edit-options");
        optDiv.innerHTML = `
            <label>Right-hand Size:<select id="rh-size">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4" selected="selected">4</option>
                <option value="8">8</option>
            </select></label>
            <br>
            <label>Left-hand Size:<select id="lh-size">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="4" selected="selected">4</option>
                <option value="8">8</option>
            </select></label>
            <br>
            <button id="update-to-size">Update</button>
        `;
        document.getElementById("update-to-size").addEventListener("click", e => {
            e.preventDefault();

            if (selectedCell === null || CTX == null) {
                return;
            }

            let rh = document.getElementById("rh-size").value;
            let lh = document.getElementById("lh-size").value;
            let nc = {"cls": "c", "rh": rh, "lh": lh};
            mainCells[selectedCell] = nc;
            putCell(0, selectedCell, nc);
            
            selectedCell = null;
            drawAntistaffCanvas(CTX);
        });
    }

    document.getElementById("clear-cell").addEventListener("click", e => {
        e.preventDefault();

        if (selectedCell === null || CTX === null) {
            return;
        }

        mainCells[selectedCell] = {cls: ""};
        deleteCell(0, selectedCell);

        selectedCell = null;
        drawAntistaffCanvas(CTX);
    });

    function displayNewSheetTab(id) {
        let tabBar = document.getElementById("sheet-tab-buttons");

        let btn = document.createElement("button");
        btn.id = `page-${id}`;
        btn.classList.add("tab-button");
        btn.innerText = `Page ${id+1}`;
        btn.addEventListener("click", onSheetTabButtonClick);

        tabBar.append(btn);
    }

    function onSheetTabButtonClick(e) {
        // Could maybe make it so that events that have a higher click tally than 1 aren't considered.
        // Not necessary tho.
        setSheet(parseInt(e.srcElement.id.substring(5)));
    }

    document.getElementById("add-sheet").addEventListener("click", e => {
        let new_width_el  = document.getElementById("new-sheet-width");
        let new_height_el = document.getElementById("new-sheet-height");

        let new_width  = parseInt(new_width_el.value);
        let new_height = parseInt(new_height_el.value);

        fetch(`${baseApiUrl}/sheets/?width=${new_width}&height=${new_height}`, {
            method: "POST",
        });

        new_width_el.value  = "";
        new_height_el.value = "";

        displayNewSheetTab(totalSheets);
        setSheet(totalSheets);
        totalSheets += 1;
    });

    document.getElementById("delete-sheet").addEventListener("click", e => {
        // fetch(`${baseApiUrl}/sheets/${currentSheet}`, {
        //     method: "DELETE",
        // });
    });
})();
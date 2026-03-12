(async () => {
    const baseApiUrl = "http://127.0.0.1:8000";

    let mainSheet   = await getSheet(0);
    let pageSquares = mainSheet.page_size;
    let mainCells   = mainSheet.contents;

    let asDiv = document.getElementById("container");
    let selectedCell = null;
    let CTX = null;
    
    const pageWidth = 500;
    
    const pageAspectRatio = pageSquares[1] / pageSquares[0];
    const pageHeight      = pageWidth * pageAspectRatio;
    const squareSize      = pageWidth / pageSquares[0];

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
        asDiv.innerHTML = `
            <canvas id="as-grid" width="${pageWidth}" height="${pageHeight}"></canvas>
        `;

        let asCanvas = document.getElementById("as-grid");
        // console.dir(asCanvas);
        let ctx = asCanvas.getContext("2d");
        CTX = ctx;

        asCanvas.addEventListener("click", onCanvasClick);
        drawAntistaffCanvas(ctx);
    }
    document.getElementById("antistaff-editor").addEventListener("click", displayAntistaffCanvas);
    displayAntistaffCanvas();

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
        asDiv.innerHTML = `
            <img src="examples/witch_in_gold_antistaff.jpg" width="${pageWidth}" height="${pageHeight}"
            alt="IRL Witch in Gold Antistaff Version">
        `;
        CTX = null;
        selectedCell = null;
    }
    document.getElementById("antistaff-example").addEventListener("click", displayAntistaffExample);

    function displaySheetExample() {
        asDiv.innerHTML = `
            <img src="examples/witch_in_gold_sheet.jpg" width="${pageWidth}" height="${pageHeight}"
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
            // console.log(nc);
            mainCells[selectedCell] = nc;
            putCell(0, selectedCell, nc);
            
            selectedCell = null;
            drawAntistaffCanvas(CTX);
        });
    }
    displayNoteSelector();

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
})();
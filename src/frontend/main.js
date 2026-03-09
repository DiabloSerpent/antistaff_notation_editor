{
    // 34 squares wide x 44 squares long
    // The graph paper I have uses 4 squares per inch, so that's 8.5'' x 11''
    const pageSquares = [34, 44];
    const pageWidth   = 500;
    
    const pageAspectRatio = pageSquares[1] / pageSquares[0];
    const pageHeight      = pageWidth * pageAspectRatio;
    const squareSize      = pageWidth / pageSquares[0];

    let asDiv = document.getElementById("container");

    function drawAntistaffCanvas() {
        asDiv.innerHTML = `
            <canvas id="as-grid" width="${pageWidth}" height="${pageHeight}"></canvas>
        `;

        let asCanvas = document.getElementById("as-grid");
        let ctx = asCanvas.getContext("2d");
        drawGrid(ctx);
    }
    document.getElementById("antistaff-editor").addEventListener("click", drawAntistaffCanvas);

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

    function displayAntistaffExample() {
        asDiv.innerHTML = `
            <img src="examples/witch_in_gold_antistaff.jpg" width="${pageWidth}" height="${pageHeight}" alt="IRL Witch in Gold Antistaff Version">
        `;
    }
    document.getElementById("antistaff-example").addEventListener("click", displayAntistaffExample);

    function displaySheetExample() {
        asDiv.innerHTML = `
            <img src="examples/witch_in_gold_sheet.jpg" width="${pageWidth}" height="${pageHeight}" alt="IRL Witch in Gold Sheet Version">
        `;
    }
    document.getElementById("sheet-example").addEventListener("click", displaySheetExample);

    drawAntistaffCanvas();
}
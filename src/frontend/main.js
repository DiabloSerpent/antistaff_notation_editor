{
    // 34 squares wide x 44 squares long
    // The graph paper I have uses 4 squares per inch, so that's 8.5'' x 11''
    const pageSquares = [34, 44];
    const pageWidth   = 150;
    
    const pageAspectRatio = pageSquares[1] / pageSquares[0];
    const pageHeight      = pageWidth * pageAspectRatio;
    const squareSize      = pageWidth / pageSquares[0];

    let asDiv = document.getElementById("antistaff-container");
    asDiv.innerHTML = `
        <canvas id="as-grid" width="${pageWidth}" height="${pageHeight}"></canvas>
    `;
}
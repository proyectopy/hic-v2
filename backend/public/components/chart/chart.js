function drawChart(ctx, series) {

    if (!series) return;

    ctx.clearRect(0, 0, 900, 250);

    function line(data, color) {

        ctx.beginPath();

        data.forEach((p, i) => {

            const x = i * 4;
            const y = 250 - p.v * 2;

            if (i === 0)
                ctx.moveTo(x, y);
            else
                ctx.lineTo(x, y);

        });

        ctx.strokeStyle = color;
        ctx.stroke();

    }

    line(series.cpu, "#22c55e");
    line(series.ram, "#60a5fa");

}

window.drawChart = drawChart;
const w = 800,
      h = 500;

const margin = {top: 50, right: 30, bottom: 20, left: 30};

function drawBar(dataset) {

    const svg = d3.select("#bar-chart")
    .append("svg")
    .style("background-color", "gray")
    .attr("width", w +margin.left + margin.right)
    .attr("height", h + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.top + "," + margin.bottom + ")");

    let yearsDate = dataset.map(item => {
        return item[0];
    });

    let minDate = new Date(d3.min(yearsDate, d => d));

    let maxDate = new Date(d3.max(yearsDate, d => d));
    maxDate.setMonth(maxDate.getMonth() + 3);

    let xAxisScale = d3.scaleTime()
    .domain([minDate, maxDate])
    .range([0, w]);

    let xAxis = d3.axisBottom().scale(xAxisScale);

    let xAxisGroup = svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0, " + h + ")")
    .call(xAxis);

    let gdp = dataset.map(item => item[1]);
    
    gdp.push(gdp[gdp.length-1] + (20000 - gdp[gdp.length-1]));
    
    let maxGdp = d3.max(gdp, d => d);
    
    console.log(gdp);
    
    let yAxisScale = d3.scaleLinear()
    .domain([0, maxGdp])
    .range([h, 0]);

    let yAxis = d3.axisLeft(yAxisScale);

    let yAxisGroup = svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + w + ", 0)")
    .attr("transform", "rotate(0)")
    .call(yAxis);

    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .style("fill", "cyan")
        .attr("x", (d, i) => i * (w/dataset.length))
        .attr("y", d => yAxisScale(d[1]))
        .attr("width", d => w/dataset.length)
        .attr("height", d => h - yAxisScale(d[1]));

}


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then((data) => {
    var dataset = data.data;
    drawBar(dataset);
});



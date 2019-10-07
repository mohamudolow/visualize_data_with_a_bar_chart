const w = 500,
      h = 500,
      padding = 40;

const margin = {top: 50, right: 30, bottom: 20, left: 30};

function drawBar(dataset) {
    
    let minDate = d3.min(dataset, d => d[0].substr(0, 4));
            minDate = new Date(minDate);
    
    let maxDate = d3.max(dataset, d => d[1]);
            maxDate = new Date(maxDate);
    
    let xAxisScale = d3.scaleTime()
                    .domain([minDate, maxDate])
                    .range([0, w]);
    
     let yAxisScale = d3.scaleLinear()
                        .domain([0, d3.max(dataset, d => d[1])])
                        .range([h, 0]);
    
    let xAxis = d3.axisBottom(xAxisScale);
    let yAxis = d3.axisLeft(xAxisScale);
    
  
    const svg = d3.select("#bar-chart")
                .append("svg")
                .style("background-color", "gray")
                .attr("width", w + margin.left + margin.right)
                .attr("height", h + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate(" + margin.left + "," + margin.right + ")");
    
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
    console.log(dataset.length);
    drawBar(dataset);
});

//d3.min(dataset, d => d[1]), [d3.max(dataset, d => d[1])]


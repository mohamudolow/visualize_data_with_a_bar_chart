const w = 800,
      h = 500;

const margin = {top: 50, right: 30, bottom: 20, left: 30};


const svg = d3.select("#bar-chart")
.append("svg")
.style("background-color", "gray")
.attr("width", w +margin.left + margin.right)
.attr("height", h + margin.top + margin.bottom)
.append("g")
.attr("transform", "translate(" + margin.top + "," + margin.bottom + ")");


let tooltip = d3.select("#bar-chart")
.append("div")
.attr("id", "tooltip")
.style("opacity", 0);


function drawBar(dataset) {
    
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

    svg.append("text")
        .attr("x", w/3)
        .attr("y", h + 40)
        .text("More Information: http://www.bea.gov/national/pdf/nipaguid.pdf")
        .style("z-index", 4);
    
    let gdp = dataset.map(item => item[1]);

    gdp.push(gdp[gdp.length-1] + (20000 - gdp[gdp.length-1]));

    let yAxisScale = d3.scaleLinear()
    .domain([0, gdp[gdp.length-2]])
    .range([h, 0]);

    let yAxis = d3.axisLeft(yAxisScale);

    let yAxisGroup = svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", "translate(" + w + ", 0)")
    .attr("transform", "rotate(0)")
    .call(yAxis);

    
    svg.append("text")
        .attr("x", -300)
        .attr("y", yAxisScale(dataset[(dataset.length-1)/2][1])/10 - 20)
        .attr("transform", "rotate(-90)")
        .text("Gross Domestic Product");
    
    svg.selectAll("rect")
        .data(dataset)
        .enter()
        .append("rect")
        .style("fill", "cyan")
        .attr("x", (d, i) => i * (w/dataset.length))
        .attr("y", d => yAxisScale(d[1]))
        .attr("width", d => w/dataset.length)
        .attr("height", d => h - yAxisScale(d[1]))
        .on("mouseover", function(d, i) {
        tooltip.transition()
            .duration(200)
            .style("opacity", .7)
            .style("left", (d3.event.pageX - 20) +'px')
            .style("top", (d3.event.pageY + 15) + 'px')

        let quarter;
        var month = d[0].substr(5, 2);

        if(month === '01') {
            quarter = 'Q1';
        } else if(month === '04') {
            quarter = 'Q2';
        } else if(month === '07') {
            quarter = 'Q3';
        } else if(month === '10') {
            quarter = 'Q4';
        }
        
        let year = d[0].substr(0,4) + ' ' + quarter;

        tooltip.html("<p>" + year + "</p><p>$" + d[1] + " billions");
        d3.select(this).style("fill", "#fff");
    })
    .on("mouseout", function() {
        tooltip.transition()
            .duration(300)
            .style("opacity", 0);
        d3.select(this).style("fill", "cyan");
    });
}


d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json").then((data) => {
    var dataset = data.data;
    drawBar(dataset);
});



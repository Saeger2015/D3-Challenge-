var svgWidth = 900;
var svgHeight = 600;

var margin = {
    top: 20,
    right: 40,
    bottom: 80,
    left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// SVG 
var svg = d3.select("#scatter")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight)
    .attr("class", "chart");

const chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Import Data
d3.csv("assets/data/data.csv").then(function (Jdata) {


    console.log(Jdata);

    // Parse Data/Cast as numbers
    Jdata.forEach(function (data) {
        data.age = +data.age;
        data.smokes = +data.smokes;
    });

    let copyJdata = JSON.parse(JSON.stringify(Jdata));;

    // Create scale functions  
    var xLinearScale = d3.scaleLinear()
        .domain([5, d3.max(Jdata, d => d.smokes)])
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([28, d3.max(Jdata, d => d.age)])
        .range([height, 0]);

    // Create axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // Append Axes to the chart
    chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis);

    chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);


    // Create Circles
    let circle = chartGroup.selectAll("circle")
        .data(Jdata)
        .enter()
        .append("circle")
        .attr("cx", d => xLinearScale(d.smokes))
        .attr("cy", (d, i) => { console.log(i); return yLinearScale(d.age) })
        .attr("r", "15")
        .attr("fill", "pink")
        .attr("stroke", "black")
        .attr("stroke-width", "3")
        .attr("opacity", ".75");



    // Tool tip
    var tool_tip = d3.tip()
        .attr("class", "d3-tip")
        .offset([-8, 10])
        .html((d) => { return d.abbr; });
    svg.call(tool_tip);

    // Mouse over tool tip 
    circle.on("mouseover", function (data) {
        tool_tip.show(data, this);
    })

        .on("mouseout", function (data, index) {
            tool_tip.hide(data);
        });


    // Text Labels

    let text = chartGroup.selectAll(".silly-me")
        .data(Jdata)
        .enter()
        .append("text")
        .classed("silly-me", true);
    //text;

    let textLabels = text.attr("x", d => xLinearScale(d.smokes))
        .attr("y", d => yLinearScale(d.age))
        .attr("font-family", "sans-serif")
        .attr("font-size", "10px")
        .attr("fill", "black")
        .attr("font-weight", "bold")
        .attr("text-anchor", "middle")
        .text((d, i) => { console.log(i); return d.abbr; });
    //textLabels;             



    // Axes labels
    chartGroup.append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - margin.left + 40)
        .attr("x", 0 - (height / 2))
        .attr("dy", "1em")
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Smokers");


    chartGroup.append("text")
        .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
        .attr("class", "axisText")
        .attr("font-weight", "bold")
        .text("Age");
}).catch(function (error) {
    console.log(error);


});
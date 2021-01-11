var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select(".scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

  // Initial Params
var chosenXAxis = "healthcare";

//Data
var demoData = await d3.csv("D3_data_journalism/data/data.csv");

// Parse Data/Cast as numbers
  demoData.forEach(function(data) {
    data.healthcare = +data.healthcare;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
  });

//  scale functions
var xLinearScale = xScale(demoData, chosenXAxis);
var yLinearScale = yScale(demoData, chosenYAxis);

// Init axis functions
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);

// Append x and y axes to the chart
var xAxis = chartGroup.append("g")
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

var yAxis = chartGroup.append("g")
  .call(leftAxis);

// Create circles
var circlesGroup = chartGroup.selectAll("g circle")
  .data(stateData)
  .enter()
  .append("g");

var circlesXY = circlesGroup.append("circle")
  .attr("cx", d => xLinearScale(d[chosenXAxis]))
  .attr("cy", d => yLinearScale(d[chosenYAxis]))
  .attr("r", 15)
  .classed("demoCircle", true);

var circlesText = circlesGroup.append("text")
  .text(d => d.abbr)
  .attr("dx", d => xLinearScale(d[chosenXAxis]))
  .attr("dy", d => yLinearScale(d[chosenYAxis]) + 5)
  .classed("demoText", true);

// X labels
var xlabelsGroup = chartGroup.append("g")
  .attr("transform", `translate(${width / 2}, ${height})`);

var incomeLabel = xlabelsGroup.append("text")
  .attr("x", 0)
  .attr("y", 80)
  .attr("value", "income") 
  .text("Household Income (Median)")
  .classed("inactive", true);

// Y labels
var ylabelsGroup = chartGroup.append("g");

var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("value", "healthcare") 
    .text("Lacks Healthcare (%)")
    .classed("active", true);

var obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -80)
    .attr("value", "obesity") 
    .text("Obese (%)")
    .classed("inactive", true);

//Tool Tips

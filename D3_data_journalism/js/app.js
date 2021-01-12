var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "healthcare";

// Retrieve data from the CSV file and execute everything below
d3.csv("D3_data_journalism/data/data.csv").then(function(demoData, err) {
  if (err) throw err;

  //Parse Data
  demoData.forEach(function(data) {
    data.poverty    = +data.poverty;
    data.healthcare = +data.healthcare;
    data.age        = +data.age;
    data.smokes     = +data.smokes;
    data.obesity    = +data.obesity;
    data.income     = +data.income;
    });
  
  console.log(demoData);

//Init scale
var xLinearScale = xScale(demoData, chosenXAxis);
var yLinearScale = yScale(demoData, chosenYAxis);

// Initialize axis 
let bottomAxis = d3.axisBottom(xLinearScale);
let leftAxis = d3.axisLeft(yLinearScale);

  ///111111111
  // Append Axes to the chart
  chartGroup.append("g")
    .attr("transform", `translate(0, ${height})`)
    .call(bottomAxis);

  chartGroup.append("g")
    .call(leftAxis);

  // Create Circles
  var circlesGroup = chartGroup.selectAll("g circle")
    .data(demoData)
    .enter()
    .append("g");

  var circlesPost = circlesGroup
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("r", 15)
    .attr("stateCircle", true);

  var circlesText = circlesGroup
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]))
    .classed("stateText", true);

//Axis labels
  var xlabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  var povertyLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 40)
    .attr("value", "poverty") 
    .text("In Poverty (%)")
    .classed("active", true);

  var ageLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 60)
    .attr("value", "age") 
    .text("Age (Median)")
    .classed("inactive", true);

  var incomeLabel = xlabelsGroup.append("text")
    .attr("x", 0)
    .attr("y", 80)
    .attr("value", "income") 
    .text("Household Income (Median)")
    .classed("inactive", true);








  // Tool Tip
  var toolTip = d3.tip()
    .attr("class", "tooltip")
    .offset([80, -60])
    .text(function(data) {
       return data.abbr;})

  // append tool tip
  chartGroup.call(toolTip);

  // event listeners
  circlesGroup.on("click", function (data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function (data, index) {
      toolTip.hide(data);
    });

  // Create axes labels
  chartGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left + 40)
    .attr("x", 0 - (height / 2))
    .attr("dy", "1em")
    .attr("class", "axisText")
    .style("fill", "black")
    .style("font", "20px sans-serif")
    .style("font-weight", "bold")
    .text("People without Healthcare (%)");

  chartGroup.append("text")
    .attr("transform", `translate(${width / 2}, ${height + margin.top + 30})`)
    .attr("class", "axisText")
    .style("font", "20px sans-serif")
    .style("font-weight", "bold")
    .text(")Obesity (%)");

  }).catch(function (error) {
  console.log(error);
});


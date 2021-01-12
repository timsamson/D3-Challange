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

// Y labels
  var ylabelsGroup = chartGroup.append("g");

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -40)
    .attr("value", "healthcare")
    .text("Lacks Healthcare (%)")
    .classed("active", true);

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -60)
    .attr("value", "smokes")
    .text("Obese (%)")
    .classed("inactive", true);
    
  var obeseLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", -(height / 2))
    .attr("y", -80)
    .attr("value", "obesity")
    .text("Obese (%)")
    .classed("inactive", true);

  // Tool Tips 
  var circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

  //lister events
  //X Axis

  xlabelsGroup.selectAll("text")
  .on("click", function() {

  var selectValue = d3.select(this).attr("value");
  if (selectValue !== chosenXAxis) {

    chosenXAxis = selectValue;
      //Pull values for selection
      xLinearScale = xScale(stateData, chosenXAxis);
      xAxis = renderXAxes(xLinearScale, xAxis);
      circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);
      circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);
      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

      if (chosenXAxis === "age") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenXAxis === "income") {
        povertyLabel
          .classed("active", false)
          .classed("inactive", true);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      else {
        povertyLabel
          .classed("active", true)
          .classed("inactive", false);
        ageLabel
          .classed("active", false)
          .classed("inactive", true);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
    }
  });

  //Y Axis
  ylabelsGroup.selectAll("text")
    .on("click", function() {

    Var selectValue = d3.select(this).attr("value");
    if (value !== chosenYAxis) {


      chosenYAxis = value;
      yLinearScale = yScale(stateData, chosenYAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);
      circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);
      circlesText = renderYText(circlesText, yLinearScale, chosenYAxis);
      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis);

      if (chosenYAxis === "smokes") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      }

      else if (chosenYAxis === "healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obeseLabel
          .classed("active", true)
          .classed("inactive", false);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      }
    }
  });

  }).catch(function (error) {
  console.log(error);
});


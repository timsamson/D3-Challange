function makeResponsive() {

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

  // Function for Updating xScale Upon Click on Axis Label
  function xScale(demoData, chosenXAxis) {
    var xLinearScale = d3.scaleLinear()
      .domain([d3.min(demoData, d => d[chosenXAxis]) * 0.9,
        d3.max(demoData, d => d[chosenXAxis])* 1.1])
      .range([0, width]);
    return xLinearScale;
  }

  // Function for Updating yScale Upon Click on Axis Label
  function yScale(demoData, chosenYAxis) {
    var yLinearScale = d3.scaleLinear()
      .domain([d3.min(demoData, d => d[chosenYAxis]) -1,
        d3.max(demoData, d => d[chosenYAxis]) +1])
      .range([height, 0]);
    return yLinearScale;
  }

  // Function for Updating xAxis Upon Click on Axis Label
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // Function for Updating yAxis Upon Click on Axis Label
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // Function for Updating Circles Group with a Transition to New Circles
  function renderCircles(circlesGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]))
      .attr("cy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

  // Function for Updating Text Group with a Transition to New Text
  function renderText(textGroup, newXScale, chosenXAxis, newYScale, chosenYAxis) {

    textGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]))
      .attr("dy", d => newYScale(d[chosenYAxis]))
      .attr("text-anchor", "middle");
    return textGroup;
  }

  // Function for Updating Circles Group with New Tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup) {

    if (chosenXAxis === "poverty") {
      var xLabel = "Poverty (%)";
    }
    else if (chosenXAxis === "age") {
      var xLabel = "Age (Median)";
    }
    else {
      var xLabel = "Household Income (Median)";
    }
    if (chosenYAxis === "healthcare") {
      var yLabel = "Lacks Healthcare (%)";
    }
    else if (chosenYAxis === "obesity") {
      var yLabel = "Obese (%)";
    }
    else {
      var yLabel = "Smokes (%)";
    }
  
// Initialize Tool Tip
toolTip = d3
    .tip()
    .attr("class", "tooltip d3-tip")
    .offset([90, 90])
    .html(function(d) {
      return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
  });

// Create Text Tooltip in the Chart
textGroup.call(toolTip);
// Create Event Listeners to Display and Hide the Text Tooltip
textGroup.on("mouseover", function(data) {
  toolTip.show(data, this);
})
  // onmouseout Event
  .on("mouseout", function(data) {
    toolTip.hide(data);
  });
return circlesGroup;
}

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
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);


  // Append Axes to the chart
var xAxis = chartGroup.append("g")
  .classed("x-axis", true)
  .attr("transform", `translate(0, ${height})`)
  .call(bottomAxis);

// Append yAxis to the Chart
var yAxis = chartGroup.append("g")
  .classed("y-axis", true)
  .call(leftAxis);

  // Create Circles
  var circlesXY = chartGroup.selectAll(".stateCircle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("class", "stateCircle")
    .attr("r", 15)
    .attr("opacity", ".75");

    var textGroup = chartGroup.selectAll(".stateText")
    .data(demoData)
    .enter()
    .append("text")
    .attr("dx", d => xLinearScale(d[chosenXAxis]))
    .attr("dy", d => yLinearScale(d[chosenYAxis]*.98))
    .text(d => (d.abbr))
    .attr("class", "stateText")
    .attr("font-size", "12px")
    .attr("text-anchor", "middle")
    .attr("fill", "white");

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
  var ylabelsGroup = chartGroup.append("g")
    .attr("transform", `translate(${width / 2}, ${height})`);

  var healthcareLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (height / 2))
    .attr("y", - (width/2) -50)
    .attr("value", "healthcare")  
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Lacks Healthcare (%)")
    .classed("active", true);

  var smokesLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (height / 2))
    .attr("y", - (width/2) -70)
    .attr("value", "smokes")
    .classed("axis-text", true)
    .attr("dy", "1em")
    .text("Smoker (%)")
    .classed("inactive", true);
    
  var obesityLabel = ylabelsGroup.append("text")
    .attr("transform", "rotate(-90)")
    .attr("x", (height / 2))
    .attr("y", - (width/2) -90)
    .attr("value", "obesity")
    .attr("dy", "1em")
    .classed("axis-text", true)
    .text("Obese (%)")
    .classed("inactive", true);

  // Tool Tips 
  var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup, textGroup);
  //lister events
  //X Axis

  xlabelsGroup.selectAll("text")
  .on("click", function() {

  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    chosenXAxis = value;
      //Pull values for selection
      xLinearScale = xScale(demoData, chosenXAxis);
      xAxis = renderXAxes(xLinearScale, xAxis);
      circlesXY = renderCircles(circlesXY, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);
      circlesText = renderText(textGroup, xLinearScale, chosenXAxis, yLinearScale, chosenYAxis);
      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis, textGroup);

      if (chosenXAxis === "poverty") {
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
      else if (chosenXAxis === "age") {
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
      else {
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
    }
  });

  //Y Axis
  ylabelsGroup.selectAll("text")
    .on("click", function() {

    var value = d3.select(this).attr("value");
    if (value !== chosenYAxis) {

      chosenYAxis = value;
      yLinearScale = yScale(demoData, chosenYAxis);
      yAxis = renderYAxes(yLinearScale, yAxis);
      circlesXY = renderCircles(circlesXY, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);
      circlesText = renderText(textGroup, yLinearScale, chosenYAxis, xLinearScale, chosenXAxis);
      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis, textGroup);
      if (chosenYAxis === "healthcare") {
        healthcareLabel
          .classed("active", true)
          .classed("inactive", false);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else if (chosenYAxis === "obesity") {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", true)
          .classed("inactive", false);
        incomeLabel
          .classed("active", false)
          .classed("inactive", true);
      }
      else {
        healthcareLabel
          .classed("active", false)
          .classed("inactive", true);
        obesityLabel
          .classed("active", false)
          .classed("inactive", true);
        smokesLabel
          .classed("active", true)
          .classed("inactive", false);
      }
      }
    }
  );
});
}
makeResponsive();

// When Browser Window is Resized, makeResponsive() is Called
d3.select(window).on("resize", makeResponsive);
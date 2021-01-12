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

// Function for xScale 
function xScale(demoData, chosenXAxis) {
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d[chosenXAxis]) * 0.9,
      d3.max(demoData, d => d[chosenXAxis])* 1.1])
    .range([0, width]);
  return xLinearScale;
  }

// Function for yScale 
function yScale(demoData, chosenYAxis) {
  var yLinearScale = d3.scaleLinear()
    .domain([d3.min(demoData, d => d[chosenYAxis]) -1,
      d3.max(demoData, d => d[chosenYAxis]) +1])
    .range([height, 0]);
  return yLinearScale;
  }

  // Function for xAxis
  function renderXAxes(newXScale, xAxis) {
    var bottomAxis = d3.axisBottom(newXScale);
    xAxis.transition()
      .duration(1000)
      .call(bottomAxis);
    return xAxis;
  }

  // Function for yAxis
  function renderYAxes(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
    return yAxis;
  }

  // Functions for Circles X and Y
  function renderXCircles(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  function renderYCircles(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

  // Functions for Circle State Label X and Y

  function renderXText(circlesGroup, newXScale, chosenXAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("dx", d => newXScale(d[chosenXAxis]));
  
    return circlesGroup;
  }
  
  function renderYText(circlesGroup, newYScale, chosenYAxis) {
    circlesGroup.transition()
      .duration(1000)
      .attr("dy", d => newYScale(d[chosenYAxis])+5);
  
    return circlesGroup;
  }

  // Function for Updating Circles Group with New Tooltip
  function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

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
  var toolTip = d3.tip()
      .attr("class", "toolTip d3-tip")
      .offset([90, 90])
      .html(function(d) {
        return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
    });

  // Create Tooltip
  circlesGroup.call(toolTip);

  // Event Listeners
  circlesGroup.on("mouseover", function(data) {
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

  // Init axis 
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
  var circlesGroup = chartGroup.selectAll("g circle")
    .data(demoData)
    .enter()
    .append("g");
  
  var circlesXY = chartGroup.selectAll(".stateCircle")
    .data(demoData)
    .enter()
    .append("circle")
    .attr("cx", d => xLinearScale(d[chosenXAxis]))
    .attr("cy", d => yLinearScale(d[chosenYAxis]))
    .attr("class", "stateCircle")
    .attr("r", 15)
    .attr("opacity", ".75");

  var circlesText = chartGroup.selectAll(".stateText")
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
    .text("Below Poverty")
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
    .text("Household Income")
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
    .text("Without Healthcare (%)")
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
  circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

  //listener events for labels
  xlabelsGroup.selectAll("text")
  .on("click", function() {

  var value = d3.select(this).attr("value");
  if (value !== chosenXAxis) {

    chosenXAxis = value;
      //Pull values for selection
      xLinearScale = xScale(demoData, chosenXAxis);
      xAxis = renderXAxes(xLinearScale, xAxis);
      circlesXY = renderXCircles(circlesXY, xLinearScale, chosenXAxis);
      circlesText = renderXText(circlesText, xLinearScale, chosenXAxis);
      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis, circlesText);

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
      circlesXY = renderYCircles(circlesXY, yLinearScale, chosenYAxis);
      circlesText = renderYText(circlesText, yLinearScale, chosenYAxis, );
      circlesGroup = updateToolTip(circlesGroup, chosenXAxis, chosenYAxis, circlesText);
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

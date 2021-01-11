var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3.select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Retrieve data from the CSV file and execute everything below
d3.csv("D3_data_journalism/data/data.csv").then(function(demoData) {

  // Step 1: Parse Data/Cast as numbers
  // ==============================
  demoData.forEach(function(data) {
    data.obesity = +data.obesity;
    data.income = +data.income;
    data.healthcare = +data.healthcare;

    });

    console.log(demoData);

// Create scales
var xLinearScale = d3.scaleLinear()
  .domain([20, d3.max(demoData, d => d.healthcare)])
  .range([0, width]);

var yLinearScale = d3.scaleLinear()
  .domain([0, d3.max(demoData, d => d.obesity)])
  .range([height, 0]);
  
// Create Axis
var bottomAxis = d3.axisBottom(xLinearScale);
var leftAxis = d3.axisLeft(yLinearScale);
  
// amend axis(s) to chart
chart.append("g")
.attr("transform", `translate(0, ${height})`)
.call(bottomAxis);

chart.append("g")
.call(leftAxis);

//Create Circles Draft
var circlesGroup = chart.selectAll("circle")
.data(demoData)
.enter()
.append("circle")
.attr("cx", d => xLinearScale(d.obesity))
.attr("cy", d => yLinearScale(d.healthcare))
.attr("r", "15")
.attr("fill", "pink")
.attr("opacity", ".5");

//Init tool tip
var toolTip = d3.tip()
.attr("class", "tooltip")
.offset([80, -60])
.html(function(d) {
  return (`${d.income }`);
});

// create chart
chart.call(toolTip);





  });

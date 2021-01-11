var svgWidth = 900;
var svgHeight = 500;

var margin = { top: 20, right: 40, bottom: 80, left: 100 };

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper
var svg = d3
  .select(".chart")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Append an SVG group
var chart = svg.append("g");

// Append a div
d3.select(".chart").append("div").attr("class", "tooltip").style("opacity", 0);

// Retrieve data from the CSV file and execute everything below
d3.csv("D3_data_journalism/data/data.csv", function(demoData) {
    // if (err) throw err; (err, demoData)
  
    demoData.forEach(function(d) {
      d.income = +d.income;
      d.healthcare= +d.healthcare;
      d.obesity = +d.obesity;
    });
  
    console.log(demoData);


  // Create scales
  var yLinearScale = d3.scaleLinear().range([height, 0]);
  var xLinearScale = d3.scaleLinear().range([0, width]);

  // // Create axiss
  // var bottomAxis = d3.axisBottom(xLinearScale);
  // var leftAxis = d3.axisLeft(yLinearScale);

  // // Variables store minimum and maximum values in a column in data.csv
  // var xMin;
  // var xMax;
  // var yMax;

  });

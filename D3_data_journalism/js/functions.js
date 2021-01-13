
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
    var xLabel = ""
    var yLabel = ""

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
    toolTip = d3.tip()
        .attr("class", "d3-tip")
        .offset([50, -75])
        .html(function(d) {
          return (`<strong>${d.abbr}</strong><br>${xLabel} ${d[chosenXAxis]}<br>${yLabel} ${d[chosenYAxis]}`);
        });

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

    
// function analysis(chosenXAxis, chosenYAxis) {

  function writeArticle(chosenXAxis, chosenYAxis) {
    var articleText = parent.document.getElementById('article_text');
  
    var responses = ["<h3>Poverty V. Obese</h3><br> insert text here",
                    "<h3>poverty V. Smokes</h3>",
                    "poverty V. Healthcare",
                    "Age V. Obese",
                    "Age V. Smokes",
                    "Age V. Healthcare",
                    "Income V. Obese",
                    "Income V. Smokes",
                    "Income V. Healthcare",];
  
    var answer = "";

    if (chosenXAxis === "poverty") {
      if (chosenYAxis === "obese") {
        answer = responses[0];
      }
      else if (chosenYAxis === "Smoker"){
        answer = responses[1];
      }
      else {
        answer = response[2];
      }
    }
    else if (chosenXAxis === "age") {
      if (chosenYAxis === "obese") {
        answer = responses[3];
      }
      else if (chosenYAxis === "Smoker"){
        answer = responses[4];
      }
      else {
        answer = response[5];
      }
    }
    else {
      if (chosenYAxis === "income") {
        answer = responses[6];
      }
      else if (chosenYAxis === "Smoker"){
        answer = responses[7];
      }
      else {
        answer = response[8];
      }

    articleText = answer;
  };

};

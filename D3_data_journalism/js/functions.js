
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
      .attr("dy", d => newYScale(d[chosenYAxis]));
    return circlesGroup;
  }

  // format currency
var formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// function used for updating circles group with new tooltip
function updateToolTip(circlesGroup, chosenXAxis, chosenYAxis) {

  var xpercentsign = "";
  var xlabel = "";
  if (chosenXAxis === "poverty") {
    xlabel = "Poverty";
    xpercentsign = "%";
  } else if (chosenXAxis === "age"){
    xlabel = "Age";
  } else {
    xlabel = "Income";
  }

  var ypercentsign = "";
  var ylabel = "";
  if (chosenYAxis === "healthcare") {
    ylabel = "Healthcare";
    ypercentsign = "%";
  } else if (chosenYAxis === "smokes"){
    ylabel = "Smokes";
    ypercentsign = "%";
  } else {
    ylabel = "Obesity";
    ypercentsign = "%";
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([50, -75])
    .html(function(d) {
      if (chosenXAxis === "income"){
        let incomelevel = formatter.format(d[chosenXAxis]);

        return (`${d.state}<br>${xlabel}: ${incomelevel.substring(0, incomelevel.length-3)}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
      } else {
        return (`${d.state}<br>${xlabel}: ${d[chosenXAxis]}${xpercentsign}<br>${ylabel}: ${d[chosenYAxis]}${ypercentsign}`)
      };
    });

  circlesGroup.call(toolTip);

  // mouseover event
  circlesGroup.on("mouseover", function(data) {
      toolTip.show(data, this);

  })
    // onmouseout event
    .on("mouseout", function(data) {
        toolTip.hide(data, this);
    });

return circlesGroup;
}

function writeAnalysis (chosenXAxis, chosenYAxis){

  if (chosenXAxis === "poverty") {
    if (chosenYAxis === "healthcare") {
      articleHeader = "Poverty and the Uninsured"
      articleText = "Individuals in low-income households are more likely to be uninsured than those in higher income households, not all uninsured are also low income. Texas, exhibits the the highest number of uninsured, but does not also exhibit the highest number of families in poverty. Other factors appear to be contributing to whether an individual is insured."
    }
    else if(chosenYAxis === "smokes") {
      articleHeader = "Poverty and Smoking"
      articleText = "The dataset protrays that invividuals living in the U.S., below the poverty level are more likely to smoke cigarettes than the general population. Poverty does not appear to be isolated with it's affect on smoking rates, states like California and New York appear around the median for poverty rates, yet still exhibit the lowest rates of smoking relative to populations."
    }
    else {
      articleHeader = "Poverty and Obesity"
      articleText = "Overall, the dataset shows high obesity rates; it suggests that individuals who live in impoverished regions have poor access to fresh food. Food Deserts, or those regions with limited access to food often oorespond to those areas which are also below the porverty rate. This dataset shows there are states, New Hampshire for example, that have very low poverty rates but still have relatively higher rates of obesity, suggeting other factors may also be involved."
    }
  }
  else if (chosenXAxis === "age"){
    if (chosenYAxis=== "healthcare") {
      articleHeader = "Age and the Uninsured"
      articleText = "It is suggested that younger indiviudals lack healthinsurance due toa  number of factors, so it would make senese that those regions that have a younger demographic would also have lower rates of indidvuals with insurace coverage. Massachusetts appears to have the lowest number of uninsured individuals, most likely due to thier universal state healthcare. Texas conversly, has the highest rate of indivudals with no insurance, but a much lower median age."
    }
    else if(chosenYAxis === "smokes") {
      articleHeader = "Age and Smoking"
      articleText = "States with older populations are likely to have the higher rates of smoking. an observation might be that states where the median age is higher, may contain indivuals who ahve smoked for years of decades, whereas states such as Utah, with very low median age, also have lower smoking rates."
    }
    else {
      articleHeader = "Age and Obesity"
      articleText = "There does appear to be slight correlation between a states median age and level of obesity. It seems that higher age groups are more succeptible to being obese, but that is likely not always the case. Older age groups are typically less active than younger groups, and would therefore do much to explain why an older person is more likely to be obese. Clearly there are other factors, like poverty and income that may affect obesity levels."
    }
  }
  else {
    if (chosenYAxis === "healthcare") {
      articleHeader = "Income and the Uninsured"
      articleText = "Insurance coverage is costly in most areas, and this fact may be a factor in the rate of those uninsirued in lower median income areas. It would likely be expected that areas whith greater median income would alos have lower rates of those without insurance. Texas as the higehst level of uninsured individuals in the country."
    }
    else if(chosenYAxis === "smokes") {
      articleHeader = "Income and Smoking"
      articleText = "States with high rates of poverty tend to have a greater population of individuals that smoke. States with lower median household income tend to also exhibit higher rates of smoking. Conversly, states with relatively higher median incomes have lower rates of smoking on average."
    }
    else {
      articleHeader = "Income and Obesity";
      articleText = "Overall obesity decreases with increased levels of income. Similarly to how poverty affects the access to healthy food, income exhibits similar properties.";
    }
  }
  d3.select("#article_text")
  .classed("article_text", true)
  .text(articleText);

  d3.select("#article_header")
    .classed("article_header", true)
    .html(`<h3> ${articleHeader} </h3>`);

  };


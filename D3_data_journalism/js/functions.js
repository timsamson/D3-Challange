
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
      articleText = "Individuals in low-income households are more likely to be uninsured than those in higher income households, not all uninsured are also low income. Texas, exhibits the the highest number of uninsured, but does not also exhibit the highest number of families in poverty. Other factors appear to be contributing to rate of an individual being insured."
    }
    else if(chosenYAxis === "smokes") {
      articleHeader = "Poverty and Smoking"
      articleText = "The dataset protrays that invividuals living in the U.S., below the poverty level are more likely to smoke cigarettes than the remainder of the population. Poverty does not appear to be isolated with it's affect on smoking rates. California and New York appear around the median for poverty rates, yet exhibit the lowest rates of smoking relative to overall populations."
    }
    else {
      articleHeader = "Poverty and Obesity"
      articleText = "The dataset reveals high obesity rates; and suggests that individuals who live in impoverished regions have higher rates of obesity. One contributing factor (not explictly addressed in the dataset) could be Food Deserts, or those regions with limited access to food often coorespond to those areas which are also below the porverty rate. New Hampshire has very low poverty rates but still have relatively higher rates of obesity, suggeting other factors may also be involved."
    }
  }
  else if (chosenXAxis === "age"){
    if (chosenYAxis=== "healthcare") {
      articleHeader = "Age and the Uninsured"
      articleText = "It is widely suggested that younger indiviudals lack health insurance, so it would seem likely that the data would show that regions that have a younger demographic would also have lower rates of indidvuals with insurace coverage. Massachusetts appears as a distinct outlier to this hypothosis since it displays the lowest number of uninsured individuals, this likely is due to thier the states universal healthcare Program. Texas conversly, has the highest rate of indivudals with no insurance, but a much lower median age."
    }
    else if(chosenYAxis === "smokes") {
      articleHeader = "Age and Smoking"
      articleText = "States with older populations are likely to have the higher rates of smoking. An observation might concluded that states where the median age is higher, may contain indivuals who ahve smoked for longer periods of time and are less likley to quit. States such as Utah, appear as outliers, with very low median age and lower smoking rates."
    }
    else {
      articleHeader = "Age and Obesity"
      articleText = "There does appear to be slight correlation between a states median age and level of obesity. It seems that higher average age groups are more succeptible to being obese, but that is likely a generalization of the aggregatte data. Older age groups are typically less active than younger groups, and could therefore explain why an older person is more likely to be obese. Other factors, like poverty and income likely contirnbute to obesity levels."
    }
  }
  else {
    if (chosenYAxis === "healthcare") {
      articleHeader = "Income and the Uninsured"
      articleText = "Insurance coverage is costly in most areas, and this fact may be a factor in the rate of those uninsirued cooresponding to lower median income areas. It would likely be expected that areas whith greater median income would also exhibit lower rates of individuals without insurance. Texas as the higehst level of uninsured individuals in the country."
    }
    else if(chosenYAxis === "smokes") {
      articleHeader = "Income and Smoking"
      articleText = "States with high rates of poverty have a greater population of individuals that smoke on average. Likewise, states with lower median household income also exhibit higher rates of smoking. Generally, states with relatively higher median incomes have lower rates of smoking on average, pointing to income exhibiting a strong coorelation to smoking rates. "
    }
    else {
      articleHeader = "Income and Obesity";
      articleText = "Generally obesity decreases with increased levels of median income. Similarly to how poverty affects the access to healthy food, income exhibits similar properties.";
    }
  }
  d3.select("#article_text")
  .classed("article_text", true)
  .text(articleText);

  d3.select("#article_header")
    .classed("article_header", true)
    .html(`<h3> ${articleHeader} </h3>`);

  };


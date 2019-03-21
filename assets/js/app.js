// Step 1: Set up our chart
// =================================
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 60,
  left: 50
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Step 2: Create an SVG wrapper,
// append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
// =================================
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

var chart = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Step 3: Set up labels on x and y axes 
// =================================
// i) X-axis: Poverty
chart.append("text")
	.attr("transform", `translate(${width/2}, ${height + 40})`)
	.attr("class", "x-axis-text active")
	.attr("data-axis-name", "percentPoverty")
	.text("In Poverty (%)")

// ii) Y-axis: Healthcare
chart.append("text")
	.attr("transform", `translate(-30, ${height/2})rotate(270)`)
	.attr("class", "y-axis-text active")
	.attr("data-axis-name", "percentHealthcare")
	.text("Lacks Healthcare (%)")

// Step 4: Import .csv file and analyze data
// =================================
d3.csv("assets/data/data.csv").then(function(data, error) {
	for (var i = 0; i < data.length; i++) {
		console.log(data[i].abbr)
	}
	if (error) throw error;
	data.forEach(function(d) {
		d.poverty = +d.poverty;
		d.healthcare = +d.healthcare;
	})

	// Create scales
	var xScale = d3.scaleLinear().range([0, width])
	var yScale = d3.scaleLinear().range([height, 0])

	// Set axes
	var bottomAxis = d3.axisBottom().scale(xScale);
	var leftAxis = d3.axisLeft().scale(yScale);

	// Set domains
	var xMin = d3.min(data, function(d) {
		return d.poverty * 0.9;
	})
	var xMax = d3.max(data, function(d) {
		return d.poverty * 1.1;
	})
	var yMin = d3.min(data, function(d) {
		return d.healthcare * 0.9;
	})
	var yMax = d3.max(data, function(d) {
		return d.healthcare * 1.1;
	})

	xScale.domain([xMin, xMax]);
	yScale.domain([yMin, yMax]);

	// Create tooltip 
	var toolTip = d3.tip()
		.attr("class", "toolTip")
		.html(function(d) {
			var state = d.state;
			var percentPoverty = d.poverty;
			var lacksHealthcare = d.healthcare;
			return (`${state}<br> Poverty Rate: ${percentPoverty}<br> Percentage of Population Lacking Healthcare: ${lacksHealthcare}`);
		});
		chart.call(toolTip);
	
	// Append circles
	chart.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		.attr("cx", function(d,i) {
			console.log(d.poverty);
			return xScale(d.poverty);
		})
		.attr("cy", function(d,i) {
			console.log(d.healthcare);
			return yScale(d.healthcare);
		})
		.attr("r", 10)
		.attr("fill","lightblue")
		.style("opacity", 1)
		// create click function
		.on("mouseover", function(d) {
			toolTip.style("display", "block")
				.style("left", d3.event.pageX + "px")
				.style("top", d3.event.pageY + "py")
				.show(d);
		})
		.on("mouseout", function(d,i) {
			toolTip.hide(d);
		});
	
	// Create circle labels
	chart.selectAll("g circles")
		.data(data)
		.enter()
		.append("text")
		.text(function(d) {
			return d.abbr;
		})	
		.attr("x", function(d) {
			return xScale(d.poverty);
		})
		.attr("y", function(d) {
			return yScale(d.healthcare);
		})
		.attr("font-size", "10px")
		.attr("text-anchor", "middle")
		.attr("class", "circleText")
		// create click function
		.on("mouseover", function(d) {
			toolTip.style("display", "block")
				.style("left", d3.event.pageX + "px")
				.style("top", d3.event.pageY + "py")
				.show(d);
		})
		.on("mouseout", function(d,i) {
			toolTip.hide(d);
		});
	
	// Append left and bottom axis
	chart.append("g")
		.attr("transform", `translate(0, ${height})`)
		.call(bottomAxis);

	chart.append("g")
		.call(leftAxis);
})
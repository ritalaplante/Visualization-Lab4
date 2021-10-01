const format = d3.format(",");

d3.csv("wealth-health-2014.csv", (row)=> {
	return{
		...row,
		LifeExpectancy:+row.LifeExpectancy,
		Income:+row.Income,
		Population:+row.Population
	};
})
.then(data => {
    console.log(data);

    data.sort(function (a, b) {
        return b.Population - a.Population;
    });
    
    const margin = {top:20, left:20, right:20, bottom:20};

	const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const scaleIncome = d3
        .scaleLinear()
		.domain(d3.extent(data, d=>d.Income))
		.range([0, width]);
    
    const scaleLE = d3
        .scaleLinear()
		.domain(d3.extent(data, d=>d.LifeExpectancy))
		.range([height, 0]);

    const scalePop = d3
        .scaleLinear()
        .domain(d3.extent(data, d=>d.Population))
        .range([5, 25]);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10);
    
    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .style("background-color", "red");
    
    let xAxis = d3.axisBottom(scaleIncome)
        .ticks(5, "s");
    
    let yAxis = d3.axisLeft(scaleLE)
        .ticks(5, "s")
    
    svg.append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0, ${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
        .attr("class", "circles")
		.attr("fill", (d, i) => {
            return colorScale(d.Region);
        })
        .attr("r", (d, i) => {
            return scalePop(d.Population);
        })
		.attr("cx", (d, i) => {
			return scaleIncome(d.Income);
		})
		.attr("cy", (d, i) => {
			return scaleLE(d.LifeExpectancy);
		})
        .on("mouseenter", (event, d) => {
            const pos = d3.pointer(event, window); // pos = [x,y]
            d3.select(".tooltip")
                .style("display", "block")
                .style("top", (pos[1]+10)+"px")
                .style("left", (pos[0]+10)+"px").html(`
                    <div>Country: ${d.Country}</div>
                    <div>Region: ${d.Region}</div>
                    <div>Population: ${format(d.Population)}</div>
                    <div>Life Expectancy: ${format(d.LifeExpectancy)}</div>
                `)
                .style("background-color", "black")
                .style("border-radius", "5px")
                .style("padding", "10px")
                .style("color", "white")
                .style('font-size', '12px')
        })
        .on("mouseleave", (event, d) => {
            d3.select(".tooltip").style("display", "none");
        });
        
    svg.append("text")
		.attr('x', width-100)
		.attr('y', height)
		.attr("alignment-baseline", "baseline")
        .attr("dy", -5)
        .attr("font-size", 12)
		.text("Income");

    svg.append("text")
        .attr("writing-mode", "tb")
        .attr("alignment-baseline", "baseline")
        .attr("dy", 0)
        .attr("dx", 12)
        .attr("font-size", 12)
        .text("Life Expectancy");

    const legend = svg.append("g");

    legend.selectAll(".legendColors")
        .data(colorScale.domain())
        .enter()
        .append("rect")
        .attr("x", 400)
        .attr("y", function(d,i){ return 275 + i*(20+5)}) 
        .attr("width", 20)
        .attr("height", 20)
        .attr("fill", d=>colorScale(d));

    legend.selectAll(".legendLabels")
        .data(colorScale.domain())
        .enter()
        .append("text")
        .attr("x", 400 + 20*1.2)
        .attr("y", function(d,i){ return 275 + i*(20 +5) + (25/2)}) 
        .attr("font-size", 12)
        .text(d=>d);


})


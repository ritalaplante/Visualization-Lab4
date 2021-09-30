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
    
    const margin = {top:20, left:20, right:20, bottom:20};

	const width = 650 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    /*const minIncome = d3.extent(data, d=>d.Income)[0]
    const maxIncome = d3.extent(data, d=>d.Income)[1]

    const minLE = d3.extent(data, d=>d.LifeExpectancy)[0]
    const maxLE = d3.extent(data, d=>d.LifeExpectancy)[1]

    const minPop= d3.extent(data, d=>d.Population)[0]
    const maxPop = d3.extent(data, d=>d.Population)[1]*/

    const scaleIncome = d3
        .scaleLinear()
		.domain(d3.extent(data, d=>d.Income))
		.range([width, 0]);
    
    const scaleLE = d3
        .scaleLinear()
		.domain(d3.extent(data, d=>d.LifeExpectancy))
		.range([height, 0]);

    const scalePop = d3.scaleLinear()
        .domain(d3.extent(data, d=>d.Population))
        .range([0, width]);

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)
        .domain([data.Region]);
    
    //console.log(scaleIncome(maxIncome));

    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    const chartGroup = svg
        .append("g") 
		.attr("transform", `translate(${margin.left}, ${margin.right})`); 
    
    let xAxis = d3.axisBottom(scaleIncome)
        .ticks(5, "s");
    
    let yAxis = d3.axisLeft(scaleLE)
        .ticks(5, "s")
    
    svg.append("g")
        .attr("class", "x-axis")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y-axis")
        .call(yAxis);

    svg.selectAll("circle")
		.data(data)
		.enter()
		.append("circle")
		/*.attr("fill", (d)=>colorScale(d.Region))
		//.attr("stroke", "Black")
		//.attr("r", (d)=>scalePop(d.Population))
		.attr("cx", (d, i) => {
			return scaleIncome(d.Income);
		})
		.attr("cy", (d, i) => {
			return scaleLE(d.Income);
		});*/
        
})


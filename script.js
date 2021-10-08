const margin = {top:20, left:50, right:20, bottom:20};
const width = 600 - margin.left - margin.right,
height = 400 - margin.top - margin.bottom;

//let padding = 20;
let coffee;
let type = d3.select('#group-by').node().value;
let reverse = false;

const svg = d3.select('.chart')
	.append('svg')
    .attr('width', width + margin.left + margin.right)
    .attr('height', height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

const xScale = d3.scaleBand()
    //.domain(data.map(d=>d.company))
    .rangeRound([0, width])
    //.rangeRound([padding, width - padding - 1])
    .paddingInner(0.1)

const yScale = d3.scaleLinear()
    //.domain([0, d3.max(data,d=>d[stores])])
    .range([height, 0])


svg.append("g")
    .attr("class", "axis x-axis")
    .attr("transform", "translate(0, " + height + ")") // + padding
    // .call(xAxis);
        
svg.append("g")
    .attr("class", "axis y-axis")
    //  .attr("transform", "translate(" + ", 0)")
    // .call(yAxis);

svg.append("text")
    .attr("class", "label ylabel")
    .attr('x', width - 612)
    .attr('y', height - 470)
    .attr("alignment-baseline", "hanging")
    //.text("Stores")  
    
function update(data, type, reverse){

    data.sort((a, b)=>b[type] - a[type]);  
  
    if (reverse == true){
      data.reverse();
    }

    xScale.domain(data.map(d=>d.company));

    yScale.domain([0, d3.max(data,d=>d[type])]);

    const bars = svg.selectAll('.bar')
        .data(data);

    bars.enter()
        .append('rect')
        .attr('class', 'bar')
        .attr('x', d=>xScale(d.company))
        .attr("y",height)
        .attr('width', xScale.bandwidth())
        .attr("height", 0)
        .attr("fill", "#1f76b4")
        .merge(bars)
        .transition()
        .duration(1000)
        .attr('x', d=>xScale(d.company))
        .attr('y', d=>yScale(d[type]))
        .attr('height', d=>height - yScale(d[type])) //- padding

    bars.exit().remove();

    const xAxis = d3.axisBottom(xScale)
        // .scale(xScale)
        // .ticks(8)
    const yAxis = d3.axisLeft(yScale)
        // .scale(yScale)
        // .ticks(7)

    svg.select('.x-axis')
        .transition()
        .duration(1000)
        .call(xAxis);
    
    svg.select('.y-axis')
        .transition()
        .duration(1000)
        .call(yAxis);

    d3.select('.ylabel').text(type==="stores"? "Stores" : "Billion USD")
}
    


    
d3.csv("coffee-house-chains.csv", d3.autoType).then(data => {
    coffee = data;
    update(coffee, type, reverse);
    
});
  
  
d3.select('#group-by').on('change', (event)=>{
    type = d3.select('#group-by').node().value;
    update(coffee, type, reverse);
})
  
d3.select('#sort-btn').on('click', (event)=>{
    console.log('sort button clicked');
    reverse = !reverse;
    update(coffee, type, reverse);
})
    
        
    

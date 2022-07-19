//Create SVG element
var svg = d3.select("#chart-1 .chart")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

var tooltip = d3.select(".d3-container").append("div")
  .attr("class", "my-tooltip")
  .style("visibility", 'hidden')

//Load in data
d3.csv("https://assets.law360news.com/1512000/1512498/data.csv")
  .then(function(csv) {
    // Add X scale

    // Define X axis
    var xAxis = d3.axisBottom(xScale)
      .tickFormat((d) => {
        return document.querySelector('#article').offsetWidth >= 640 ? d : "'" + d.toString().substring(2)
      })

    // Add Y scale
    var yScale = d3.scaleLinear()
      .domain([160, 0])
      .range([0, height - (margin.top + margin.bottom)])

    // Define Y axis and format tick marks
    var yAxis = d3.axisLeft(yScale)
      .ticks(tickNums)
      .tickFormat(d => '$' + d)

    var yGrid = d3.axisLeft(yScale)
      .tickSize(-width + margin.right + margin.left, 0, 0)
      .tickFormat('')
      .ticks(tickNums)

    svg.append("text")
      .attr("class", "y-label")
      .attr("text-anchor", "middle")
      .attr("transform", `translate(${20},${(height-margin.bottom)/2}) rotate(-90)`)
      .style('font-size', '11pt')
      .style('fill', 'black')
      .text("Dollar Volume ($B)");

    // Render Y grid
    svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "grid")
      .style('color', 'black')
      .style('opacity', '0.2')
      .call(yGrid)

    svg.selectAll("bars")
      .data(csv)
      .enter()
      .append("rect")
      .attr('class', (d) => {
        return `year year-${d.year} nonresident`
      })
      .attr("y", function(d) {
        return (height - margin.bottom) - yScale(160 - d.nonresidentDollar);
      })
      .attr("x", function(d) {
        return xScale(d.year)
      })
      .attr("height", function(d) {
        return yScale(160 - d.nonresidentDollar);
      })
      .attr("width", xScale.bandwidth())
      .attr("fill", '#654f6f')
      .on('mouseover mousemove', (d) => {
        var text = tipText(d)
        return mouseover(text)
      })
      .on('mouseout', mouseout)

    svg.selectAll("bars")
      .data(csv)
      .enter()
      .append("rect")
      .attr('class', (d) => {
        return `year year-${d.year} resident`
      })
      .attr("y", function(d) {
        return (height - margin.bottom) - yScale(160 - d.residentDollar) - yScale(160 - d.nonresidentDollar);
      })
      .attr("x", function(d) {
        return xScale(d.year)
      })
      .attr("height", function(d) {
        return yScale(160 - d.residentDollar);
      })
      .attr("width", xScale.bandwidth())
      .attr("fill", '#6ba292')
      .on('mouseover mousemove', (d) => {
        var text = tipText(d)
        return mouseover(text)
      })
      .on('mouseout', mouseout)

    var pointsOffset = 8

    svg.selectAll("bars")
      .data(csv)
      .enter()
      .append('text')
      .text(d => numeral(d.nonresidentDollar).format('$0[.]0'))
      .attr('class', (d) => {
        return `year text year-${d.year.replaceAll('.', '').toLowerCase()} nonresidentDollar`
      })
      .attr("y", function(d) {
        return (height - margin.bottom) - yScale(160 - d.nonresidentDollar) / 2 + pointsOffset;
      })
      .attr("x", function(d) {
        return xScale(d.year) + xScale.bandwidth() / 2;
      })
      .style('display', document.querySelector('#article').offsetWidth < 500 ? 'none' : 'block')

    svg.selectAll("bars")
      .data(csv)
      .enter()
      .append('text')
      .text(d => numeral(d.residentDollar).format('$0[.]0'))
      .attr('class', (d) => {
        return `year text year-${d.year.replaceAll('.', '').toLowerCase()} residentDollar`
      })
      .attr("y", function(d) {
        return (height - margin.bottom) - yScale(160 - d.nonresidentDollar) - yScale(160 - d.residentDollar) / 2 + pointsOffset;
      })
      .attr("x", function(d) {
        return xScale(d.year) + xScale.bandwidth() / 2;
      })
      .style('display', document.querySelector('#article').offsetWidth < 500 ? 'none' : 'block')

    svg.selectAll("bars")
      .data(csv)
      .enter()
      .append('text')
      .text(d => numeral(d.totalDollar).format('$0[.]0'))
      .attr('class', (d) => {
        return `year text year-${d.year.replaceAll('.', '').toLowerCase()} totalDollar`
      })
      .attr("y", function(d) {
        return (height - margin.bottom) - yScale(160 - d.totalDollar) + pointsOffset - 15;
      })
      .attr("x", function(d) {
        return xScale(d.year) + xScale.bandwidth() / 2;
      })
      .style('fill', 'black')
      .style('display', document.querySelector('#article').offsetWidth < 540 ? 'none' : 'block')

    svg.selectAll("svg text")
      .attr("font-family", "sans-serif")
      .attr("font-size", () => {
        return document.querySelector('#article').offsetWidth >= 640 ? "10pt" : '8pt'
      })
      .attr("text-anchor", "middle")
      .attr('fill', 'white')
      .style('pointer-events', 'none')


    // Render Y axis
    svg.append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`)
      .attr('class', 'y-axis')
      .call(yAxis)
      .style('color', 'black')
      .selectAll("text")
      .attr("font-size", "9pt")
      .style("text-anchor", "end")

    //Render X axis
    svg.append("g")
      .attr("transform", `translate(0, ${height - margin.bottom})`)
      .attr('class', 'x-axis')
      .style('color', 'black')
      .call(xAxis)
      .selectAll("text")
      .attr("font-size", "9pt")
      // .attr("transform", () => {
      //   return winWidth > 640 ? null : `translate(-5, 0) rotate(-45)`
      // })
      .style("text-anchor", 'middle')
  });
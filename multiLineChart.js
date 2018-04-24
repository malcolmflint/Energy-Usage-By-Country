// Adapted from https://bl.ocks.org/mbostock/3884955

let svg = d3.select("svg"),
    margin = {top: 20, right: 80, bottom: 100, left: 100},
    width = svg.attr("width") - margin.left - margin.right,
    height = svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

let parseTime = d3.timeParse("%Y");

let x = d3.scaleTime().range([0, width]),
    y = d3.scaleLinear().range([height, 0]),
    z = d3.scaleOrdinal(d3.schemeCategory20);

let line = d3.line()
    .curve(d3.curveBasis)
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.gdp); });

// gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(x)
        .ticks(5)
}

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5)
}

// massages data to work with bostock's code
function transpose_csv (t) {
    let rows = d3.csvParseRows(t);
    rows[0][0] = "date";
    let data = Array(rows[0].length - 1).fill({});
    for (let row = 0; row < rows.length; row++) {
        for (let column = 1; column < rows[0].length; column++) {
            let new_data = {};
            new_data[rows[row][0]] = rows[row][column];
            data[column - 1] = Object.assign(new_data, data[column - 1]);
        }
    }
    data.forEach(function (d) {
        for (let val in d) {
            if (val === 'date') {
                d[val] = parseTime(d[val]);
            } else {
                d[val] = +d[val];
            }
        }
    });
    data.columns = Object.keys(data[0]);
    return data;
}

d3.text("EPC_2000_2010.csv", function (t) {
    let data = transpose_csv(t);
    let brics = ["Brazil", "Russia", "India", "China", "South Africa", "United States"];
    // let countriesTemp = data.columns.filter(function (i) {
    //     return i !== "date";
    // });

    let countries = brics.map(function(id) {
        return {
            id: id,
            values: data.map(function(d) {
                return {date: d.date, gdp: d[id]};
            })
        };
    });

    x.domain(d3.extent(data, function(d) { return d.date; }));

    y.domain([
        d3.min(countries, function(c) { return d3.min(c.values, function(d) { return d.gdp; }); }),
        d3.max(countries, function(c) { return d3.max(c.values, function(d) { return d.gdp; }); })
    ]);

    z.domain(countries.map(function(c) { return c.id; }));

    g.append("g")
        .attr("class", "axis axis--x")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    g.append("g")
        .attr("class", "axis axis--y")
        .call(d3.axisLeft(y))
        .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", "0.71em")
        .attr("fill", "#000")

    // Y axis Label
    g.append("text")
        .text("Million BTUs per Person")
        .attr("y", 0 - margin.left / 2)
        .attr("x", 0 - height / 2)
        .attr("text-anchor", "middle")
        .style("font", "12px sans-serif")
        .attr("transform", "rotate(-90)");

    g.append("text")
        .text("Year")
        .attr("y", height + margin.bottom / 2)
        .attr("x", width / 2)
        .attr("text-anchor", "center")
        .style("font", "12px sans-serif");

    // gridlines implementation found at https://bl.ocks.org/d3noob/c506ac45617cf9ed39337f99f8511218
    // add the X gridlines
    g.append("g")
        .attr("class", "grid")
        .attr("transform", "translate(0," + height + ")")
        .call(make_x_gridlines()
            .tickSize(-height)
            .tickFormat("")
        );

    // add the Y gridlines
    g.append("g")
        .attr("class", "grid")
        .call(make_y_gridlines()
            .tickSize(-width)
            .tickFormat("")
        );

    let city = g.selectAll(".city")
        .data(countries)
        .enter().append("g")
        .attr("class", "city");

    let path = city.append("path")
        .attr("class", "line")
        .attr("d", function(d) { return line(d.values); })
        .style("stroke", function(d) { return z(d.id); });

    let totalLength = path.node().getTotalLength();

    path
        .attr("stroke-dasharray", totalLength + " " + totalLength)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(2000)
        .attr("stroke-dashoffset", 0);

    city.append("text")
        .datum(function(d) { return {id: d.id, value: d.values[d.values.length - 1]}; })
        .attr("transform", function(d) { return "translate(" + x(d.value.date) + "," + y(d.value.gdp) + ")"; })
        .attr("x", 3)
        .attr("dy", "0.35em")
        .style("font", "10px sans-serif")
        .text(function(d) { return d.id; });
});


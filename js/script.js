var DVizModule = (() => {

    const height = 500,
        width = 954,
        margin = {
            top: 20,
            right: 0,
            bottom: 30,
            left: 40
        };

        let xScale, yScale,
        xAxis, yAxis;
        

    function loadData() {
       return d3.csv("data/alphabet.csv",
       ({letter, frequency}) => ({
        name: letter,
        value: +frequency
       }));
    }

    async function formatData(dataset) {
        dataset = await loadData();
        dataset.sort((a, b) => b.value - a.value);
        return dataset;
    }

    async function scaleData(dataset) {
        dataset = await formatData();

        xScale = d3.scaleBand()
            .domain(d3.range(dataset.length))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        yScale = d3.scaleLinear()
            .domain([0, d3.max(dataset, d => d.value)]).nice()
            .range([height - margin.bottom, margin.top]);
    }

    async function axisData(dataset) {
        dataset = await formatData();

        xAxis = g => g
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat(i => dataset[i].name).tickSizeOuter(0));

        yAxis = g => g
            .attr("transform", `translate(${margin.left},0)`)
            .call(d3.axisLeft(yScale))
            .call(g => g.select(".domain").remove());
    }

    async function plotData(dataset) {
        dataset = await formatData();

        const svg = d3.select("#svg")
            .append("svg")
            .attr("width", width)
            .attr("height", height);

        svg.append("g")
            .attr("fill", "#4c1f92")
            .selectAll("rect")
            .data(dataset)
            .join("rect")
            .attr("x", (d, i) => xScale(i))
            .attr("y", d => yScale(d.value))
            .attr("height", d => yScale(0) - yScale(d.value))
            .attr("width", xScale.bandwidth());

            svg.append("g")
            .call(xAxis);

            svg.append("g")
            .call(yAxis);
    }
    
    formatData();
    scaleData();
    axisData();
    plotData();

})();





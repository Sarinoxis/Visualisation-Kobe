class BarChart {
    constructor (config, data) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:10, right:10, bottom:10, left:10},
            xlabel: config.xlabel || '',
            ylabel: config.ylabel || '',
            cscale: config.cscale
        };
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.radius = Math.min(self.config.width, self.config.height) / 2.5;

        self.svg = d3.select(self.config.parent)
            .attr('width', self.config.width)
            .attr('height', self.config.height)
            .append('g')
            .attr('transform', `translate(${self.config.width/2 }, ${self.config.height/2 - 20})`);

        self.pie = d3.pie()
            .value(d => d.count);

        self.arc = d3.arc()
            .innerRadius(10)  // Set for pie chart (for donut chart, set >0)
            .outerRadius(self.radius - 10);

        self.color = self.config.cscale;

        self.update();
    }

    update(min = 0, max = 100, min_score = 0) {
        let self = this;

        const data_map = d3.rollup( self.data.filter(d => d.Age < max).filter(d => d.Age > min).filter(d => d.Spending_Score > min_score), v => v.length, d => d.Genre );
        self.aggregated_data = Array.from( data_map, ([key,count]) => ({key,count}) );

        self.render();
    }

    render() {
        let self = this;

        // Bind data to slices
        const slices = self.svg.selectAll("path")
            .data(self.pie(self.aggregated_data));

        slices.enter()
            .append("path")
            .merge(slices)
            .attr("d", self.arc)
            .attr("fill", d => self.color(d.data.key))
            .attr("stroke", "#fff")
            .style("stroke-width", "2px")
            .on('click', function (event, d) {
                const is_active = filter.includes(d.data.key);
                if (is_active) {
                    filter = filter.filter(f => f !== d.data.key);
                } else {
                    filter.push(d.data.key);
                }
                Filter();
                d3.select(this).classed('active', !is_active);
            });

        slices.exit().remove();

        // Add labels
        const labels = self.svg.selectAll("text")
            .data(self.pie(self.aggregated_data));

        labels.enter()
            .append("text")
            .merge(labels)
            .attr("transform", d => `translate(${self.arc.centroid(d)})`)
            .attr("text-anchor", "middle")
            .style("font-size", "12px")
            .text(d => d.data.key);

        labels.exit().remove();
    }
}

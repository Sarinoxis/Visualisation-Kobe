d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:20, right:20, bottom:40, left:40},
            axisMargin: {bottom:20, left:20}
        };

        const scatter_plot = new ScatterPlot( config, data );
        scatter_plot.update();
    })
    .catch( error => {
        console.log( error );
    });

class ScatterPlot {

    constructor( config, data ) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:20, right:40, bottom:40, left:20},
            axisMargin: config.axisMargin || {bottom:100, left:100}
        }
        this.data = data;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left + self.config.axisMargin.left}, ${self.config.margin.top})`);
        
        self.axis = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right - self.config.axisMargin.left;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom - self.config.axisMargin.bottom;

        self.axis_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.axis_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

        self.xscale = d3.scaleLinear()
            .range( [0, self.inner_width] );

        self.yscale = d3.scaleLinear()
            .range( [0, self.inner_height] );

        self.xscale_axis = d3.scaleLinear()
            .range( [-self.config.axisMargin.left, self.inner_width] );

        self.yscale_axis = d3.scaleLinear()
            .range( [0, self.inner_height + self.config.axisMargin.bottom] );

        self.xaxis = d3.axisBottom( self.xscale_axis )
            .ticks(6)
            .tickSize(5)
            .tickPadding(2);;

        self.xaxis_group = self.axis.append('g')
            .attr('transform', `translate(${self.config.axisMargin.left}, ${self.axis_height})`);

        self.yaxis = d3.axisLeft( self.yscale_axis )
            .ticks(6)
            .tickSize(5)
            .tickPadding(2);

        self.yaxis_group = self.axis.append('g')
            .attr('transform', `translate(${0},0)`);
    }

    update() {
        let self = this;

        const xmin = d3.min( self.data, d => d.x );
        const xmax = d3.max( self.data, d => d.x );
        self.xscale.domain( [xmin, xmax] );
        self.xscale_axis.domain( [xmin - self.config.axisMargin.left/self.inner_width*(xmax-xmin), xmax] );

        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.yscale.domain( [ymin, ymax] );
        self.yscale_axis.domain( [ymin, ymax + self.config.axisMargin.bottom/self.inner_height*(ymax - ymin)] );



        self.render();
    }

    render() {
        let self = this;

        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( d.y  ) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}

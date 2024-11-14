d3.csv("https://vizlab-kobe-lecture.github.io/InfoVis2021/W04/data.csv")
    .then( data => {
        data.forEach( d => { d.x = +d.x; d.y = +d.y; });

        var config = {
            parent: '#drawing_region',
            width: 512,
            height: 512,
            margin: {top:40, right:20, bottom:40, left:80},
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
            .range( [self.inner_height + self.config.axisMargin.bottom, 0 ] );

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

        self.axis.append("text")
            .attr("class", "x_label")
            .attr("text-anchor", "middle")
            .attr("x", self.axis_width/2)
            .attr("y", self.axis_height + 35)
            .text("x label");
        
        self.axis.append("text")
            .attr("class", "y_label")
            .attr("text-anchor", "middle")
            .attr("y", -35)
            .attr("x", -self.axis_height/2)
            .attr("transform", "rotate(-90)")
            .text("y label");
        
        self.axis.append("text")
            .attr("class", "y max")
            .attr("text-anchor", "end")
            .attr("x", -25)
            .attr("y", 0)
            .text("y max");
        
        self.axis.append("text")
            .attr("class", "y min")
            .attr("text-anchor", "end")
            .attr("x", -25)
            .attr("y", self.inner_height)
            .text("y min");
        
        self.axis.append("text")
            .attr("class", "x min")
            .attr("text-anchor", "middle")
            .attr("x", self.config.axisMargin.left)
            .attr("y", self.axis_height + 25)
            .text("x min");
        
        self.axis.append("text")
            .attr("class", "x max")
            .attr("text-anchor", "middle")
            .attr("x", self.axis_width)
            .attr("y", self.axis_height + 25)
            .text("x max");
        
        self.axis.append("text")
            .attr("class", "title")
            .attr("text-anchor", "middle")
            .attr("x", self.axis_width/2)
            .attr("y", - 25)
            .attr("fill","blue")
            .text("TITLE");

        
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
        self.yscale_axis.domain( [ymin - self.config.axisMargin.bottom/self.inner_height*(ymax - ymin), ymax ] );



        self.render();
    }

    render() {
        let self = this;
        const ymin = d3.min( self.data, d => d.y );
        const ymax = d3.max( self.data, d => d.y );
        self.chart.selectAll("circle")
            .data(self.data)
            .enter()
            .append("circle")
            .attr("cx", d => self.xscale( d.x ) )
            .attr("cy", d => self.yscale( -d.y + ymin + ymax) )
            .attr("r", d => d.r );

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}

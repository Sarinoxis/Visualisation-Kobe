d3.csv("https://raw.githubusercontent.com/Sarinoxis/Visualisation-Kobe/refs/heads/main/w04/w04_task2.csv")
    .then( data => {
        data.forEach( d => {d.w = + d.w;});

        var config = {
            parent: '#drawing_region',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:20, left:60},
            axisMargin: {bottom:20, left:20}
        };

        const bar_chart = new BarChart( config, data, "vert" );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

    constructor( config, data, orientation) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:20, right:40, bottom:40, left:20},
            axisMargin: config.axisMargin || {bottom:100, left:100}
        }
        this.data = data;
        this.orientation = orientation
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);
        
        self.axis = self.svg.append('g')
            .attr('transform', `translate(${self.config.margin.left}, ${self.config.margin.top})`);

        self.inner_width = self.config.width - self.config.margin.left - self.config.margin.right;
        self.inner_height = self.config.height - self.config.margin.top - self.config.margin.bottom;

    // Initialize axis scales
    if (this.orientation == "horiz"){
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_width]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_height])
            .paddingInner(0.1);

        // Initialize axes
        self.xaxis = d3.axisBottom( self.xscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.yaxis = d3.axisLeft( self.yscale )
            .tickSizeOuter(0);

        // Draw the axis
        self.xaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.xaxis );

        self.yaxis_group = self.chart.append('g')
            .call( self.yaxis );
    } else {
        self.xscale = d3.scaleLinear()
            .range([0, self.inner_height]);
        
        self.xscale_axis = d3.scaleLinear()
            .range([0, self.inner_height]);

        self.yscale = d3.scaleBand()
            .range([0, self.inner_width])
            .paddingInner(0.1);
        

        // Initialize axes
        self.yaxis = d3.axisBottom( self.yscale )
            .ticks(5)
            .tickSizeOuter(0);

        self.xaxis = d3.axisLeft( self.xscale_axis )
            .tickSizeOuter(0);

        // Draw the axis
        self.yaxis_group = self.chart.append('g')
            .attr('transform', `translate(0, ${self.inner_height})`)
            .call( self.yaxis );

        self.xaxis_group = self.chart.append('g')
            .call( self.xaxis );
    }
    
    }

    update() {
        let self = this;
        if (this.orientation == "horiz"){
            const xmax = d3.max( self.data, d => d.w );
            self.xscale.domain( [0, xmax] );
            self.yscale.domain(self.data.map(d => d.label));
        } else {
            const xmax = d3.max( self.data, d => d.w );
            self.xscale.domain( [0, xmax] );
            self.xscale_axis.domain( [xmax, 0] );
            self.yscale.domain(self.data.map(d => d.label));
        }
        


        self.render();
    }

    render() {
        let self = this;

        // Draw bars
        if (this.orientation == "horiz"){
            self.chart.selectAll("rect").data(self.data).enter()
                .append("rect")
                .attr("x", 0)
                .attr("y", d => self.yscale(d.label))
                .attr("width", d => self.xscale(d.w))
                .attr("height", self.yscale.bandwidth());
        } else {
            self.chart.selectAll("rect").data(self.data).enter()
                .append("rect")
                .attr("y", d => this.inner_height - self.xscale(d.w))
                .attr("x", d => self.yscale(d.label))
                .attr("height", d => self.xscale(d.w))
                .attr("width", self.yscale.bandwidth());
        }
        

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}

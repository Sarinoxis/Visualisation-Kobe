class LineChart {

    constructor( config, data, orientation, fil, cir) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:20, right:40, bottom:40, left:20},
            axisMargin: config.axisMargin || {bottom:100, left:100}
        }
        this.data = data;
        this.orientation = orientation;
        this.fil = fil;
        this.cir = cir
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

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_height])

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

        self.yscale = d3.scaleLinear()
            .range([0, self.inner_width])

        

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
            const xmin = d3.min( self.data, d => d.x );
            const xmax = d3.max( self.data, d => d.x );
            self.xscale.domain( [xmin, xmax] );
            // self.yscale.domain(self.data.map(d => d.y));
            const ymin = d3.min( self.data, d => d.y );
            const ymax = d3.max( self.data, d => d.y );
            self.yscale.domain( [ymin, ymax] );
        } else {
            const xmax = d3.max( self.data, d => d.x );
            const xmin = d3.min( self.data, d => d.x );
            self.xscale.domain( [xmin, xmax] );
            self.xscale_axis.domain( [xmax, xmin] );
            // self.yscale.domain(self.data.map(d => d.y));
            const ymin = d3.min( self.data, d => d.y );
            const ymax = d3.max( self.data, d => d.y );
            self.yscale.domain( [ymin, ymax] );
        }
        


        self.render();
    }

    render() {
        let self = this;

        // Draw bars
        if (this.orientation == "horiz"){
            const area = d3.area()
                .x( d =>self.xscale( d.x ) )
                .y1( d => self.yscale( d.y ) )
                .y0( 0 );
            if(this.fil){
                self.chart.append('path')
                    .attr('d', area(self.data))
                    .attr('stroke', 'black')
                    .attr('fill', 'black')
            } else {
                self.chart.append('path')
                    .attr('d', area(self.data))
                    .attr('stroke', 'black')
                    .attr('fill', 'none')
            }
            
            if(this.cir){
                self.chart.selectAll("circle")
                    .data(self.data)
                    .enter()
                    .append("circle")
                    .attr("cx",  d => self.xscale( d.x )  )
                    .attr("cy", d => self.yscale(d.y ))
                    .attr("r", 5)
                    .attr('fill', 'red') // Fill color of the circle
                    .attr('stroke', 'black') // Optional: Stroke around the circle
                    .attr('stroke-width', 1);
            }

            
            self.chart.selectAll("circle")
                .data(self.data)
                .enter()
                .append("circle")
                .attr("cx",  d => self.xscale( d.x )  )
                .attr("cy", d => self.yscale(d.y ))
                .attr("r", 5)
                .attr('fill', 'red') // Fill color of the circle
                .attr('stroke', 'black') // Optional: Stroke around the circle
                .attr('stroke-width', 1);

        } else {
            const xmax = d3.max( self.data, d => d.x );
            const area = d3.area()
                .x( d => self.yscale(d.y) )
                .y1( 98)
                .y0( d => self.xscale(d.x));
            if(this.fil){
                self.chart.append('path')
                    .attr('d', area(self.data))
                    .attr('stroke', 'black')
                    .attr('fill', 'black');
            } else {
                self.chart.append('path')
                    .attr('d', area(self.data))
                    .attr('stroke', 'black')
                    .attr('fill', 'none');
            }
            
            if(this.cir){
                self.chart.selectAll("circle")
                    .data(self.data)
                    .enter()
                    .append("circle")
                    .attr("cx",  d => self.yscale( d.y )  )
                    .attr("cy", d => self.xscale(d.x ))
                    .attr("r", 5)
                    .attr('fill', 'red') // Fill color of the circle
                    .attr('stroke', 'black') // Optional: Stroke around the circle
                    .attr('stroke-width', 1);
            }
            
        }
        
        

        self.xaxis_group
            .call( self.xaxis );
        
        self.yaxis_group
            .call( self.yaxis );
    }
}


var data = [
    {x:0, y:100},
    {x:40, y:5},
    {x:120, y:80},
    {x:150, y:30},
    {x:200, y:50}
];

var config = {
    parent: '#drawing_region',
    width: 256,
    height: 128,
    margin: {top:10, right:10, bottom:20, left:60},
    axisMargin: {bottom:20, left:20}
};

const line_chart = new LineChart( config, data, "vert" , 1, 1);
line_chart.update();



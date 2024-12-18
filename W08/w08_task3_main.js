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
        
        const bar_chart = new BarChart( config, data, 30, 1 );
        bar_chart.update();
    })
    .catch( error => {
        console.log( error );
    });

class BarChart {

    constructor( config, data, inn_radius, col) {
        this.config = {
            parent: config.parent,
            width: config.width || 256,
            height: config.height || 256,
            margin: config.margin || {top:20, right:40, bottom:40, left:20},
            axisMargin: config.axisMargin || {bottom:100, left:100}
        }
        this.data = data;
        this.col = col;
        this.inn_radius = inn_radius;
        this.radius = Math.min( this.config.width, this.config.height ) / 2;
        this.init();
    }

    init() {
        let self = this;

        self.svg = d3.select( self.config.parent )
            .attr('width', self.config.width)
            .attr('height', self.config.height);

        self.chart = self.svg.append('g')
            .attr('transform', `translate(${this.config.width/2}, ${this.config.height/2})`);
    
    }

    update() {
        let self = this;
        self.render();
    }

    render() {
        let self = this;

        // Draw bars

        const pie = d3.pie()
            .value( d => d.w );
        
        const arc = d3.arc()
            .innerRadius(this.inn_radius)
            .outerRadius(this.radius);

        const color = d3.scaleOrdinal(d3.schemeCategory10); // Color scale
        if(this.col){
            this.chart.selectAll('pie')
                .data( pie(this.data) )
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', d => color(d.data.label))
                .attr('stroke', 'white')
                .style('stroke-width', '2px');
        } else {
            this.chart.selectAll('pie')
                .data( pie(this.data) )
                .enter()
                .append('path')
                .attr('d', arc)
                .attr('fill', 'black')
                .attr('stroke', 'white')
                .style('stroke-width', '2px');
        }

        this.chart.selectAll('text')
            .data(pie(this.data))
            .enter()
            .append('text')
            .attr('transform', d => `translate(${arc.centroid(d)})`) // Position at segment center
            .attr('text-anchor', 'middle') // Center the text
            .attr('font-size', '12px') // Optional: Customize font size
            .attr('fill', 'white') // Text color
            .text(d => d.data.label);
        
    }
}

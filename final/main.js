let input_data;
let scatter_plot;
let bar_chart;
let filter = [];

d3.csv("https://raw.githubusercontent.com/Sarinoxis/Visualisation-Kobe/refs/heads/main/final/Mall_Customers.csv")
    .then( data => {
        input_data = data;
        input_data.forEach( d => {
            d.Age = +d.Age;
            d.Annual_Income = +d.Annual_Income;
            d.Spending_Score = +d.Spending_Score;
        });

        const color_scale = d3.scaleOrdinal( d3.schemeCategory10 );
        color_scale.domain(['Male','Female']);

        min_age = 0;
        max_age = 100;
        min_score = 0;

        scatter_plot = new ScatterPlot( {
            parent: '#drawing_region_scatterplot',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Annual Income (k$)',
            ylabel: 'Spending Score (1-100)',
            cscale: color_scale
        }, input_data );
        scatter_plot.update();

        bar_chart = new BarChart( {
            parent: '#drawing_region_barchart',
            width: 256,
            height: 256,
            margin: {top:10, right:10, bottom:50, left:50},
            xlabel: 'Genre',
            cscale: color_scale
        }, input_data );
        bar_chart.update();

        function update_min_age(min_ages) {
            min_age = min_ages;
          }
          
        d3.select('#min_age-slider')
            .on('input', function() {
                update_min_age(parseInt(this.value));
                d3.select('#min_age-value').text(this.value);
                bar_chart.update(min_age, max_age, min_score);
                scatter_plot.update(min_age, max_age, min_score);
            });

        function update_max_age(max_ages) {
            max_age = max_ages;
            // console.log(this.max_age);
            }
              
        d3.select('#max_age-slider')
            .on('input', function() {
                update_max_age(parseInt(this.value));
                d3.select('#max_age-value').text(this.value);
                bar_chart.update(min_age, max_age, min_score);
                scatter_plot.update(min_age, max_age, min_score);
            });
        
        function update_min_score(min_scores) {
            min_score = min_scores;
            // console.log(this.max_age);
            }
                
        d3.select('#min_score-slider')
            .on('input', function() {
                update_min_score(parseInt(this.value));
                d3.select('#min_score-value').text(this.value);
                bar_chart.update(min_age, max_age, min_score);
                scatter_plot.update(min_age, max_age, min_score);
            });
    })
    .catch( error => {
        console.log( error );
    });

function Filter() {
    if ( filter.length == 0 ) {
        scatter_plot.data = input_data;
    }
    else {
        scatter_plot.data = input_data.filter( d => filter.includes( d.Genre ) );
    }
    scatter_plot.update();
}

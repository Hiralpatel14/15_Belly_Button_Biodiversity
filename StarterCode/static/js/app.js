function buildMetadata(sample) {
  // @TODO: Complete the following function that builds the metadata panel
  // Use `d3.json` to fetch the metadata for a sample
  var metadataURL = `/metadata/${sample}`
    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select(`#sample-metadata`);
      
    d3.json(metadataURL).then(function(sample){
      
      // Use `.html("") to clear any existing metadata
      sample_metadData.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
      console.log(Object.entries(sample));
      Object.entries(sample).forEach(function([key,value]){
        var row = sample_metadata.append("p");
        row.text(`${key}:${value}`)
        row.append('hr')
      })
    });    
     // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var plotData = `/samples/${sample}`;
  // @TODO: Build a Bubble Chart using the sample data
  d3.json(plotData).then(function(data){
    var x_axis = data.otu_ids;
    var y_axis = data.sample_values;
    var texts = data.otu_labels;
    var size = data.sample_values;
    var color = data.otu_ids;
    
    //trace bubble
    var bubble = {
      x: x_axis,
      y: y_axis,
      text: texts,
      mode: 'markers',
      markers: {
        size: size,
        color: color
      }
    };

    var data = [bubble];            // data 

    var layout = {
      title: "Belly Button Bacteria",
      xaxis: {title: "OTU ID"},
      yaxis: {title: 'Sample Value'},

      width:1100,
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
  };

  Plotly.newPlot("bubble", data, layout);

  // @TODO: Build a Pie Chart
    // HINT: You will need to use slice() to grab the top 10 sample_values,
   // otu_ids, and labels (10 each).
  d3.json(plotData).then(function(data){
    var values = data.sample_values.slice(0,10);
    var labels = data.otu_ids.slice(0,10);
    var display = data.otu_labels.slice(0,10);

    // trace and data for piechart
    var pie_chart = [{
      values: values,
      labels: labels,
      hovertext: display,
      type: "pie"
    }];
    
    var layout = {
      title: '<b> Belly Button Pie Chart </b>',
      plot_bgcolor: 'rgba(0, 0, 0, 0)',
      paper_bgcolor: 'rgba(0, 0, 0, 0)',
  };
    Plotly.newPlot('pie', pie_chart , layout, {responsive: true});
  //  Plotly.newPlot('pie','pie_chart',)
  });
 });    
};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
};

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();


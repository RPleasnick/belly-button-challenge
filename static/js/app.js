// Build the metadata panel
function buildMetadata(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(sample);
    // get the metadata field
    let metadataField = data.metadata;

    // Filter the metadata for the object with the desired sample number
    let metadataNum = metadataField.filter(item => item.id == sample)[0];
    console.log(metadataNum);

    // Use d3 to select the panel with id of `#sample-metadata`
    let panel = d3.select('#sample-metadata');

    // Use `.html("") to clear any existing metadata
    panel.html("");

    // Inside a loop, you will need to use d3 to append new
    // tags for each key-value in the filtered metadata.

    Object.entries(metadataNum).forEach(([key, value]) => {
      panel.append("p").text(`${key}: ${value}`);
    });


  });
}

// function to build both charts
function buildCharts(sample) {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(sample);
    // Get the samples field
    let samplesField = data.samples;

    // Filter the samples for the object with the desired sample number
    let sampleObject = samplesField.filter(item => item.id == sample)[0];
    console.log(sampleObject);

    // Get the otu_ids, otu_labels, and sample_values
    const otuIds = sampleObject.otu_ids;
    const otuLabels = sampleObject.otu_labels;
    const sampleValues = sampleObject.sample_values;

    // Build a Bubble Chart
    var trace1 = {
      x: otuIds,
      y: sampleValues,
      mode: 'markers',
      marker: {
        size: sampleValues
      }
    };

    var data = [trace1];

    var layout = {
      title: 'Bacteria Cultures Per Sample',
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Number of Bacteria" },
      showlegend: false,
      height: 500,
      width: 1000
    };



    // Render the Bubble Chart
    Plotly.newPlot('bubble', data, layout);

    // For the Bar Chart, map the otu_ids to a list of strings for your yticks
    let yticks = otuIds.map(otuId => String(`OTU  ${otuId} `)).slice(0, 10).reverse();

    // Build a Bar Chart
    var data = [{
      type: 'bar',
      y: yticks,
      x: sampleValues.slice(0, 10).reverse(),
      orientation: 'h'
    }];

    var layout = {
      title: "Top 10 Bacteria Cultures Found",
      xaxis: { title: "Number of Bacteria" },
      yaxis: {

      },
      height: 500,
      width: 800

    };


    // Render the Bar Chart
    Plotly.newPlot('bar', data, layout);

  });
}

// Function to run on page load
function init() {
  d3.json("https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json").then((data) => {
    console.log(data);
    // Get the names field
    let names = data.names;
    console.log(names);

    // Use d3 to select the dropdown with id of `#selDataset`
    let dropdown = d3.select('#selDataset');

    // Use the list of sample names to populate the select options
    // Hint: Inside a loop, you will need to use d3 to append a new
    // option for each sample name.
    for (let i = 0; i < names.length; i++) {
      dropdown.append("option").text(names[i]).property("value", names[i]);

    }

    // Get the first sample from the list
    let first = names[0];

    // Build charts and metadata panel with the first sample
    buildCharts(first);
    buildMetadata(first);
  });
}

// Function for event listener
function optionChanged(newSample) {
  // Build charts and metadata panel each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();

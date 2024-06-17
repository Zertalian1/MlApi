"use client"

import Plot from 'react-plotly.js';

const MyPlot = ({ plotDataX, plotDataY, plotTitle, plotXaxis, plotYaxis }) => {
  const layout = {
    title: plotTitle,
    xaxis: {
      title: plotYaxis
    },
    yaxis: {
      title: plotXaxis
    },
    height: 700,
    width: 1500
  };

  return <Plot
    data={[ {x: [...plotDataX], y: [...plotDataY], type: 'scatter'}]}
    layout={layout}
  />;
};

export default MyPlot;
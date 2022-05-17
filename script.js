// Boilerplate by Saketh YS Reddy
import * as d3 from "https://cdn.skypack.dev/d3@7";
import {drag} from "https://cdn.skypack.dev/d3-drag@3";

var colorScale = ['orange', 'lightblue', '#B19CD9'];

const graph = ({
    nodes: Array.from({length:13}, () => ({})),
    links: [
      { source: 0, target: 1 },
      { source: 1, target: 2 },
      { source: 2, target: 0 },
      { source: 1, target: 3 },
      { source: 3, target: 2 },
      { source: 3, target: 4 },
      { source: 4, target: 5 },
      { source: 5, target: 6 },
      { source: 5, target: 7 },
      { source: 6, target: 7 },
      { source: 6, target: 8 },
      { source: 7, target: 8 },
      { source: 9, target: 4 },
      { source: 9, target: 11 },
      { source: 9, target: 10 },
      { source: 10, target: 11 },
      { source: 11, target: 12 },
      { source: 12, target: 10 }
    ]
  })

var numNodes = 13;
var nodes = d3.range(numNodes).map(function (d, i) {
    return {
        radius: Math.random() * 25,
        category: i % 3
    }
});

var simulation = d3.forceSimulation()
    .nodes(nodes)
    .force('charge', d3.forceManyBody().strength(-10))
    .force('center', d3.forceCenter())
    .force('collision', d3.forceCollide().radius(function (d) {
        return d.radius;
    }))
    .force("link", d3.forceLink(graph.links))
    .on('tick', ticked);

const dragHandle = d3.drag()
  .on("start", dragstart)
  .on("drag", dragged);

node.call(dragHandle).on("click", click);

 
var w = window.innerWidth;
var h = window.innerHeight; 

function ticked() {
    var u = d3.select('svg g')
        .attr("transform", "translate("+w/2+","+h/2+")")
        .selectAll('circle')
        .data(nodes)
        .join('circle')
        .attr('r', function (d) {
            return d.radius;
        })
        .style('fill', function (d) {
            return colorScale[d.category];
        })
        .attr('cx', function (d) {
            return d.x;
        })
        .attr('cy', function (d) {
            return d.y;
        });
}

function dragstart() {
  d3.select(this).classed("fixed", true);
}

function dragged(event, d) {
  d.fx = clamp(event.x, 0, width);
  d.fy = clamp(event.y, 0, height);
  simulation.alpha(1).restart();
}

//---------------
/*
const simulation = d3
    .forceSimulation()
    .nodes(graph.nodes)
    .force("charge", d3.forceManyBody())
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("link", d3.forceLink(graph.links))
    .on("tick", tick);

  const drag = d3
    .drag()
    .on("start", dragstart)
    .on("drag", dragged);

  node.call(drag).on("click", click);

  function tick() {
    link
      .attr("x1", d => d.source.x)
      .attr("y1", d => d.source.y)
      .attr("x2", d => d.target.x)
      .attr("y2", d => d.target.y);
    node
      .attr("cx", d => d.x)
      .attr("cy", d => d.y);
  }

  function click(event, d) {
    delete d.fx;
    delete d.fy;
    d3.select(this).classed("fixed", false);
    simulation.alpha(1).restart();
  }

  function dragstart() {
    d3.select(this).classed("fixed", true);
  }

  function dragged(event, d) {
    d.fx = clamp(event.x, 0, width);
    d.fy = clamp(event.y, 0, height);
    simulation.alpha(1).restart();
  }
*/
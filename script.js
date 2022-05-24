// Boilerplate by Saketh YS Reddy
import * as d3 from "https://cdn.skypack.dev/d3@7";

var width = window.innerWidth;
var height = window.innerHeight; 


//Some example relational data
const graph = ({
    nodes: Array.from({length:13}, (i) => ({index: i})),
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



// Append a g element to the SVG, create links and nodes
const svg = d3.select("svg")
const g = svg.append("g")
  .attr("transform", "translate("+width/2+","+height/2+")"),
link = g
  .selectAll(".link")
  .data(graph.links)
  .join("line")
  .classed("link", true),
node = g
  .selectAll(".node")
  .data(graph.nodes)
  .join("circle")
  .attr("r", 12)
  .classed("node", true)
  .classed("fixed", d => d.fx !== undefined);

// Zoom functionality
svg .call(d3.zoom().on("zoom", zoomed));

function zoomed({transform}) {
  // console.log(transform);
  g.attr("transform", transform);
}
const zoom = d3.zoom()
      .scaleExtent([1, 40])
      .on("zoom", zoomed);

svg.call(zoom.transform, d3.zoomIdentity.translate(width/2, height/2));

const simulation = d3
  .forceSimulation()
  .nodes(graph.nodes)
  .force("charge", d3.forceManyBody())
  .force("center", d3.forceCenter())
  .force("link", d3.forceLink(graph.links))
  .on("tick", tick);

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

// Drag and click functionality
const dragHandle = d3
  .drag()
  .on("start", dragstart)
  .on("drag", dragged)
  .on("end", dragended);

node.call(dragHandle).on("click", click);

function dragstart(event, d) {
  //Change what happens when they are initially held down here
  if (!event.active) simulation.alphaTarget(0.3).restart();
  d.fx = d.x;
  d.fy = d.y;
  d3.select(this).classed("fixed", true);
}

function dragged(event, d) {
  //Change what happens while they are moving here
  d.fx = event.x;
  d.fy = event.y;
}

function dragended(event, d) {
  //Change what happens while they are released here
  if (!event.active) simulation.alphaTarget(0);
  d.fx = null;
  d.fy = null;
  d3.select(this).classed("fixed", false);
}

// function spawn(parent) {
//   console.log("spawning from parent", parent.index);
//   console.log(parent);
//   parent.index = graph.nodes.length;
//   // parent.vx++;
//   // parent.vy++;
//   graph.nodes.push(parent);
//   console.log(graph.nodes);
//   simulation.alpha(1).restart();
// }

function click(event, d) {
  //Change what happens when nodes are clicked here
  console.log("clicked", this);
  spawn(d);
  // simulation.alpha(1).restart();
}

//----------------------------------------------------------------------------------
//Create Node
function spawn(source) {
  graph.nodes.push(source);

  for (const target of nodes) {
    if (inrange(source, target)) {
      graph.links.push({source, target});
    }
  }

  link = link
    .data(graph.links)
    .join("line");

  node = node
    .data(graph.nodes)
    .join(
      enter => enter.append("circle").attr("r", 0)
        .call(enter => enter.transition().attr("r", 5))
        .call(dragHandle).on("click", click),
      update => update,
      exit => exit.remove()
    );

  simulation.nodes(graph.nodes);
  simulation.force("link").links(graph.links);
  simulation.alpha(1).restart();

  svg.property("value", {
    nodes: graph.nodes.map(d => ({id: d.index})),
    links: graph.links.map(d => ({source: d.source.index, target: d.target.index}))
  });
}

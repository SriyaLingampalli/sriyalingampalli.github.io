var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 1960 - margin.right - margin.left,
    height = 900 - margin.top - margin.bottom;


var svg = d3.select("body").append("svg")
    .attr("width", width + margin.right + margin.left)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
console.log("svg")
console.log(svg)
//    
//
//var key = svg.append("rect")
//    .attr("x", 0.8*width)
//    .attr("y", 220)
//    .attr("width", 150)
//    .attr("height", 160)
//    .style("fill", "#fff")
//    .style("opacity", 0.8);

svg.append("text")
    .text("Required")
    .attr("x", 0.815*width)
    .attr("y", 0.3*height)
    .style("fill", "#fff")
    .style("font-family", "sans-serif");

svg.append("circle")
    .attr("class", "dot")
    .attr("r", 10)
    .attr("cx", 0.865*width)
    .attr("cy", 0.295*height)
    .style("fill", "#66cd00");

svg.append("text")
    .text("DC")
    .attr("x", 0.815*width)
    .attr("y", 0.35*height)
    .style("fill", "#fff")
    .style("font-family", "sans-serif");  

svg.append("circle")
    .attr("class", "dot")
    .attr("r", 10)
    .attr("cx", 0.865*width)
    .attr("cy", 0.345*height)
    .style("fill", "#f7872f");
    
svg.append("text")
    .text("Capstone")
    .attr("x", 0.815*width)
    .attr("y", 0.4*height)
    .style("fill", "#fff")
    .style("font-family", "sans-serif");  

svg.append("circle")
    .attr("class", "dot")
    .attr("r", 10)
    .attr("cx", 0.865*width)
    .attr("cy", 0.395*height)
    .style("fill", "#f7072f");


var i = 0,
    duration = 750,
    root;

var tree = d3.tree()
//var tree = d3.layout.tree()
    .size([height, width]);

// tooltip
// Add tooltip div
var div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 1e-6);
//
//var diagonal = d3.svg.diagonal()
//    .projection(function(d) { return [d.y, d.x]; });
//    
    console.log("tree")
    console.log(tree)
function diagonal(s, d) {
    path = `M ${s.y} ${s.x}
            C ${(s.y + d.y) / 2} ${s.x},
              ${(s.y + d.y) / 2} ${d.x},
              ${d.y} ${d.x}`

    return path
  }

var shown = false;
    
//d3.csv("BRICSdata.csv", type).then(function(data) 
//                                
//d3.json("flare.json", function(error, flare) {
//  if (error) throw error;
d3.json("UCSCclasses.json").then(function(flare) {
                           
//  root = flare;
  root = d3.hierarchy(flare, function(d) { return d.children; });
  root.x0 = height / 2;
  root.y0 = 0;

  function collapse(d) {
    if (d.children) {
      d._children = d.children;
      d._children.forEach(collapse);
      d.children = null;
    }
  }

  root.children.forEach(collapse);
  console.log("prior update root")
  console.log(root)
  update(root);
    
});
console.log("got json")

d3.select(self.frameElement).style("height", "800px");

function update(source) {
    console.log("in update")

//  // Compute the new tree layout.
//  var nodes = tree.nodes(root).reverse(),
//      links = tree.links(nodes);

  // Assigns the x and y position for the nodes
  var treeData = tree(root); 
console.log("treeData")
console.log(treeData)
  // Compute the new tree layout.
  var nodes = treeData.descendants(),
      links = treeData.descendants().slice(1);

  // Normalize for fixed-depth.
  nodes.forEach(function(d) { d.y = d.depth * 180; });

  // Update the nodes…
  var node = svg.selectAll("g.node")
      .data(nodes, function(d) { return d.id || (d.id = ++i); });

  // Enter any new nodes at the parent's previous position.
  var nodeEnter = node.enter().append("g")
      .attr("class", "node")
      .attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
      .on("click", click)
      .on("mouseover", function(d){mouseover(d);})
      .on("mousemove", function(d){mousemove(d);})
      .on("mouseout", function(d){mouseout(d);})
        
  
  
  
  
  
//      .on("mouseover", function(d) {
//      var g = d3.select(this); // The node
//      // The class is used to remove the additional text later
//      var info = g.append('text')
//         .classed('info', true)
//         .attr('x', 20)
//         .attr('y', 20)
////         .text('More info');
//        .text(function(d) { 
//        return d.data.size; })
//      })
//      .on("mouseout", function() {
//      // Remove the info text on mouse out.
//      d3.select(this).select('text.info').remove();
//      });

  nodeEnter.append("circle")
      .attr("r", 1e-6)
//      .attr("stroke", "#f7872f")
      .style("stroke", function(d) { 
            if (d.data.dc == "true") {
                return "#f7872f";
            }
            else if (d.data.capstone == "true") {
                return "#f7072f";
            }
            else if (d.data.required == "true") {
                return "#66cd00";
            }
            else {
                return "lightsteelblue"; 
            }
      })
      .style("fill", function(d) { 
            if (d.data.dc == "true") {
                return "#f7872f";
            }
            else if (d.data.capstone == "true") {
                return "#f7072f";
            }
            else if (d.data.required == "true") {
                return "#66cd00";
            }
            else {
                return d._children ? "lightsteelblue" : "#fff"; 
            }
        });

  nodeEnter.append("text")
      .attr("x", function(d) { return d.children || d._children ? -10 : 10; })
      .attr("dy", ".35em")
      .attr("text-anchor", function(d) { return d.children || d._children ? "end" : "start"; })
//      .text(function(d) { return d.name; })
      .text(function(d) { 
        console.log("d.data.name");
        console.log(d.data.name);
        return d.data.name; })
      .style("fill-opacity", 1e-6);
    
// ADDED
var nodeUpdate = nodeEnter.merge(node);
    
  // Transition nodes to their new position.
//  var nodeUpdate = node.transition()
  nodeUpdate.transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + d.y + "," + d.x + ")"; });

  nodeUpdate.select("circle")
      .attr("r", 4.5)
      .style("fill", function(d) { 
            if (d.data.dc == "true") {
                return "#f7872f";
            }
            else if (d.data.capstone == "true") {
                return "#f7072f";
            }
            else if (d.data.required == "true") {
                return "#66cd00";
            }
            else {
                return d._children ? "lightsteelblue" : "#fff"; 
            }
        });

  nodeUpdate.select("text")
      .style("fill-opacity", 1);

  // Transition exiting nodes to the parent's new position.
  var nodeExit = node.exit().transition()
      .duration(duration)
      .attr("transform", function(d) { return "translate(" + source.y + "," + source.x + ")"; })
      .remove();

  nodeExit.select("circle")
      .attr("r", 1e-6);

  nodeExit.select("text")
      .style("fill-opacity", 1e-6);

  // Update the links…
  var link = svg.selectAll("path.link")
//      .data(links, function(d) { return d.target.id; });
      .data(links, function(d) { return d.id; });

  // Enter any new links at the parent's previous position.
  var linkEnter = link.enter().insert("path", "g")
      .attr("class", "link")
      .attr("d", function(d) {
        var o = {x: source.x0, y: source.y0};
        console.log("linkEnter o")
        console.log(o)
        return diagonal(o, o)
//        return diagonal({source: o, target: o});
      });
    var linkUpdate = linkEnter.merge(link);

  // Transition links to their new position.
  linkUpdate.transition()
      .duration(duration)
//      .attr("d", diagonal);
      .attr('d', function(d){ return diagonal(d, d.parent) });

  // Transition exiting nodes to the parent's new position.
  link.exit().transition()
      .duration(duration)
      .attr("d", function(d) {
        var o = {x: source.x, y: source.y};
//        return diagonal({source: o, target: o});
        return diagonal(o, o)
      })
      .remove();

  // Stash the old positions for transition.
  nodes.forEach(function(d) {
    d.x0 = d.x;
    d.y0 = d.y;
  });
}

// Toggle children on click.
function click(d) {
  if (d.children) {
    d._children = d.children;
    d.children = null;
  } else {
    d.children = d._children;
    d._children = null;
  }
  update(d);
}

function mouseover(d) {
//    console.log(d.data.size.length)
    if (d.data.size != undefined) {
        div.transition()
        .duration(300)
        .style("opacity", 1);
    }
}

function mousemove(d) {
//    console.log(d.data.size)
    if (d.data.size != undefined) {
        div
        .text("Description: " + d.data.size)
        .style("left", (d3.event.pageX ) + "px")
        .style("top", (d3.event.pageY) + "px");
    }
}
    

function mouseout(d) {
    if (d.data.size != undefined) {
        div.transition()
        .duration(300)
        .style("opacity", 1e-6);
//        div.remove();
    }
}

//function showall() {
//    console.log("shhowing")
//    var children = (root.children) ? root.children : root._children;
//    click(root)
//    if(children)
//      children.forEach(click);
//    update(root)
//}

function show(d){   
    var children = (d.children) ? d.children : d._children;
    if (d._children) {        
        d.children = d._children;
        d._children = null;       
    }
    if(children)
      children.forEach(show);
}

function showAll(){
    show(root); 
    update(root);
    shown = true;
}

function hide(d) {
  if (d.children) {
    d._children = d.children;
    d._children.forEach(hide);
    d.children = null;
  }
}

function hideAll(){
    root.children.forEach(hide);
    hide(root);
    update(root);
    shown = false;
}

function seeAllButton() {
    if (shown) {
        hideAll()
        document.querySelector('#seeAll').innerText = 'See All';
    }
    else {
        showAll()
        document.querySelector('#seeAll').innerText = 'Hide All';
    }
}
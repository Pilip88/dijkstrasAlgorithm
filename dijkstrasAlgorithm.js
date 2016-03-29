function BinaryHeap(valueFunction) {
	this.valueFunction = valueFunction;
	this.heap = [];
};
BinaryHeap.prototype = {
	insert: function(node) {
		// Add node to the end of the heap.
		this.heap.push(node);
		// Call bubbleUp method to move the
		// node to the proper position.
		this.bubbleUp(this.heap.length - 1);
	},
	pop: function() {
		// Get the root node.
		var rootNode = this.heap[0];
		// Get the last node, to put
		// as the new root node.
		var lastNode = this.heap.pop();
		// If the heap is not empty,
		// add the last node and let it
		// bubbleDown.
		if (this.heap.length > 0) {
			this.heap[0] = lastNode;
			this.bubbleDown(0);
		};
		return rootNode;
	},
	update: function(nodeName, newValue) {
		// Get the length of heap.
		var length = this.heap.length;
		// Find node in heap.
		for (var i = 0; i < length; i++) {
			if (this.heap[i][0] === nodeName) {
				// Get the old value of node.
				var oldValue = this.heap[i][1];
				// If the new value is smaller then old,
				// update it and rearrange it.
				if (parseInt(newValue) < oldValue) {
					this.heap[i][1] = newValue;
					this.bubbleUp(i);
					this.bubbleDown(i);
					break;
				};
			};
		};
	},
	size: function() { return this.heap.length },
	bubbleUp: function(node) {
		// Get the node element.
		var nodeElement = this.heap[node];
		// Get the node value.
		var nodeValue = this.valueFunction(nodeElement);

		while (node > 0) {
			// Get the index of the parent node.
			var parentNodeIndex = Math.floor((node + 1) / 2) - 1;
			// Get the parent element.
			var parentElement = this.heap[parentNodeIndex];
			// Get the parent value.
			var parentValue = this.valueFunction(parentElement);
			// If the node value is smaller than parent node value,
			// swap them.
			if (nodeValue < parentValue) {
				// Move child node to parent node.
				this.heap[parentNodeIndex] = nodeElement;
				// Move parent node to child node.
				this.heap[node] = parentElement;
				// Change node index.
				node = parentNodeIndex;
			} else {
				break;
			};
		};
	},
	bubbleDown: function(node) {
		while (true) {
			// Get the node element.
			var nodeElement = this.heap[node];
			// Get the node value.
			var nodeValue = this.valueFunction(nodeElement);
			// Node to swap, undefined at the beginning.
			var swap = undefined;
			// Get the index of child nodes.
			var childNodeRIndex = ((node + 1) * 2);
			var childNodeLIndex = childNodeRIndex - 1;

			// Check if right child exists.
			if (childNodeRIndex < this.heap.length) {
				// Get the right child element.
				var childElementR = this.heap[childNodeRIndex];
				// Get the value of the right child.
				var childNodeRValue = this.valueFunction(childElementR);
				// If child value is smaller than parent,
				// assign swap variable with the index of
				// the right child.
				if (childNodeRValue < nodeValue)
					swap = childNodeRIndex;
			};

			// Check if left child exists.
			if (childNodeLIndex < this.heap.length) {
				// Get the left child element.
				var childElementL = this.heap[childNodeLIndex];
				// Get the value of the left child.
				var childNodeLValue = this.valueFunction(childElementL);
				// If child value is smaller than parent,
				// and smaller than right child value,
				// assign swap variable with the index of
				// the left child.
				if (childNodeLValue < nodeValue &&
					childNodeRIndex < this.heap.length &&
					childNodeLValue < this.valueFunction(this.heap[childNodeRIndex])) {
					swap = childNodeLIndex;
				};
			};

			// No need to swap.
			if (swap === undefined) break;
			// Swap nodes.
			this.heap[node] = this.heap[swap];
			this.heap[swap] = nodeElement;
			// Change node index.
			node = swap;
		};
	}
};

// Tests for BinaryHeap
/*
var heap = new BinaryHeap(function(i) { return i });
var num = [2,5,3,8,1,45,33,6];
for (var i = 0; i < num.length; i++) {
	heap.insert(num[i]);
}

for (var i = 0; i < 8; i++) {
	console.log(heap.pop())
}
console.log("----------------------------------------");

var heap = new BinaryHeap(function(node) { return node[1] });
var num = [["A", 10], ["B", 3], ["C", 33], ["D", 1], ["E", 8], ["F", 2], ["G", 120], ["H", 88]];
for (var i = 0; i < num.length; i++)
	heap.insert(num[i]);
while (heap.heap.length > 0)
	console.log(heap.pop());
*/


function Dijkstra(graph, start, end) {
	// Input graph.
	this.graph = graph;
	// Start vertex.
	this.start = start;
	// End vertex.
	this.end = end;
	// Object with Vertex name as key,
	// and distance from start node as value.
	// Empty at the beginning.
	this.distances = {};
	// Binary Min-Heap.
	this.binaryHeap = new BinaryHeap(function(vertex) {
		return vertex[1];
	});
	// Array for storing path from start to end.
	this.path = [];
	// Add Vertices from the graph to binaryHeap.
	for (var vertex in this.graph) {
		// If start vertex, distance is 0.
		// Else distance is Infinity.
		vertex === this.start ? this.binaryHeap.insert([vertex, 0]) :
			this.binaryHeap.insert([vertex, Infinity]);
	};

	while (this.binaryHeap.size() > 0) {
		// Get current vertex from binaryHeap.
		// Current vertex is the vertex with
		// minimum distance from the starting node.
		var currentVertex = this.binaryHeap.pop();
		// Add current vertex and distance to the
		// distance object.
		this.distances[currentVertex[0]] = currentVertex[1];
		// If currentVertex is the end, break.
		if (currentVertex[0] === this.end) break;
		// Go through all edges of current vertex.
		for (var currentEdge in this.graph[currentVertex[0]]) {
			// Calculate new distance from the starting vertex.
			var newDistance = currentVertex[1] + this.graph[currentVertex[0]][currentEdge];
			// Update binaryHeap with the new distance.
			this.binaryHeap.update(currentEdge, newDistance);
		};
	};
};
Dijkstra.prototype.getPath = function() {
	if (this.end != undefined &&
		this.distances[this.end] != Infinity) {
		this.path.push(this.end);
		while (true) {
			// Get the name of last vertex in path.
			var last = this.path[this.path.length - 1];
			// If last is start vertex end and return path.
			if (last === this.start) break;
			// Get the edge with smallest distance from start.
			var smallestNode, smallestValue = Infinity;
			for (var edge in this.graph[last]) {
				if (this.distances[edge] < smallestValue) {
					smallestValue = this.distances[edge];
					smallestNode = edge;
				};
			};
			// Add smallest node to the path.
			this.path.push(smallestNode);
		};
		return this.path;
	};
	return false;
};

// Test for Dijkstra's algorithm.
var graph = {
    "A": {"B": 2, "C": 1, "D": 3},
    "B": {"A": 2},
    "C": {"A": 1, "I": 2},
    "D": {"A": 3, "F": 2, "E": 3},
    "E": {"D": 3, "G": 3},
    "F": {"D": 2, "G": 4},
    "G": {"E": 3, "F": 4, "H": 5},
    "H": {"G": 5, "I": 3},
    "I": {"C": 2, "J": 1, "H": 3},
    "J": {"I": 1, "K": 3},
    "K": {"J": 3}
}
var dj = new Dijkstra(graph, "K", "B");
console.log(dj.distances);
console.log(dj.getPath())
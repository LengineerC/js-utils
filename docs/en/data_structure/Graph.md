# Graph

A collection of classes for creating, manipulating, and traversing graph data structures. Supports directed/undirected, weighted/unweighted graphs, and provides common graph algorithms.

## Classes

### BaseGraph\<T, W = undefined\>

**(Abstract Base Class)**

Abstract base class for graph data structures. Provides common functionality shared by all graphs (directed/undirected), such as vertex management, BFS and DFS traversal. Not exported, for reference only.

> **Note:** This is an `abstract` class and cannot be directly instantiated.

#### Common Methods

##### addVertex

Add a new vertex to the graph. If the vertex already exists, no operation is performed.

```typescript
public addVertex(vertex: T): void
```

**Parameters:**

  - `vertex: T` - The vertex to add

##### removeVertex

Remove a vertex and all its related edges from the graph.

```typescript
public removeVertex(vertex: T): void
```

**Parameters:**

  - `vertex: T` - The vertex to remove

##### hasVertex

Check if a vertex exists in the graph.

```typescript
public hasVertex(vertex: T): boolean
```

**Parameters:**

  - `vertex: T` - The vertex to check

**Return Value:**

  - `boolean` - Returns `true` if the vertex exists, otherwise `false`

##### getVertices

Get all vertices in the graph.

```typescript
public getVertices(): T[]
```

**Return Value:**

  - `T[]` - An array containing all vertices

##### getNeighbors

Get all neighbors of a specified vertex and their edge weights.

```typescript
public getNeighbors(vertex: T): Array<[T, W]>
```

**Parameters:**

  - `vertex: T` - The target vertex

**Return Value:**

  - `Array<[T, W]>` - An array of tuples containing neighbors and their corresponding weights

##### size (getter)

Get the number of vertices in the graph.

```typescript
public get size(): number
```

**Return Value:**

  - `number` - The number of vertices

##### bfs

Perform breadth-first search (BFS) from a starting vertex.

```typescript
public bfs(start: T, visit?: (v: T) => void): void
```

**Parameters:**

  - `start: T` - The starting vertex
  - `visit?: (v: T) => void` - Callback function called when visiting each vertex (optional)

##### dfs

Perform depth-first search (DFS) from a starting vertex.

```typescript
public dfs(start: T, visit?: (v: T) => void): void
```

**Parameters:**

  - `start: T` - The starting vertex
  - `visit?: (v: T) => void` - Callback function called when visiting each vertex (optional)

##### clear

Clear all vertices and edges from the graph.

```typescript
public clear(): void
```

##### toString

Represent the graph's adjacency list as a string.

```typescript
public toString(): string
```

**Return Value:**

  - `string` - String representation of the graph

#### Abstract Member Methods

(Must be implemented in subclasses)

##### addEdge

Add an edge to the graph.

```typescript
public abstract addEdge(from: T, to: T, weight?: W): void
```

##### removeEdge

Remove an edge from the graph.

```typescript
public abstract removeEdge(from: T, to: T): void
```

##### hasEdge

Check if an edge exists in the graph.

```typescript
public abstract hasEdge(from: T, to: T): boolean
```

##### getEdges

Get all edges in the graph.

```typescript
public abstract getEdges(): Array<[T, T, W]>
```

-----

### DirectedGraph\<T, W = undefined\>

Directed graph implementation. Inherits from `BaseGraph`. Edges have directionality (e.g., A -> B).

#### Constructor

```typescript
new DirectedGraph<T, W>()
```

#### Member Methods (Overrides & Additions)

##### addEdge (override)

Add a directed edge (`from` -> `to`) to the graph.

```typescript
public override addEdge(from: T, to: T, weight?: W): void
```

**Parameters:**

  - `from: T` - Source vertex
  - `to: T` - Target vertex
  - `weight?: W` - Edge weight (optional)

##### removeEdge (override)

Remove a directed edge (`from` -> `to`) from the graph.

```typescript
public override removeEdge(from: T, to: T): void
```

**Parameters:**

  - `from: T` - Source vertex
  - `to: T` - Target vertex

##### getOutDegree

Get the out-degree of a vertex.

```typescript
public getOutDegree(v: T): number
```

**Parameters:**

  - `v: T` - Target vertex

**Return Value:**

  - `number` - The out-degree of the vertex

##### getInDegree

Get the in-degree of a vertex.

```typescript
public getInDegree(v: T): number
```

**Parameters:**

  - `v: T` - Target vertex

**Return Value:**

  - `number` - The in-degree of the vertex

##### topologicalSort

Perform topological sorting (Kahn's algorithm). Only applicable to directed acyclic graphs (DAG).

```typescript
public topologicalSort(): T[] | null
```

**Return Value:**

  - `T[] | null` - Returns sorted array of vertices, or `null` if the graph contains a cycle

##### hasCycle

Check if the directed graph contains a cycle.

```typescript
public hasCycle(): boolean
```

**Return Value:**

  - `boolean` - Returns `true` if a cycle exists

#### Examples

```typescript
// Assuming DirectedGraph is imported

// 1. Create an unweighted directed graph
const graph = new DirectedGraph<string, undefined>();
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');
graph.addEdge('A', 'C');

console.log(graph.toString());
// A -> B, C
// B -> C
// C -> 

console.log(graph.hasCycle());
// false

console.log(graph.topologicalSort());
// [ 'A', 'B', 'C' ]

// 2. Create a graph with a cycle
graph.addEdge('C', 'A');
console.log(graph.hasCycle());
// true
console.log(graph.topologicalSort());
// null
```

-----

### UndirectedGraph\<T, W = undefined\>

Undirected graph implementation. Inherits from `BaseGraph`. Edges have no directionality (e.g., A - B).

#### Constructor

```typescript
new UndirectedGraph<T, W>()
```

#### Member Methods (Overrides & Additions)

##### addEdge (override)

Add an undirected edge (bidirectional `from` <-> `to`) to the graph.

```typescript
public override addEdge(from: T, to: T, weight?: W): void
```

**Parameters:**

  - `from: T` - Vertex 1
  - `to: T` - Vertex 2
  - `weight?: W` - Edge weight (optional)

##### removeEdge (override)

Remove an undirected edge (bidirectional `from` <-> `to`) from the graph.

```typescript
public override removeEdge(from: T, to: T): void
```

**Parameters:**

  - `from: T` - Vertex 1
  - `to: T` - Vertex 2

##### getEdges (override)

Get all undirected edges in the graph (with deduplication).

```typescript
public override getEdges(): Array<[T, T, W]>
```

**Return Value:**

  - `Array<[T, T, W]>` - Array of tuples containing all edges [v1, v2, weight]

##### getDegree

Get the degree of a vertex in an undirected graph.

```typescript
public getDegree(v: T): number
```

**Parameters:**

  - `v: T` - Target vertex

**Return Value:**

  - `number` - The degree of the vertex

##### hasCycle

Check if the undirected graph contains a cycle.

```typescript
public hasCycle(): boolean
```

**Return Value:**

  - `boolean` - Returns `true` if a cycle exists

#### Examples

```typescript
// Assuming UndirectedGraph is imported

const graph = new UndirectedGraph<string, undefined>();
graph.addEdge('A', 'B');
graph.addEdge('B', 'C');

console.log(graph.hasEdge('A', 'B')); // true
console.log(graph.hasEdge('B', 'A')); // true

console.log(graph.toString());
// A -> B
// B -> A, C
// C -> B

graph.addEdge('C', 'A');
console.log(graph.hasCycle());
// true
```

-----

### WeightedDirectedGraph\<T\>

Weighted directed graph implementation. Inherits from `DirectedGraph<T, number>`, with weight type fixed as `number`.

#### Constructor

```typescript
new WeightedDirectedGraph<T>()
```

#### Member Methods (Overrides & Additions)

##### addEdge (override)

Add a weighted directed edge to the graph.

```typescript
public override addEdge(from: T, to: T, weight: number = 1): void
```

**Parameters:**

  - `from: T` - Source vertex
  - `to: T` - Target vertex
  - `weight: number` - Edge weight (defaults to 1)

##### getWeight

Get the weight of a specified edge.

```typescript
public getWeight(from: T, to: T): number | undefined
```

**Parameters:**

  - `from: T` - Source vertex
  - `to: T` - Target vertex

**Return Value:**

  - `number | undefined` - The weight, or `undefined` if the edge doesn't exist

##### setWeight

Set the weight of an existing edge.

```typescript
public setWeight(from: T, to: T, weight: number): void
```

**Parameters:**

  - `from: T` - Source vertex
  - `to: T` - Target vertex
  - `weight: number` - New weight
  - **(Throws)** - Throws an error if the edge doesn't exist

##### dijkstra

Perform Dijkstra's shortest path algorithm. (Assumes all weights are non-negative)

```typescript
public dijkstra(start: T): Map<T, number>
```

**Parameters:**

  - `start: T` - Starting vertex

**Return Value:**

  - `Map<T, number>` - A Map containing the shortest distances from the starting vertex to all other reachable vertices

#### Examples

```typescript
// Assuming WeightedDirectedGraph is imported

const graph = new WeightedDirectedGraph<string>();
graph.addEdge('A', 'B', 1);
graph.addEdge('A', 'C', 4);
graph.addEdge('B', 'C', 2);
graph.addEdge('B', 'D', 5);
graph.addEdge('C', 'D', 1);

console.log(graph.toString());
// A -> B(1), C(4)
// B -> C(2), D(5)
// C -> D(1)
// D -> 

const distances = graph.dijkstra('A');
console.log(distances.get('D'));
// 4 (shortest path A -> B -> C -> D, total weight 1 + 2 + 1 = 4)
```

-----

### WeightedUndirectedGraph\<T\>

Weighted undirected graph implementation. Inherits from `UndirectedGraph<T, number>`, with weight type fixed as `number`.

#### Constructor

```typescript
new WeightedUndirectedGraph<T>()
```

#### Member Methods (Overrides & Additions)

##### addEdge (override)

Add a weighted undirected edge to the graph.

```typescript
public override addEdge(v1: T, v2: T, weight: number = 1): void
```

**Parameters:**

  - `v1: T` - Vertex 1
  - `v2: T` - Vertex 2
  - `weight: number` - Edge weight (defaults to 1)

##### getWeight

Get the weight of a specified edge.

```typescript
public getWeight(v1: T, v2: T): number | undefined
```

**Parameters:**

  - `v1: T` - Vertex 1
  - `v2: T` - Vertex 2

**Return Value:**

  - `number | undefined` - The weight, or `undefined` if the edge doesn't exist

##### setWeight

Set the weight of an existing edge (bidirectional).

```typescript
public setWeight(v1: T, v2: T, weight: number): void
```

**Parameters:**

  - `v1: T` - Vertex 1
  - `v2: T` - Vertex 2
  - `weight: number` - New weight
  - **(Throws)** - Throws an error if the edge doesn't exist

##### dijkstra

Perform Dijkstra's shortest path algorithm. (Assumes all weights are non-negative)

```typescript
public dijkstra(start: T): Map<T, number>
```

**Parameters:**

  - `start: T` - Starting vertex

**Return Value:**

  - `Map<T, number>` - A Map containing the shortest distances from the starting vertex to all other reachable vertices

#### Examples

```typescript
// Assuming WeightedUndirectedGraph is imported

const graph = new WeightedUndirectedGraph<string>();
graph.addEdge('A', 'B', 1);
graph.addEdge('A', 'C', 4);
graph.addEdge('B', 'C', 2);
graph.addEdge('B', 'D', 5);
graph.addEdge('C', 'D', 1);

const distances = graph.dijkstra('A');
console.log(distances.get('D'));
// 4 (shortest path A -> B -> C -> D, total weight 1 + 2 + 1 = 4)
```


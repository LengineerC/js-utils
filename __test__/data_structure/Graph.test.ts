import { DirectedGraph, UndirectedGraph, WeightedDirectedGraph, WeightedUndirectedGraph } from '../../src';

// ===================================================================
// 1. 有向图 (DirectedGraph)
// ===================================================================

describe('DirectedGraph', () => {
  let graph: DirectedGraph<string, undefined>;

  beforeEach(() => {
    // 泛型 W 明确为 undefined，用于测试无权图
    graph = new DirectedGraph<string, undefined>();
  });

  it('should add vertices and edges', () => {
    graph.addEdge('A', 'B');
    expect(graph.hasVertex('A')).toBe(true);
    expect(graph.hasVertex('B')).toBe(true);
    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(false);
  });

  it('should handle adding existing vertex without duplication', () => {
    graph.addVertex('A');
    graph.addVertex('A');
    expect(graph.size).toBe(1);
  });

  it('should remove vertices and their associated edges', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');

    graph.removeVertex('B');

    expect(graph.hasVertex('B')).toBe(false);
    expect(graph.hasEdge('A', 'B')).toBe(false); // 边 (A->B) 应被删除
    expect(graph.hasEdge('B', 'C')).toBe(false); // 边 (B->C) 应被删除
    expect(graph.getNeighbors('A')?.includes(['B', undefined])).toBe(false); // 邻居检查
    expect(graph.getNeighbors('C')?.includes(['B', undefined])).toBe(false); // 邻居检查
    expect(graph.size).toBe(2);
  });

  it('should do nothing when removing non-existent vertex', () => {
    graph.addEdge('A', 'B');
    const originalSize = graph.size;
    graph.removeVertex('Z');
    expect(graph.size).toBe(originalSize);
  });

  it('should remove edges', () => {
    graph.addEdge('A', 'B');
    graph.removeEdge('A', 'B');
    expect(graph.hasEdge('A', 'B')).toBe(false);
  });

  it('should handle removing non-existent edges gracefully', () => {
    graph.addEdge('A', 'B');
    graph.removeEdge('A', 'C'); // from 存在, to 不存在
    graph.removeEdge('Z', 'A'); // from 不存在
    expect(graph.hasEdge('A', 'B')).toBe(true);
  });

  it('should return false for hasEdge on non-existent vertices', () => {
    expect(graph.hasEdge('Z', 'X')).toBe(false);
    graph.addVertex('A');
    expect(graph.hasEdge('A', 'Z')).toBe(false);
  });

  it('should get all vertices', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('C', 'D');
    expect(graph.getVertices()).toEqual(expect.arrayContaining(['A', 'B', 'C', 'D']));
  });

  it('should get neighbors and weights (undefined for unweighted)', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C', undefined); // 显式传递 undefined
    expect(graph.getNeighbors('A')).toEqual(expect.arrayContaining([['B', undefined], ['C', undefined]]));
  });

  it('should return empty array for neighbors of non-existent vertex', () => {
    expect(graph.getNeighbors('Z')).toEqual([]);
  });

  it('should get all edges', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    expect(graph.getEdges()).toEqual(expect.arrayContaining([
      ['A', 'B', undefined],
      ['B', 'C', undefined]
    ]));
  });

  it('should get correct in-degree and out-degree', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('D', 'A');

    expect(graph.getOutDegree('A')).toBe(2);
    expect(graph.getInDegree('A')).toBe(1);
    expect(graph.getOutDegree('B')).toBe(0);
    expect(graph.getInDegree('B')).toBe(1);
    expect(graph.getOutDegree('Z')).toBe(0); // Branch: non-existent vertex
    expect(graph.getInDegree('Z')).toBe(0);  // Branch: non-existent vertex
  });

  it('should perform BFS', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');

    const visited: string[] = [];
    graph.bfs('A', v => visited.push(v));

    expect(visited).toEqual(['A', 'B', 'C', 'D', 'E']);
  });

  it('should handle BFS/DFS on non-existent start vertex', () => {
    const visitedBfs: string[] = [];
    graph.bfs('Z', v => visitedBfs.push(v));
    expect(visitedBfs).toEqual([]);

    const visitedDfs: string[] = [];
    graph.dfs('Z', v => visitedDfs.push(v));
    expect(visitedDfs).toEqual([]);
  });

  it('should handle BFS/DFS on complex graph (with visited check)', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('A', 'C'); // 会被 BFS/DFS 检查到

    const visited: string[] = [];
    graph.bfs('A', v => visited.push(v));
    expect(visited).toEqual(['A', 'B', 'C']);
  });

  it('should perform DFS', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'E');

    const visited: string[] = [];
    graph.dfs('A', v => visited.push(v));

    expect(visited).toEqual(['A', 'B', 'D', 'C', 'E']);
  });

  it('should detect a cycle', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');
    expect(graph.hasCycle()).toBe(true);
  });

  it('should detect a cycle (recStack branch)', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'B'); // C -> B
    expect(graph.hasCycle()).toBe(true);
  });

  it('should not detect cycle in a DAG', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('A', 'C');
    expect(graph.hasCycle()).toBe(false);
  });

  it('should handle hasCycle on disconnected components', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('C', 'D'); // No cycle
    expect(graph.hasCycle()).toBe(false);

    graph.addEdge('D', 'C'); // Cycle
    expect(graph.hasCycle()).toBe(true);
  });

  it('should perform topological sort', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    graph.addEdge('B', 'D');
    graph.addEdge('C', 'D');

    const sorted = graph.topologicalSort();
    expect(sorted).toEqual(['A', 'B', 'C', 'D']); // 或 ['A', 'C', 'B', 'D']
  });

  it('should return null for topological sort on a cyclic graph', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');
    expect(graph.topologicalSort()).toBeNull();
  });

  it('should clear the graph', () => {
    graph.addEdge('A', 'B');
    graph.clear();
    expect(graph.size).toBe(0);
    expect(graph.hasVertex('A')).toBe(false);
  });

  it('should return a string representation', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    expect(graph.toString()).toBe('A -> B, C\nB -> \nC -> ');
  });
});

// ===================================================================
// 2. 无向图 (UndirectedGraph)
// ===================================================================

describe('UndirectedGraph', () => {
  let graph: UndirectedGraph<string, undefined>;

  beforeEach(() => {
    graph = new UndirectedGraph<string, undefined>();
  });

  it('should add edges bidirectionally', () => {
    graph.addEdge('A', 'B');
    expect(graph.hasEdge('A', 'B')).toBe(true);
    expect(graph.hasEdge('B', 'A')).toBe(true);
  });

  it('should remove edges bidirectionally', () => {
    graph.addEdge('A', 'B');
    graph.removeEdge('A', 'B');
    expect(graph.hasEdge('A', 'B')).toBe(false);
    expect(graph.hasEdge('B', 'A')).toBe(false);
  });

  it('should remove edges using reverse order', () => {
    graph.addEdge('A', 'B');
    graph.removeEdge('B', 'A');
    expect(graph.hasEdge('A', 'B')).toBe(false);
    expect(graph.hasEdge('B', 'A')).toBe(false);
  });

  it('should get neighbors correctly', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    expect(graph.getNeighbors('A')).toEqual(expect.arrayContaining([['B', undefined], ['C', undefined]]));
    expect(graph.getNeighbors('B')).toEqual([['A', undefined]]);
  });

  it('should get all edges with deduplication', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('C', 'A');

    const edges = graph.getEdges();
    expect(edges).toHaveLength(2);
    // 使用 Set 检查，因为我们不能保证顺序
    const edgeSet = new Set(edges.map(e => [e[0], e[1]].sort().join('-')));
    expect(edgeSet).toContain('A-B');
    expect(edgeSet).toContain('A-C');
  });

  it('should get degree correctly', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('A', 'C');
    expect(graph.getDegree('A')).toBe(2);
    expect(graph.getDegree('B')).toBe(1);
    expect(graph.getDegree('Z')).toBe(0); // Branch: non-existent
  });

  it('should detect a cycle', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('C', 'A');
    expect(graph.hasCycle()).toBe(true);
  });

  it('should not detect cycle in a tree structure', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('B', 'C');
    graph.addEdge('A', 'D');
    expect(graph.hasCycle()).toBe(false);
  });

  it('should handle hasCycle on disconnected components', () => {
    graph.addEdge('A', 'B');
    graph.addEdge('C', 'D'); // No cycle
    expect(graph.hasCycle()).toBe(false);

    graph.addEdge('D', 'E');
    graph.addEdge('E', 'C'); // Cycle
    expect(graph.hasCycle()).toBe(true);
  });
});

// ===================================================================
// 3. 带权有向图 (WeightedDirectedGraph)
// ===================================================================

describe('WeightedDirectedGraph', () => {
  let graph: WeightedDirectedGraph<string>;

  beforeEach(() => {
    graph = new WeightedDirectedGraph<string>();
  });

  it('should add edges with default weight 1', () => {
    graph.addEdge('A', 'B');
    expect(graph.getWeight('A', 'B')).toBe(1);
  });

  it('should add edges with specified weight', () => {
    graph.addEdge('A', 'B', 5);
    expect(graph.getWeight('A', 'B')).toBe(5);
  });

  it('should get weight (undefined for non-existent)', () => {
    graph.addEdge('A', 'B', 10);
    expect(graph.getWeight('A', 'C')).toBeUndefined();
    expect(graph.getWeight('Z', 'A')).toBeUndefined();
  });

  it('should set weight for an existing edge', () => {
    graph.addEdge('A', 'B', 2);
    graph.setWeight('A', 'B', 10);
    expect(graph.getWeight('A', 'B')).toBe(10);
  });

  it('should throw error when setting weight for non-existent edge', () => {
    expect(() => graph.setWeight('A', 'B', 10)).toThrow('Edge A -> B does not exist');
  });

  it('should perform Dijkstra algorithm', () => {
    graph.addEdge('A', 'B', 1);
    graph.addEdge('A', 'C', 4);
    graph.addEdge('B', 'C', 2);
    graph.addEdge('B', 'D', 5);
    graph.addEdge('C', 'D', 1);

    const distances = graph.dijkstra('A');

    expect(distances.get('A')).toBe(0);
    expect(distances.get('B')).toBe(1);
    expect(distances.get('C')).toBe(3); // A -> B -> C (1 + 2)
    expect(distances.get('D')).toBe(4); // A -> B -> C -> D (1 + 2 + 1)
  });

  it('should handle unreachable nodes in Dijkstra', () => {
    graph.addEdge('A', 'B', 1);
    graph.addVertex('C'); // Unreachable

    const distances = graph.dijkstra('A');

    expect(distances.get('A')).toBe(0);
    expect(distances.get('B')).toBe(1);
    expect(distances.get('C')).toBe(Infinity);
  });

  it('should handle Dijkstra (getMinUnvisited "break" branch)', () => {
    // This happens when remaining nodes are all Infinity
    graph.addEdge('A', 'B', 1);
    graph.addVertex('C'); // Unreachable

    const distances = graph.dijkstra('A');
    expect(distances.get('C')).toBe(Infinity);
  });

  it('should throw error if Dijkstra start vertex not found', () => {
    expect(() => graph.dijkstra('Z')).toThrow('Vertex Z not found');
  });

  it('should return correct string representation with weights', () => {
    graph.addEdge('A', 'B', 5);
    expect(graph.toString()).toBe('A -> B(5)\nB -> ');
  });
});

// ===================================================================
// 4. 带权无向图 (WeightedUndirectedGraph)
// ===================================================================

describe('WeightedUndirectedGraph', () => {
  let graph: WeightedUndirectedGraph<string>;

  beforeEach(() => {
    graph = new WeightedUndirectedGraph<string>();
  });

  it('should add edges bidirectionally with default weight 1', () => {
    graph.addEdge('A', 'B');
    expect(graph.getWeight('A', 'B')).toBe(1);
    expect(graph.getWeight('B', 'A')).toBe(1);
  });

  it('should add edges bidirectionally with specified weight', () => {
    graph.addEdge('A', 'B', 5);
    expect(graph.getWeight('A', 'B')).toBe(5);
    expect(graph.getWeight('B', 'A')).toBe(5);
  });

  it('should set weight bidirectionally for an existing edge', () => {
    graph.addEdge('A', 'B', 2);
    graph.setWeight('A', 'B', 10);
    expect(graph.getWeight('A', 'B')).toBe(10);
    expect(graph.getWeight('B', 'A')).toBe(10);
  });

  it('should set weight using reverse order', () => {
    graph.addEdge('A', 'B', 2);
    graph.setWeight('B', 'A', 10); // Set using reverse
    expect(graph.getWeight('A', 'B')).toBe(10);
    expect(graph.getWeight('B', 'A')).toBe(10);
  });

  it('should throw error when setting weight for non-existent edge', () => {
    expect(() => graph.setWeight('A', 'B', 10)).toThrow('Edge A - B does not exist');
  });

  it('should perform Dijkstra algorithm', () => {
    graph.addEdge('A', 'B', 1);
    graph.addEdge('A', 'C', 4);
    graph.addEdge('B', 'C', 2);
    graph.addEdge('B', 'D', 5);
    graph.addEdge('C', 'D', 1);

    const distances = graph.dijkstra('A');

    expect(distances.get('A')).toBe(0);
    expect(distances.get('B')).toBe(1);
    expect(distances.get('C')).toBe(3); // A -> B -> C (1 + 2)
    expect(distances.get('D')).toBe(4); // A -> B -> C -> D (1 + 2 + 1)
  });

  it('should get all edges (unweighted) with deduplication', () => {
    graph.addEdge('A', 'B', 5);
    graph.addEdge('C', 'A', 2);

    const edges = graph.getEdges();
    expect(edges).toHaveLength(2);
    expect(edges).toEqual(expect.arrayContaining([
      ['A', 'B', 5],
      ['A', 'C', 2]
    ]));
  });

  it('should handle getEdges with number keys (regression test for .sort().join())', () => {
    const numGraph = new UndirectedGraph<number, undefined>();
    numGraph.addEdge(1, 10);
    numGraph.addEdge(2, 1);

    const edges = numGraph.getEdges();
    expect(edges).toHaveLength(2);
    const edgeSet = new Set(edges.map(e => [e[0], e[1]].sort().join('-')));
    expect(edgeSet).toContain('1-10'); // '1-10'
    expect(edgeSet).toContain('1-2');  // '1-2'
  });
});
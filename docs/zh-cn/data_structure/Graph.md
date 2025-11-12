# 图 (Graph)

用于创建、操作和遍历图数据结构的类集合。支持有向/无向、带权/无权图，并提供常用图算法。

## 类 (Classes)

### BaseGraph\<T, W = undefined\>

**（抽象基类）**

图数据结构的抽象基类。提供了所有图（有向/无向）共享的通用功能，如节点管理、BFS 和 DFS 遍历。未导出，仅供参考。

> **注意：** 这是一个 `abstract` 类，不能被直接实例化。

#### 成员方法 (Common Methods)

##### addVertex

向图中添加一个新节点（顶点）。如果节点已存在，则不执行任何操作。

```typescript
public addVertex(vertex: T): void
```

**参数：**

  - `vertex: T` - 要添加的节点

##### removeVertex

从图中移除一个节点及其所有相关的边。

```typescript
public removeVertex(vertex: T): void
```

**参数：**

  - `vertex: T` - 要移除的节点

##### hasVertex

检查图中是否存在某个节点。

```typescript
public hasVertex(vertex: T): boolean
```

**参数：**

  - `vertex: T` - 要检查的节点

**返回值：**

  - `boolean` - 如果节点存在则返回 `true`，否则返回 `false`

##### getVertices

获取图中的所有节点。

```typescript
public getVertices(): T[]
```

**返回值：**

  - `T[]` - 包含所有节点的数组

##### getNeighbors

获取指定节点的所有邻居及其边的权重。

```typescript
public getNeighbors(vertex: T): Array<[T, W]>
```

**参数：**

  - `vertex: T` - 目标节点

**返回值：**

  - `Array<[T, W]>` - 邻居和对应权重的元组数组

##### size (getter)

获取图中节点的数量。

```typescript
public get size(): number
```

**返回值：**

  - `number` - 节点的数量

##### bfs

从起始节点执行广度优先搜索 (BFS)。

```typescript
public bfs(start: T, visit?: (v: T) => void): void
```

**参数：**

  - `start: T` - 起始节点
  - `visit?: (v: T) => void` - 访问每个节点时调用的回调函数 (可选)

##### dfs

从起始节点执行深度优先搜索 (DFS)。

```typescript
public dfs(start: T, visit?: (v: T) => void): void
```

**参数：**

  - `start: T` - 起始节点
  - `visit?: (v: T) => void` - 访问每个节点时调用的回调函数 (可选)

##### clear

清空图中的所有节点和边。

```typescript
public clear(): void
```

##### toString

将图的邻接表表示为字符串。

```typescript
public toString(): string
```

**返回值：**

  - `string` - 图的字符串表示

#### 抽象成员方法 (Abstract Member Methods)

（必须在子类中实现）

##### addEdge

向图中添加一条边。

```typescript
public abstract addEdge(from: T, to: T, weight?: W): void
```

##### removeEdge

从图中移除一条边。

```typescript
public abstract removeEdge(from: T, to: T): void
```

##### hasEdge

检查图中是否存在一条边。

```typescript
public abstract hasEdge(from: T, to: T): boolean
```

##### getEdges

获取图中的所有边。

```typescript
public abstract getEdges(): Array<[T, T, W]>
```

-----

### DirectedGraph\<T, W = undefined\>

有向图实现。继承自 `BaseGraph`。边具有方向性 (e.g., A -\> B)。

#### 构造函数

```typescript
new DirectedGraph<T, W>()
```

#### 成员方法 (Overrides & Additions)

##### addEdge (override)

向图中添加一条有向边 (`from` -\> `to`)。

```typescript
public override addEdge(from: T, to: T, weight?: W): void
```

**参数：**

  - `from: T` - 起始节点
  - `to: T` - 目标节点
  - `weight?: W` - 边的权重 (可选)

##### removeEdge (override)

从图中移除一条有向边 (`from` -\> `to`)。

```typescript
public override removeEdge(from: T, to: T): void
```

**参数：**

  - `from: T` - 起始节点
  - `to: T` - 目标节点

##### getOutDegree

获取节点的出度（Out-degree）。

```typescript
public getOutDegree(v: T): number
```

**参数：**

  - `v: T` - 目标节点

**返回值：**

  - `number` - 节点的出度

##### getInDegree

获取节点的入度（In-degree）。

```typescript
public getInDegree(v: T): number
```

**参数：**

  - `v: T` - 目标节点

**返回值：**

  - `number` - 节点的入度

##### topologicalSort

执行拓扑排序 (Kahn 算法)。仅适用于有向无环图 (DAG)。

```typescript
public topologicalSort(): T[] | null
```

**返回值：**

  - `T[] | null` - 返回排序后的节点数组，如果图中有环则返回 `null`

##### hasCycle

检查有向图中是否存在循环。

```typescript
public hasCycle(): boolean
```

**返回值：**

  - `boolean` - 如果存在循环则返回 `true`

#### 示例

```typescript
// 假设已导入 DirectedGraph

// 1. 创建无权有向图
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

// 2. 创建带环图
graph.addEdge('C', 'A');
console.log(graph.hasCycle());
// true
console.log(graph.topologicalSort());
// null
```

-----

### UndirectedGraph\<T, W = undefined\>

无向图实现。继承自 `BaseGraph`。边没有方向性 (e.g., A - B)。

#### 构造函数

```typescript
new UndirectedGraph<T, W>()
```

#### 成员方法 (Overrides & Additions)

##### addEdge (override)

向图中添加一条无向边 (双向添加 `from` \<-\> `to`)。

```typescript
public override addEdge(from: T, to: T, weight?: W): void
```

**参数：**

  - `from: T` - 节点1
  - `to: T` - 节点2
  - `weight?: W` - 边的权重 (可选)

##### removeEdge (override)

从图中移除一条无向边 (双向移除 `from` \<-\> `to`)。

```typescript
public override removeEdge(from: T, to: T): void
```

**参数：**

  - `from: T` - 节点1
  - `to: T` - 节点2

##### getEdges (override)

获取图中的所有无向边 (进行去重)。

```typescript
public override getEdges(): Array<[T, T, W]>
```

**返回值：**

  - `Array<[T, T, W]>` - 包含所有边的元组数组 [v1, v2, weight]

##### getDegree

获取无向图中节点的度数。

```typescript
public getDegree(v: T): number
```

**参数：**

  - `v: T` - 目标节点

**返回值：**

  - `number` - 节点的度数

##### hasCycle

检查无向图中是否存在循环。

```typescript
public hasCycle(): boolean
```

**返回值：**

  - `boolean` - 如果存在循环则返回 `true`

#### 示例

```typescript
// 假设已导入 UndirectedGraph

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

带权有向图实现。继承自 `DirectedGraph<T, number>`，权重固定为 `number` 类型。

#### 构造函数

```typescript
new WeightedDirectedGraph<T>()
```

#### 成员方法 (Overrides & Additions)

##### addEdge (override)

向图中添加一条带权有向边。

```typescript
public override addEdge(from: T, to: T, weight: number = 1): void
```

**参数：**

  - `from: T` - 起始节点
  - `to: T` - 目标节点
  - `weight: number` - 边的权重 (默认为 1)

##### getWeight

获取指定边的权重。

```typescript
public getWeight(from: T, to: T): number | undefined
```

**参数：**

  - `from: T` - 起始节点
  - `to: T` - 目标节点

**返回值：**

  - `number | undefined` - 权重，如果边不存在则返回 `undefined`

##### setWeight

设置已存在边的权重。

```typescript
public setWeight(from: T, to: T, weight: number): void
```

**参数：**

  - `from: T` - 起始节点
  - `to: T` - 目标节点
  - `weight: number` - 新的权重
  - **(Throws)** - 如果边不存在，则抛出错误

##### dijkstra

执行 Dijkstra 最短路径算法。 (假设所有权重为非负数)

```typescript
public dijkstra(start: T): Map<T, number>
```

**参数：**

  - `start: T` - 起始节点

**返回值：**

  - `Map<T, number>` - 包含从起始节点到所有其他可达节点的最短距离 `Map`

#### 示例

```typescript
// 假设已导入 WeightedDirectedGraph

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
// 4 (最短路径 A -> B -> C -> D，总权重 1 + 2 + 1 = 4)
```

-----

### WeightedUndirectedGraph\<T\>

带权无向图实现。继承自 `UndirectedGraph<T, number>`，权重固定为 `number` 类型。

#### 构造函数

```typescript
new WeightedUndirectedGraph<T>()
```

#### 成员方法 (Overrides & Additions)

##### addEdge (override)

向图中添加一条带权无向边。

```typescript
public override addEdge(v1: T, v2: T, weight: number = 1): void
```

**参数：**

  - `v1: T` - 节点1
  - `v2: T` - 节点2
  - `weight: number` - 边的权重 (默认为 1)

##### getWeight

获取指定边的权重。

```typescript
public getWeight(v1: T, v2: T): number | undefined
```

**参数：**

  - `v1: T` - 节点1
  - `v2: T` - 节点2

**返回值：**

  - `number | undefined` - 权重，如果边不存在则返回 `undefined`

##### setWeight

设置已存在边的权重 (双向)。

```typescript
public setWeight(v1: T, v2: T, weight: number): void
```

**参数：**

  - `v1: T` - 节点1
  - `v2: T` - 节点2
  - `weight: number` - 新的权重
  - **(Throws)** - 如果边不存在，则抛出错误

##### dijkstra

执行 Dijkstra 最短路径算法。 (假设所有权重为非负数)

```typescript
public dijkstra(start: T): Map<T, number>
```

**参数：**

  - `start: T` - 起始节点

**返回值：**

  - `Map<T, number>` - 包含从起始节点到所有其他可达节点的最短距离 `Map`

#### 示例

```typescript
// 假设已导入 WeightedUndirectedGraph

const graph = new WeightedUndirectedGraph<string>();
graph.addEdge('A', 'B', 1);
graph.addEdge('A', 'C', 4);
graph.addEdge('B', 'C', 2);
graph.addEdge('B', 'D', 5);
graph.addEdge('C', 'D', 1);

const distances = graph.dijkstra('A');
console.log(distances.get('D'));
// 4 (最短路径 A -> B -> C -> D，总权重 1 + 2 + 1 = 4)
```
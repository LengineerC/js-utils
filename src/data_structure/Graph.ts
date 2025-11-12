/**
 * 图的抽象基类
 * @template T 节点（顶点）的类型
 * @template W 边（Edge）的权重类型，默认为 undefined (无权)
 */
abstract class BaseGraph<T, W = undefined> {
  /**
   * 邻接表
   * 结构: Vertex -> (Neighbor -> Weight)
   */
  protected adj: Map<T, Map<T, W>> = new Map();

  /**
   * 向图中添加一个新节点（顶点）
   * 如果节点已存在，则不执行任何操作。
   * @param {T} vertex 要添加的节点
   */
  public addVertex(vertex: T): void {
    if (!this.adj.has(vertex)) this.adj.set(vertex, new Map());
  }

  /**
   * 从图中移除一个节点及其所有相关的边
   * @param {T} vertex 要移除的节点
   */
  public removeVertex(vertex: T): void {
    if (!this.adj.has(vertex)) return;

    this.adj.delete(vertex);

    for (const [, neighbors] of this.adj) {
      neighbors.delete(vertex);
    }
  }

  /**
   * 检查图中是否存在某个节点
   * @param {T} vertex 要检查的节点
   * @returns {boolean} 如果节点存在则返回 true，否则返回 false
   */
  public hasVertex(vertex: T): boolean {
    return this.adj.has(vertex);
  }

  /**
   * 获取图中的所有节点
   * @returns {T[]} 包含所有节点的数组
   */
  public getVertices(): T[] {
    return [...this.adj.keys()];
  }

  /**
   * 获取指定节点的所有邻居及其边的权重
   * @param {T} vertex 目标节点
   * @returns {Array<[T, W]>} 邻居和对应权重的元组数组
   */
  public getNeighbors(vertex: T): Array<[T, W]> {
    return [...(this.adj.get(vertex)?.entries() ?? [])];
  }

  /**
   * 获取图中节点的数量
   * @type {number}
   */
  public get size(): number {
    return this.adj.size;
  }

  /**
   * 从起始节点执行广度优先搜索 (BFS)
   * @param {T} start 起始节点
   * @param {(v: T) => void} [visit] 访问每个节点时调用的回调函数
   */
  public bfs(start: T, visit?: (v: T) => void): void {
    if (!this.adj.has(start)) return;
    const visited = new Set<T>();
    const queue: T[] = [start];

    while (queue.length) {
      const v = queue.shift()!;
      if (visited.has(v)) continue;
      visited.add(v);
      visit?.(v);

      for (const [neighbor] of this.getNeighbors(v)) {
        if (!visited.has(neighbor)) queue.push(neighbor);
      }
    }
  }

  /**
   * 从起始节点执行深度优先搜索 (DFS)
   * @param {T} start 起始节点
   * @param {(v: T) => void} [visit] 访问每个节点时调用的回调函数
   */
  public dfs(start: T, visit?: (v: T) => void): void {
    if (!this.adj.has(start)) return;
    const visited = new Set<T>();
    const stack: T[] = [start];

    while (stack.length) {
      const v = stack.pop()!;
      if (visited.has(v)) continue;
      visited.add(v);
      visit?.(v);

      const neighbors = this.getNeighbors(v);
      for (let i = neighbors.length - 1; i >= 0; i--) {
        const [neighbor] = neighbors[i];
        if (!visited.has(neighbor)) stack.push(neighbor);
      }
    }
  }

  /**
   * (抽象方法) 向图中添加一条边
   * @abstract
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   * @param {W} [weight] 边的权重 (可选)
   */
  public abstract addEdge(from: T, to: T, weight?: W): void;

  /**
   * (抽象方法) 从图中移除一条边
   * @abstract
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   */
  public abstract removeEdge(from: T, to: T): void;

  /**
   * (抽象方法) 检查图中是否存在一条边
   * @abstract
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   * @returns {boolean} 如果边存在则返回 true
   */
  public abstract hasEdge(from: T, to: T): boolean;

  /**
   * (抽象方法) 获取图中的所有边
   * @abstract
   * @returns {Array<[T, T, W]>} 包含所有边的元组数组 [from, to, weight]
   */
  public abstract getEdges(): Array<[T, T, W]>;

  /**
   * 清空图中的所有节点和边
   */
  public clear(): void {
    this.adj.clear();
  }

  /**
   * 将图的邻接表表示为字符串
   * @returns {string} 图的字符串表示
   */
  public toString(): string {
    return [...this.adj.entries()]
      .map(
        ([v, neighbors]) =>
          `${String(v)} -> ${[...neighbors.entries()]
            .map(([n, w]) => (w !== undefined ? `${String(n)}(${w})` : String(n)))
            .join(', ')}`,
      )
      .join('\n');
  }
}

/**
 * 有向图实现
 * @template T 节点（顶点）的类型
 */
export class DirectedGraph<T, W = undefined> extends BaseGraph<T, W> {
  /**
   * 向图中添加一条有向边
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   */
  public override addEdge(from: T, to: T, weight?: W): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adj.get(from)!.set(to, weight as W);
  }

  /**
   * 从图中移除一条有向边
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   */
  public override removeEdge(from: T, to: T): void {
    this.adj.get(from)?.delete(to);
  }

  /**
   * 检查图中是否存在一条有向边
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   * @returns {boolean} 如果边存在则返回 true
   */
  public override hasEdge(from: T, to: T): boolean {
    return this.adj.get(from)?.has(to) ?? false;
  }

  /**
   * 获取图中的所有有向边
   * @returns {Array<[T, T, W]>} 包含所有边的元组数组 [from, to, weight]
   */
  public override getEdges(): Array<[T, T, W]> {
    const edges: Array<[T, T, W]> = [];
    for (const [from, neighbors] of this.adj) {
      for (const [to, w] of neighbors) edges.push([from, to, w]);
    }
    return edges;
  }

  /**
   * 获取节点的出度（Out-degree）
   * @param {T} v 目标节点
   * @returns {number} 节点的出度
   */
  public getOutDegree(v: T): number {
    return this.adj.get(v)?.size ?? 0;
  }

  /**
   * 获取节点的入度（In-degree）
   * @param {T} v 目标节点
   * @returns {number} 节点的入度
   */
  public getInDegree(v: T): number {
    let count = 0;
    for (const [, neighbors] of this.adj) {
      if (neighbors.has(v)) count++;
    }
    return count;
  }

  /**
   * 执行拓扑排序 (Kahn 算法)
   * 仅适用于有向无环图 (DAG)
   * @returns {T[] | null} 返回排序后的节点数组，如果图中有环则返回 null
   */
  public topologicalSort(): T[] | null {
    const inDegree = new Map<T, number>();
    for (const v of this.getVertices()) {
      inDegree.set(v, this.getInDegree(v));
    }

    const queue = [...this.getVertices().filter(v => inDegree.get(v) === 0)];
    const result: T[] = [];

    while (queue.length) {
      const v = queue.shift()!;
      result.push(v);
      for (const [neighbor] of this.getNeighbors(v)) {
        const deg = (inDegree.get(neighbor) ?? 0) - 1;
        inDegree.set(neighbor, deg);
        if (deg === 0) queue.push(neighbor);
      }
    }

    return result.length === this.size ? result : null;
  }

  /**
   * 检查有向图中是否存在循环 (DFS)
   * @returns {boolean} 如果存在循环则返回 true
   */
  public hasCycle(): boolean {
    const visited = new Set<T>();
    const recStack = new Set<T>();

    const dfs = (v: T): boolean => {
      if (!visited.has(v)) {
        visited.add(v);
        recStack.add(v);
        for (const [n] of this.getNeighbors(v)) {
          if (!visited.has(n) && dfs(n)) return true;
          if (recStack.has(n)) return true;
        }
      }
      recStack.delete(v);
      return false;
    };

    for (const v of this.getVertices()) {
      if (dfs(v)) return true;
    }
    return false;
  }
}

/**
 * 无向图实现
 * @template T 节点（顶点）的类型
 */
export class UndirectedGraph<T, W = undefined> extends BaseGraph<T, W> {
  /**
   * 向图中添加一条无向边 (双向添加)
   * @param {T} from 节点1
   * @param {T} to 节点2
   */
  public override addEdge(from: T, to: T, weight?: W): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adj.get(from)!.set(to, weight as W);
    this.adj.get(to)!.set(from, weight as W);
  }

  /**
   * 从图中移除一条无向边 (双向移除)
   * @param {T} from 节点1
   * @param {T} to 节点2
   */
  public override removeEdge(from: T, to: T): void {
    this.adj.get(from)?.delete(to);
    this.adj.get(to)?.delete(from);
  }

  /**
   * 检查图中是否存在一条无向边
   * @param {T} from 节点1
   * @param {T} to 节点2
   * @returns {boolean} 如果边存在则返回 true
   */
  public override hasEdge(from: T, to: T): boolean {
    return this.adj.get(from)?.has(to) ?? false;
  }

  /**
   * 获取图中的所有无向边 (进行去重)
   * @warning 此方法依赖 `T` 类型可以被 `sort()` 和 `join()` 转换为唯一的字符串键。
   * 如果 `T` 是复杂对象，此方法可能无法正确去重。
   * @returns {Array<[T, T, W]>} 包含所有边的元组数组 [v1, v2, weight]
   */
  public override getEdges(): Array<[T, T, W]> {
    const edges: Array<[T, T, W]> = [];
    const seen = new Set<string>();

    for (const [from, neighbors] of this.adj) {
      for (const [to, w] of neighbors) {
        const key = [String(from), String(to)].sort().join('-');
        if (!seen.has(key)) {
          seen.add(key);
          edges.push([from, to, w]);
        }
      }
    }
    return edges;
  }

  /**
   * 获取无向图中节点的度数
   * @param {T} v 目标节点
   * @returns {number} 节点的度数
   */
  public getDegree(v: T): number {
    return this.adj.get(v)?.size ?? 0;
  }

  /**
   * 检查无向图中是否存在循环
   * @returns {boolean} 如果存在循环则返回 true
   */
  public hasCycle(): boolean {
    const visited = new Set<T>();

    const dfs = (v: T, parent: T | null): boolean => {
      visited.add(v);
      for (const [neighbor] of this.getNeighbors(v)) {
        if (!visited.has(neighbor)) {
          if (dfs(neighbor, v)) return true;
        } else if (neighbor !== parent) {
          return true;
        }
      }
      return false;
    };

    for (const v of this.getVertices()) {
      if (!visited.has(v)) {
        if (dfs(v, null)) return true;
      }
    }
    return false;
  }
}

/**
 * 带权有向图实现 (权重为 number)
 * @template T 节点（顶点）的类型
 */
export class WeightedDirectedGraph<T> extends DirectedGraph<T, number> {
  /**
   * 向图中添加一条带权有向边
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   * @param {number} [weight=1] 边的权重 (默认为 1)
   */
  public override addEdge(from: T, to: T, weight: number = 1): void {
    this.addVertex(from);
    this.addVertex(to);
    this.adj.get(from)!.set(to, weight);
  }

  /**
   * 获取指定边的权重
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   * @returns {number | undefined} 权重，如果边不存在则返回 undefined
   */
  public getWeight(from: T, to: T): number | undefined {
    return this.adj.get(from)?.get(to);
  }

  /**
   * 设置已存在边的权重
   * @param {T} from 起始节点
   * @param {T} to 目标节点
   * @param {number} weight 新的权重
   * @throws {Error} 如果边不存在
   */
  public setWeight(from: T, to: T, weight: number): void {
    if (this.hasEdge(from, to)) {
      this.adj.get(from)!.set(to, weight);
    } else {
      throw new Error(`Edge ${String(from)} -> ${String(to)} does not exist`);
    }
  }

  /**
   * 执行 Dijkstra 最短路径算法
   * @warning 假设所有边的权重均为非负数 (>= 0)
   * @param {T} start 起始节点
   * @returns {Map<T, number>} 包含从起始节点到所有其他可达节点的最短距离
   * @throws {Error} 如果起始节点不存在
   */
  public dijkstra(start: T): Map<T, number> {
    if (!this.hasVertex(start)) {
      throw new Error(`Vertex ${String(start)} not found`);
    }

    const distances = new Map<T, number>();
    const visited = new Set<T>();

    for (const v of this.getVertices()) {
      distances.set(v, v === start ? 0 : Infinity);
    }

    const getMinUnvisited = () => {
      let minVertex: T | undefined;
      let minDist = Infinity;
      for (const [v, d] of distances) {
        if (!visited.has(v) && d < minDist) {
          minVertex = v;
          minDist = d;
        }
      }
      return minVertex;
    };

    while (visited.size < this.size) {
      const u = getMinUnvisited();
      if (!u) break;
      visited.add(u);

      const distU = distances.get(u)!;

      for (const [neighbor, weight] of this.getNeighbors(u)) {
        const alt = distU + weight;
        if (alt < (distances.get(neighbor) ?? Infinity)) {
          distances.set(neighbor, alt);
        }
      }
    }

    return distances;
  }
}

/**
 * 带权无向图实现 (权重为 number)
 * @template T 节点（顶点）的类型
 */
export class WeightedUndirectedGraph<T> extends UndirectedGraph<T, number> {
  /**
   * 向图中添加一条带权无向边
   * @param {T} v1 节点1
   * @param {T} v2 节点2
   * @param {number} [weight=1] 边的权重 (默认为 1)
   */
  public override addEdge(v1: T, v2: T, weight: number = 1): void {
    this.addVertex(v1);
    this.addVertex(v2);
    this.adj.get(v1)!.set(v2, weight);
    this.adj.get(v2)!.set(v1, weight);
  }

  /**
   * 获取指定边的权重
   * @param {T} v1 节点1
   * @param {T} v2 节点2
   * @returns {number | undefined} 权重，如果边不存在则返回 undefined
   */
  public getWeight(v1: T, v2: T): number | undefined {
    return this.adj.get(v1)?.get(v2);
  }

  /**
   * 设置已存在边的权重 (双向)
   * @param {T} v1 节点1
   * @param {T} v2 节点2
   * @param {number} weight 新的权重
   * @throws {Error} 如果边不存在
   */
  public setWeight(v1: T, v2: T, weight: number): void {
    if (this.hasEdge(v1, v2)) {
      this.adj.get(v1)!.set(v2, weight);
      this.adj.get(v2)!.set(v1, weight);
    } else {
      throw new Error(`Edge ${String(v1)} - ${String(v2)} does not exist`);
    }
  }

  /**
   * 执行 Dijkstra 最短路径算法
   * @warning 假设所有边的权重均为非负数 (>= 0)
   * @param {T} start 起始节点
   * @returns {Map<T, number>} 包含从起始节点到所有其他可达节点的最短距离
   * @throws {Error} 如果起始节点不存在
   */
  public dijkstra(start: T): Map<T, number> {
    if (!this.hasVertex(start)) {
      throw new Error(`Vertex ${String(start)} not found`);
    }

    const distances = new Map<T, number>();
    const visited = new Set<T>();

    for (const v of this.getVertices()) {
      distances.set(v, v === start ? 0 : Infinity);
    }

    const getMinUnvisited = (): T | undefined => {
      let minVertex: T | undefined;
      let minDist = Infinity;
      for (const [v, d] of distances) {
        if (!visited.has(v) && d < minDist) {
          minVertex = v;
          minDist = d;
        }
      }
      return minVertex;
    };

    while (visited.size < this.size) {
      const u = getMinUnvisited();
      if (!u) break;
      visited.add(u);

      const distU = distances.get(u)!;
      for (const [neighbor, weight] of this.getNeighbors(u)) {
        const alt = distU + weight;
        if (alt < (distances.get(neighbor) ?? Infinity)) {
          distances.set(neighbor, alt);
        }
      }
    }

    return distances;
  }
}

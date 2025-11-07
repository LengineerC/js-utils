type LRUNode<K, V> = {
  key?: K;
  value?: V;
  prev?: LRUNode<K, V>;
  next?: LRUNode<K, V>;
};

/**
 * LRU缓存
 */
export class LRUCache<K, V> {
  private capacity: number;
  private cache: Map<K, LRUNode<K, V>>;
  private head: LRUNode<K, V>;
  private tail: LRUNode<K, V>;

  /**
   * @param {number} capacity 缓存容量
   */
  public constructor(capacity: number) {
    if (capacity <= 0) throw new Error('LRUCache capacity must be greater than 0');

    this.capacity = capacity;
    this.cache = new Map();
    this.head = {};
    this.tail = {};

    this.head.next = this.tail;
    this.tail.prev = this.head;
  }

  /**
   * 获取缓存元素
   * @param {K} key 缓存的key
   * @returns {V | undefined} 缓存的值
   */
  public get(key: K): V | undefined {
    const node = this.cache.get(key);
    if (!node) return undefined;

    this.moveToHead(node);
    return node.value;
  }

  /**
   * 设置缓存，如果缓存存在，更新值
   * @param {K} key 缓存的key
   * @param {V} value 缓存的值
   */
  public set(key: K, value: V) {
    let node = this.cache.get(key);

    if (node) {
      node.value = value;
      this.moveToHead(node);
    } else {
      node = { key, value };

      this.cache.set(key, node);
      this.addToHead(node);

      if (this.cache.size > this.capacity) {
        if (!this.tail.prev || this.tail.prev === this.head) return;
        const node = this.tail.prev;
        this.cache.delete(node.key!);
        this.removeNode(node);
      }
    }
  }

  /**
   * 查询是否存在对应缓存
   * @param {K} key 缓存的key
   * @returns {boolean} 是否存在对应缓存
   */
  public has(key: K): boolean {
    return this.cache.has(key);
  }

  /**
   * 删除缓存
   * @param {K} key 缓存的key
   * @returns {boolean} 是否删除成功（节点不存在返回false）
   */
  public delete(key: K): boolean {
    const node = this.cache.get(key);
    if (!node) return false;

    this.removeNode(node);
    this.cache.delete(key);

    return true;
  }

  private addToHead(node: LRUNode<K, V>) {
    node.next = this.head.next;
    node.prev = this.head;
    if (this.head.next) this.head.next.prev = node;
    this.head.next = node;
  }

  private removeNode(node: LRUNode<K, V>) {
    if (node.prev) node.prev.next = node.next;
    if (node.next) node.next.prev = node.prev;

    node.prev = undefined;
    node.next = undefined;
  }

  private moveToHead(node: LRUNode<K, V>) {
    this.removeNode(node);
    this.addToHead(node);
  }
}

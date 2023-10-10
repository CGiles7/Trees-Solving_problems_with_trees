class BinarySearchTree {
  constructor(key = null, value = null, parent = null) {
    this.key = key;
    this.value = value;
    this.parent = parent;
    this.left = null;
    this.right = null;
  }

  insert(key, value) {
    if (this.key === null) {
      this.key = key;
      this.value = value;
    } else if (key < this.key) {
      if (this.left === null) {
        this.left = new BinarySearchTree(key, value, this);
      } else {
        this.left.insert(key, value);
      }
    } else {
      if (this.right === null) {
        this.right = new BinarySearchTree(key, value, this);
      } else {
        this.right.insert(key, value);
      }
    }
  }

  find(key) {
    if (this.key === key) {
      return this.value;
    } else if (key < this.key && this.left) {
      return this.left.find(key);
    } else if (key > this.key && this.right) {
      return this.right.find(key);
    } else {
      throw new Error("Key Not Found");
    }
  }

  remove(key) {
    if (this.key === key) {
      if (this.left && this.right) {
        const successor = this.right._findMin();
        this.key = successor.key;
        this.value = successor.value;
        successor.remove(successor.key);
      } else if (this.left) {
        this._replaceWith(this.left);
      } else if (this.right) {
        this._replaceWith(this.right);
      } else {
        this._replaceWith(null);
      }
    } else if (key < this.key && this.left) {
      this.left.remove(key);
    } else if (key > this.key && this.right) {
      this.right.remove(key);
    } else {
      throw new Error("Key Not Found");
    }
  }

  dfsInOrder(values = []) {
    if (this.left) {
      values = this.left.dfsInOrder(values);
    }
    values.push(this.value);
    if (this.right) {
      values = this.right.dfsInOrder(values);
    }
    return values;
  }

  dfsPreOrder(values = []) {
    values.push(this.value);
    if (this.left) {
      values = this.left.dfsPreOrder(values);
    }
    if (this.right) {
      values = this.right.dfsPreOrder(values);
    }
    return values;
  }

  dfsPostOrder(values = []) {
    if (this.left) {
      values = this.left.dfsPostOrder(values);
    }
    if (this.right) {
      values = this.right.dfsPostOrder(values);
    }
    values.push(this.value);
    return values;
  }

  bfs(tree, values = []) {
    const queue = new Queue();
    queue.enqueue(tree);
    let node = queue.dequeue();
    while (node) {
      values.push(node.value);

      if (node.left) {
        queue.enqueue(node.left);
      }

      if (node.right) {
        queue.enqueue(node.right);
      }
      node = queue.dequeue();
    }

    return values;
  }

  getHeight(currentHeight = 0) {
    if (!this.left && !this.right) return currentHeight;

    const newHeight = currentHeight + 1;

    if (!this.left) return this.right.getHeight(newHeight);

    if (!this.right) return this.left.getHeight(newHeight);

    const leftHeight = this.left.getHeight(newHeight);
    const rightHeight = this.right.getHeight(newHeight);

    return Math.max(leftHeight, rightHeight);
  }

  isBST() {
    const values = this.dfsInOrder();
    for (let i = 1; i < values.length; i++) {
      if (values[i] < values[i - 1]) {
        return false;
      }
    }
    return true;
  }

  findKthLargestValue(k) {
    const values = this.dfsInOrder();
    return values[values.length - k];
  }

  countLeaves(count = 0) {
  if (!this.left && !this.right) {
    // If the current node is a leaf, increment the count.
    return count + 1;
  }

  // Recursively count the leaves in the left and right subtrees.
  if (this.left) {
    count = this.left.countLeaves(count);
  }
  if (this.right) {
    count = this.right.countLeaves(count);
  }

  return count;
}

  isBalancedBST() {
  const { isBalanced, height } = this._checkBalance();
  return isBalanced ? height : -1;
}

_checkBalance() {
  if (!this) {
    // An empty tree is balanced with a height of -1.
    return { isBalanced: true, height: -1 };
  }

  // Recursively check the balance of the left and right subtrees.
  const leftResult = this.left ? this.left._checkBalance() : { isBalanced: true, height: -1 };
  const rightResult = this.right ? this.right._checkBalance() : { isBalanced: true, height: -1 };

  const isLeftBalanced = leftResult.isBalanced;
  const isRightBalanced = rightResult.isBalanced;
  const leftHeight = leftResult.height;
  const rightHeight = rightResult.height;

  // Check if the current subtree is balanced and calculate its height.
  const isBalanced = isLeftBalanced && isRightBalanced && Math.abs(leftHeight - rightHeight) <= 1;
  const height = 1 + Math.max(leftHeight, rightHeight);

  return { isBalanced, height };
}

  _replaceWith(node) {
    if (this.parent) {
      if (this === this.parent.left) {
        this.parent.left = node;
      } else if (this === this.parent.right) {
        this.parent.right = node;
      }

      if (node) {
        node.parent = this.parent;
      }
    } else {
      if (node) {
        this.key = node.key;
        this.value = node.value;
        this.left = node.left;
        this.right = node.right;
      } else {
        this.key = null;
        this.value = null;
        this.left = null;
        this.right = null;
      }
    }
  }

  _findMin() {
    if (!this.left) {
      return this;
    }
    return this.left._findMin();
  }
}

module.exports = BinarySearchTree;
/**
 *
 Problem:
 You are given a class GraphNode that represents a node in a binary search tree (BST).
 Each node has:
 A value
 A left child (left)
 A right child (right)

 The method addIfNotExists(node: GraphNode) is supposed to:

 Insert node into the correct position in the BST according to the rules:

 - All nodes in the left subtree is less than the current node's value.
 - All nodes in the right subtree is greater than the current node's value.
 - Ignore insertion if a node with the same value already exists anywhere in the tree.

 The twist:
 The method addIfNotExists is already implemented, but there is a bug.

 Your task is to find the bug, explain why it happens, and fix it so the method works correctly.

 Constraints: Obviouslly, no AI
 */
class GraphNode {
    declare left: GraphNode | null;
    declare right: GraphNode | null;
    declare value: number;

    constructor(value: number) {
        this.value = value;
        this.left = null;
        this.right = null;
    }

    /** Add a node to the graph if it doesn't already exist.
     * Return true if added, false if already exists
     */
    addIfNotExists(val: GraphNode | number): boolean {
        // Allow adding node from value or existing node for recursion
        let node = val instanceof GraphNode ? val : new GraphNode(val);

        if (node === this) {
            // Already exists, do nothing and return false
            return false;
        }

        if (node.value < this.value) {
            // Add node to the left subtree
            if (this.left === null) {
                this.left = node;
                return true;
            }
            return this.left.addIfNotExists(node);
        }
        // Add node to the right subtree
        if (this.right === null) {
            this.right = node;
            return true;
        }
        return this.right.addIfNotExists(node);
    }
}

const root = new GraphNode(0);

for (let i = 1; i < 50; i++) {
    root.addIfNotExists(i);
}

const isAdded = root.addIfNotExists(30);

if (isAdded) {
    console.error("Node 30 already exist, it should not be added");
    process.exit(1);
} else {
    console.log("Good");
}

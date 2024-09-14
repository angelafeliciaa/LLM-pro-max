import inspect
import importlib
import re

test_code = importlib.import_module("test_code")


class Node():
    """
    Node that represents a function
    """
    def __init__(self, name) -> None:
        self.name = name
        self.to_nodes:list[Node] = []

    def add_edge_to(self, to_node):
        if to_node == self:
            return
        if to_node not in self.to_nodes:
            self.to_nodes.append(to_node)

class Graph():
    """
    Graph that represents a bunch of nodes (representing a whole python module)
    """
    def __init__(self) -> None:
        self.nodes:list[Node] = []

    def __iter__(self):
        return iter(self.nodes)

    def add_node(self, node:Node):
        if node not in self.nodes:
            self.nodes.append(node)

    def get_node_by_name(self, name:str):
        for n in self.nodes:
            if n.name == name:
                return n
        return None

fn_names = []
for fn in dir(test_code):
    if fn[:2] != "__":
        fn_names.append(fn)

graph = Graph()
for fn in fn_names:
    n = Node(fn)
    graph.add_node(n)

for n in graph:
    source = inspect.getsource(getattr(test_code, n.name))
    for fn in fn_names:
        if n.name == fn:
            continue # do not add edge to self
        if re.search(f"{fn}(.*)", source): # if we find foo() or whatever in the source code
            n.add_edge_to(graph.get_node_by_name(fn))

print(graph)
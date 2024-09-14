import inspect
import importlib
import re

test_code = importlib.import_module("test_code")
def _f():
    pass
class _c():
    pass

functionType = type(_f)
classType = type(_c)

def _non_magic_dir(item):
    """
    returns everything in the __dir__ of item that aren't special magic functions
    returns as a list containing functions and classes
    """
    ret = []
    for x in dir(item):
        if x[:2] != "__":
            ret.append(getattr(item, x))
    return ret

class Node():
    """
    Node that represents a function
    """
    def __init__(self, fn=None) -> None:
        self.function = fn
        self.class_obj = None
        self.to_nodes:list[Node] = []

    def __repr__(self) -> str:
        return self.name

    def add_edge_to(self, to_node):
        if to_node == self:
            return
        if to_node not in self.to_nodes:
            self.to_nodes.append(to_node)
    
    def traverse(self):
        ret = [self]
        for n in self.to_nodes:
            if n not in ret:
                ret += n.traverse()
        return ret
    
    @property
    def name(self):
        return self.function.__name__

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

class Group():
    """
    Represents a group of functions and classes.
    Could be a module or a class that itself has functions and classes.
    """
    def __init__(self, items, class_obj=None) -> None:
        """
        items - a list containing functions and classes
        class_obj - None if this group represents a module, the class if this group represents a class
        """
        self.nodes:list[Node] = []
        self.class_obj = class_obj
        self.subgroups:list[Group] = []
        for i in items:
            if type(i) == functionType:
                n = Node(i)
                n.class_obj = self.class_obj
                self.nodes.append(n)
            elif type(i) == classType:
                g = Group(_non_magic_dir(i), i)
                self.subgroups.append(g)
                self.nodes += g.nodes
    
    def gen_code(self, fns, indent=0):
        """
        recursively generate code containing the given functions and nothing else

        per iteration, only generates code for functions at this iteration level
        """
        #shitty inefficient hackathon code
        ret = ""

        class_printed = False

        for f in fns:
            if self.get_node_by_function(f) and self.get_node_by_function(f).class_obj == self.class_obj: # function should be printed at this iteration
                if not class_printed:
                    if self.class_obj != None:
                        ret += (" " * (indent - 4)) + f"class {self.class_obj.__name__}:\n"
                    class_printed = True
                ret += inspect.getsource(f)

        for g in self.subgroups:
            sub_code = g.gen_code(fns, indent=indent+4)
            if len(sub_code) > 0 and not class_printed:
                if self.class_obj != None:
                    ret += (" " * (indent - 4)) + f"class {self.class_obj.__name__}:\n"
            ret += sub_code

        return ret

    def get_node_by_function(self, function):
        for n in self.nodes:
            if n.function == function:
                return n
        return None

def required_functions(n:Node):
    return [x.function for x in n.traverse()]

def required_classes(n:Node):
    class_objs = []
    for x in n.traverse():
        if x.class_obj not in class_objs:
            class_objs.append(x.class_obj)
    return class_objs

def required_code(n:Node):
    return module_level_group.gen_code(required_functions(n))
        

module_level_group = Group(_non_magic_dir(test_code))

graph = Graph()
for n in module_level_group.nodes:
    graph.add_node(n)

for n_1 in graph:
    if n_1.class_obj == None:
        source = inspect.getsource(getattr(test_code, n_1.name))
    else:
        source = inspect.getsource(getattr(n_1.class_obj, n_1.name))
    for n_2 in graph:
        if n_1 == n_2:
            continue # do not add edge to self
        if re.search(f"{n_2.name}(.*)", source): # if we find foo() or whatever in the source code
            n_1.add_edge_to(n_2)


print(required_classes(graph.get_node_by_name("show")))
print(required_functions(graph.get_node_by_name("show")))
print()
print(required_code(graph.get_node_by_name("display")))
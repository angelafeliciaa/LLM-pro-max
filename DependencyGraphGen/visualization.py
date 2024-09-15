import ast
import os
import networkx as nx
from pyvis.network import Network
import subprocess
import tempfile
import argparse
import webbrowser
import html

def clone_github_repo(repo_url, target_dir):
    try:
        subprocess.run(['git', 'clone', repo_url, target_dir], check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        print(f"Successfully cloned {repo_url}")
    except subprocess.CalledProcessError as e:
        print(f"Error cloning repository: {e}")
        raise

def extract_code_snippet(file_path, max_lines=10):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            lines = file.readlines()
            return ''.join(lines[:max_lines]).strip()
    except Exception as e:
        print(f"Error reading file {file_path}: {e}")
        return "Unable to read file"

class FunctionCallVisitor(ast.NodeVisitor):
    def __init__(self):
        self.function_calls = {}
        self.current_function = None

    def visit_FunctionDef(self, node):
        self.current_function = node.name
        self.function_calls[node.name] = set()
        self.generic_visit(node)
        self.current_function = None

    def visit_Call(self, node):
        if isinstance(node.func, ast.Name) and self.current_function:
            self.function_calls[self.current_function].add(node.func.id)
        self.generic_visit(node)

def parse_file(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            tree = ast.parse(file.read())
    except SyntaxError:
        print(f"Syntax error in file: {file_path}")
        return [], {}, {}
    except Exception as e:
        print(f"Error parsing file {file_path}: {e}")
        return [], {}, {}

    imports = []
    definitions = {}
    visitor = FunctionCallVisitor()
    visitor.visit(tree)

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imports.append((alias.name, alias.name))
        elif isinstance(node, ast.ImportFrom):
            module = node.module or ''
            for alias in node.names:
                imports.append((f"{module}.{alias.name}", alias.name))
        elif isinstance(node, ast.FunctionDef):
            definitions[node.name] = 'function'
        elif isinstance(node, ast.ClassDef):
            definitions[node.name] = 'class'

    return imports, definitions, visitor.function_calls

def build_import_graph(directory):
    graph = nx.DiGraph()

    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.py'):
                file_path = os.path.join(root, file)
                module_name = os.path.relpath(file_path, directory).replace('.py', '').replace(os.path.sep, '.')
                snippet = extract_code_snippet(file_path)
                
                graph.add_node(module_name, snippet=snippet, type='file')

                imports, definitions, function_calls = parse_file(file_path)
                for full_name, symbol in imports:
                    target_module = full_name.split('.')[0]
                    graph.add_edge(module_name, target_module, symbol=symbol)

                for name, def_type in definitions.items():
                    node_name = f"{module_name}.{name}"
                    graph.add_node(node_name, type=def_type)
                    graph.add_edge(module_name, node_name)

                    # Add function call dependencies
                    if name in function_calls:
                        for called_func in function_calls[name]:
                            called_node = f"{module_name}.{called_func}"
                            if called_node in graph:
                                graph.add_edge(node_name, called_node, type='function_call')

    return graph

def get_node_color(node_type):
    colors = {
        'file': '#ADD8E6',    # Light Blue
        'function': '#90EE90', # Light Green
        'class': '#FFB6C1',    # Light Pink
        'module': '#FFD700'    # Gold
    }
    return colors.get(node_type, '#FFFFFF')  # Default to white if type is unknown

def visualize_import_graph(graph, output_file):
    net = Network(height="750px", width="100%", directed=True, notebook=False)
    
    # Add nodes
    for node, data in graph.nodes(data=True):
        node_type = data.get('type', 'unknown')
        color = get_node_color(node_type)
        snippet = html.escape(data.get('snippet', 'No snippet available'))
        net.add_node(
            node,
            label=node.split('.')[-1],
            title=f"{node}\n\n{snippet}",
            color=color,
            group=node_type
        )
    
    # Add edges
    for source, target, data in graph.edges(data=True):
        edge_type = data.get('type', '')
        if edge_type == 'function_call':
            net.add_edge(source, target, color='#FF0000', title='Function Call')  # Red color for function calls
        else:
            net.add_edge(source, target, title=data.get('symbol', ''))

    # Set physics layout
    net.set_options("""
    var options = {
      "physics": {
        "forceAtlas2Based": {
          "gravitationalConstant": -50,
          "centralGravity": 0.01,
          "springLength": 100,
          "springConstant": 0.08
        },
        "maxVelocity": 50,
        "solver": "forceAtlas2Based",
        "timestep": 0.35,
        "stabilization": {
          "enabled": true,
          "iterations": 1000,
          "updateInterval": 25
        }
      },
      "interaction": {
        "navigationButtons": true,
        "hover": true
      }
    }
    """)

    # Add legend and search functionality
    legend_html = """
    <div style="position: absolute; top: 10px; left: 10px; z-index: 1; background-color: white; padding: 10px; border-radius: 5px;">
        <h3>Node Types</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li><span style="display: inline-block; width: 20px; height: 20px; background-color: #ADD8E6; margin-right: 5px;"></span>File</li>
            <li><span style="display: inline-block; width: 20px; height: 20px; background-color: #90EE90; margin-right: 5px;"></span>Function</li>
            <li><span style="display: inline-block; width: 20px; height: 20px; background-color: #FFB6C1; margin-right: 5px;"></span>Class</li>
            <li><span style="display: inline-block; width: 20px; height: 20px; background-color: #FFD700; margin-right: 5px;"></span>Module</li>
        </ul>
        <h3>Edge Types</h3>
        <ul style="list-style-type: none; padding-left: 0;">
            <li><span style="display: inline-block; width: 20px; height: 2px; background-color: #848484; margin-right: 5px;"></span>Import</li>
            <li><span style="display: inline-block; width: 20px; height: 2px; background-color: #FF0000; margin-right: 5px;"></span>Function Call</li>
        </ul>
    </div>
    """

    search_html = """
    <div style="position: absolute; top: 10px; right: 10px; z-index: 1; background-color: white; padding: 10px; border-radius: 5px;">
        <input type="text" id="searchInput" placeholder="Search nodes...">
        <button onclick="searchNode()">Search</button>
    </div>
    <script>
    function searchNode() {
        var searchTerm = document.getElementById('searchInput').value.toLowerCase();
        var allNodes = network.body.data.nodes.get();
        var foundNodes = allNodes.filter(node => 
            node.label.toLowerCase().includes(searchTerm) || 
            node.id.toLowerCase().includes(searchTerm)
        );
        
        if (foundNodes.length > 0) {
            // Dim all nodes
            allNodes.forEach(node => {
                network.body.data.nodes.update({
                    id: node.id, 
                    color: {
                        background: '#D3D3D3',
                        border: '#A9A9A9'
                    }
                });
            });
            
            // Highlight found nodes and their connections
            var nodesToHighlight = new Set();
            foundNodes.forEach(node => {
                nodesToHighlight.add(node.id);
                // Get connected nodes
                network.getConnectedNodes(node.id).forEach(connectedNode => {
                    nodesToHighlight.add(connectedNode);
                });
            });
            
            nodesToHighlight.forEach(nodeId => {
                var node = allNodes.find(n => n.id === nodeId);
                network.body.data.nodes.update({
                    id: nodeId, 
                    color: {
                        background: '#FF4500',
                        border: '#FF8C00'
                    }
                });
            });
            
            // Fit view to highlighted nodes
            network.fit({
                nodes: Array.from(nodesToHighlight),
                animation: true
            });
        } else {
            alert('No matching nodes found.');
        }
    }

    // Reset colors when search is cleared
    document.getElementById('searchInput').addEventListener('input', function(e) {
        if (e.target.value === '') {
            var allNodes = network.body.data.nodes.get();
            allNodes.forEach(node => {
                var originalColor = getNodeColor(node.group);
                network.body.data.nodes.update({
                    id: node.id, 
                    color: {
                        background: originalColor,
                        border: originalColor
                    }
                });
            });
        }
    });

    function getNodeColor(nodeType) {
        var colors = {
            'file': '#ADD8E6',    // Light Blue
            'function': '#90EE90', // Light Green
            'class': '#FFB6C1',    // Light Pink
            'module': '#FFD700'    // Gold
        };
        return colors[nodeType] || '#FFFFFF';  // Default to white if type is unknown
    }
    </script>
    """

    # Save and show the graph
    net.save_graph(output_file)
    
    # Add legend and search functionality to the saved HTML file
    with open(output_file, 'r', encoding='utf-8') as file:
        content = file.read()
    
    modified_content = content.replace('<body>', f'<body>{legend_html}{search_html}')
    
    with open(output_file, 'w', encoding='utf-8') as file:
        file.write(modified_content)

    print(f"Interactive import graph visualization saved as '{output_file}'")
    webbrowser.open(f"file://{os.path.abspath(output_file)}", new=2)

def analyze_codebase(graph):
    print("\nCodebase Analysis:")
    print(f"1. Total number of nodes: {graph.number_of_nodes()}")
    print(f"2. Total number of edges: {graph.number_of_edges()}")

    node_types = {data['type'] for _, data in graph.nodes(data=True) if 'type' in data}
    for node_type in node_types:
        count = sum(1 for _, data in graph.nodes(data=True) if data.get('type') == node_type)
        print(f"   - Number of {node_type}s: {count}")

    degrees = dict(graph.degree())
    most_connected = max(degrees, key=degrees.get) if degrees else "N/A"
    print(f"3. Most connected node: {most_connected} ({degrees.get(most_connected, 0)} connections)")

    in_degrees = dict(graph.in_degree())
    most_dependent = max(in_degrees, key=in_degrees.get) if in_degrees else "N/A"
    print(f"4. Node with most incoming connections: {most_dependent} ({in_degrees.get(most_dependent, 0)} dependencies)")

    function_call_count = sum(1 for _, _, data in graph.edges(data=True) if data.get('type') == 'function_call')
    print(f"5. Number of function calls: {function_call_count}")

def main():
    parser = argparse.ArgumentParser(description="Analyze Python codebase and visualize import graph.")
    parser.add_argument('repo_url', help="URL of the GitHub repository to clone.")
    parser.add_argument('output_file', help="File to save the interactive visualization.")
    args = parser.parse_args()

    # Clone the repository
    repo_dir = tempfile.mkdtemp()
    clone_github_repo(args.repo_url, repo_dir)

    # Build the import graph
    graph = build_import_graph(repo_dir)

    # Analyze the codebase
    analyze_codebase(graph)

    # Visualize the import graph
    visualize_import_graph(graph, args.output_file)

if __name__ == "__main__":
    main()
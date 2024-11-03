// Load Pyodide for Python execution
async function initializePyodide() {
    self.pyodide = await loadPyodide();
}
initializePyodide();
  
// Load Monaco Editor
require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.0/min/vs' }});
require(['vs/editor/editor.main'], function () {
    window.editor = monaco.editor.create(document.getElementById('editor-container'), {
        value: '# Start coding in Python...\n',
        language: 'python',
        theme: 'vs-dark',
        automaticLayout: true
    });
});
  
// Load file content into the editor
function loadFile(filename) {
    const fileContents = {
        'main.py': 'print("Hello from main.py")',
        'helpers.py': 'def greet():\n    print("Hello from helpers.py")'
    };
    editor.setValue(fileContents[filename] || "# File not found.");
}

// Run Python code from the editor
async function runPythonCode() {
const code = editor.getValue();
    try {
        let output = await pyodide.runPythonAsync(code);
        document.getElementById('output-container').textContent = output || "Code ran successfully.";
    } catch (err) {
        document.getElementById('output-container').textContent = "Error: " + err;
    }
}

// Package installation and uninstallation
async function installPackage(packageName) {
document.getElementById('package-status').textContent = `Installing ${packageName}...`;
    try {
        await pyodide.loadPackage(packageName);
        document.getElementById('package-status').textContent = `${packageName} installed successfully.`;
    } catch (err) {
        document.getElementById('package-status').textContent = `Failed to install ${packageName}: ${err}`;
    }
}

async function uninstallPackage(packageName) {
document.getElementById('package-status').textContent = `Uninstalling ${packageName}...`;
    try {
        pyodide.pyimport(packageName);  // Ensure package is loaded
        pyodide.pyunimport(packageName); // Unload package
        document.getElementById('package-status').textContent = `${packageName} uninstalled successfully.`;
    } catch (err) {
        document.getElementById('package-status').textContent = `Failed to uninstall ${packageName}: ${err}`;
    }
}
  
  
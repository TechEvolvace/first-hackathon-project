// Phaser Game Configuration
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    backgroundColor: '#2c2f33',
    parent: 'game-container',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    // Preload any assets here (e.g., character images, background).
    console.log("Phaser is running!");
}

function create() {
    this.add.text(10, 10, "Welcome to CodeQuest!", { font: "20px Arial", fill: "#ffffff" });
    
    // Add interaction with sidebar or buttons here if needed.
}

function update() {
    // Update the game elements or handle interactions.
}

// Code Evaluation Function
document.getElementById('run-code').addEventListener('click', function() {
    const code = document.getElementById('code-editor').value;

    try {
        // Evaluate the code (be cautious with eval in production)
        const result = eval(code); // Use with caution: only for controlled input
        console.log(result); // Output result to console (you could display it in the IDE)
    } catch (error) {
        // Display error in the error output area
        const errorOutput = document.getElementById('error-output');
        errorOutput.innerText = error.message;
        errorOutput.style.display = 'block'; // Show error output
    }
});
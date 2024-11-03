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
document.getElementById("run-code").addEventListener("click", () => {
    const code = document.getElementById("editor-textarea").value;
    try {
        // Here we're using eval for demo purposes; later, integrate with Python functionality
        eval(code); 
    } catch (error) {
        console.error("Error in code:", error);
        alert("Error in code: " + error.message);
    }
});

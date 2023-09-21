// Get references to the wand element and all the tiles
const wand = document.getElementById("wand");
const tiles = document.querySelectorAll(".tile");

// Helper functions for handling position and dimensions
const xy = (x, y) => ({ x, y });
const px = value => `${value}px`;
const deg = value => `${value}deg`;
const clamp = (value, min, max) => Math.max(Math.min(value, max), min);

// Function to update mouse-related information
const updateMouse = (mouseX, mouseY) => {
  // Get the window dimensions
  const { innerWidth: windowWidth, innerHeight: windowHeight } = window;

  // Mouse object containing various mouse-related properties
  const mouse = {
    position: xy(mouseX, mouseY),
    decimal: xy(mouseX / windowWidth, mouseY / windowHeight),
    multiplier: xy(1.3, 0.4),
    offset: xy(windowWidth * -0.15, windowHeight * 0.1),
    modifiedPosition: xy(0, 0),
  };

  // Calculate the modified mouse position based on the mouse properties
  mouse.modifiedPosition.x = mouse.position.x * mouse.multiplier.x + mouse.offset.x;
  mouse.modifiedPosition.y = mouse.position.y * mouse.multiplier.y + mouse.offset.y;

  return mouse;
};

// Function to reveal images on adjacent tiles based on mouse position
const revealImages = mouseX => {
  for (const tile of tiles) {
    // Get the dimensions of the tile
    const dimensions = tile.getBoundingClientRect();

    // Calculate the relative mouse position inside the tile as a decimal value
    const relativeMouseX = mouseX - dimensions.left;
    const mouseXAsDecimal = clamp(relativeMouseX / dimensions.width, 0, 1);

    // Calculate the opacity and blur values for the tile
    const opacity = mouseXAsDecimal;
    const blur = 1 - mouseXAsDecimal;

    // Set the CSS custom properties for the tile to control image visibility
    tile.style.setProperty("--opacity", opacity);
    tile.style.setProperty("--blur", blur);
  }
};

// Function to calculate the styles for the wand element based on the mouse
const getWandStyles = mouse => ({
  left: px(mouse.modifiedPosition.x),
  top: px(mouse.modifiedPosition.y),
  rotate: deg(mouse.decimal.x * 20 - 10),
});

// Event listener for mouse movement
window.onmousemove = e => {
  // Update mouse-related information
  const mouse = updateMouse(e.clientX, e.clientY);

  // Get the styles for the wand element based on the updated mouse position
  const wandStyles = getWandStyles(mouse);

  // Animate the wand element to its new position and rotation
  wand.animate(wandStyles, { duration: 400, fill: "forwards" });

  // Reveal images on the tiles based on the modified mouse position
  revealImages(mouse.modifiedPosition.x);
};

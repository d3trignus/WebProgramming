const renderer = new Renderer();
renderer.renderInput((count) => onStart(count));

function onStart(count) {
  count = parseInt(count);

  if (count >= 1 && count <= 10) {
    const game = new Game(count, renderer);
    game.start();
  } else {
    renderer.renderErrorMessage();
  }
}

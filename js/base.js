/*
    This file contains shared logic for determining the base URL of the app, 
    which is crucial for ensuring that all links and assets work correctly regardless of the hosting environment 
    (e.g., GitHub Pages, local development).

*/

const getBase = () => {
  const { origin, pathname } = window.location;
  const parts = pathname.split('/');

  // detect if running locally or GitHub Pages
  if (origin.includes("github.io")) {
    return `${origin}/${parts[1]}/`;
  }

  return `${origin}/`;
};
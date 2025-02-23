// Function to dynamically load a JavaScript file
const loadScript = (src, callback) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = callback;
    document.head.appendChild(script);
  };
  
  // Add event listeners to buttons
  document.getElementById('screen1-btn').addEventListener('click', () => {
    loadScript('neutralization.js', () => {
      // Ensure the function is defined in indicator.js
      if (typeof loadScreen1 === 'function') {
        loadScreen1();
      } else {
        console.error('loadScreen1 is not defined in neutralization.js');
      }
    });
  });
  
  document.getElementById('screen2-btn').addEventListener('click', () => {
    loadScript('indicator.js', () => {
      // Ensure the function is defined in neutralization.js
      if (typeof loadScreen2 === 'function') {
        loadScreen2();
      } else {
        console.error('loadScreen2 is not defined in neutralization.js');
      }
    });
  });

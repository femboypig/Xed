// Access Tauri API for Tauri v2

// Global state for the tree view toggle
let tree = true;

// Initialize the window controls
document.addEventListener('DOMContentLoaded', async () => {
  try {
    // Check if the Tauri API is available
    if (typeof window.__TAURI__ !== 'undefined') {
      // Get window control buttons
      const closeButton = document.querySelector('.window-control.close');
      const minimizeButton = document.querySelector('.window-control.minimize');
      const maximizeButton = document.querySelector('.window-control.maximize');

      // Add event listeners for window controls
      if (closeButton) {
        closeButton.addEventListener('click', async () => {
          try {
            await window.__TAURI__.window.getCurrentWindow().close();
          } catch (error) {
            console.error('Error closing window:', error);
          }
        });
      }
      
      if (minimizeButton) {
        minimizeButton.addEventListener('click', async () => {
          try {
            await window.__TAURI__.window.getCurrentWindow().minimize();
          } catch (error) {
            console.error('Error minimizing window:', error);
          }
        });
      }
      
      if (maximizeButton) {
        maximizeButton.addEventListener('click', toggleMaximize);
      }
    } else {
      console.error('Tauri API not found. Make sure you are running in a Tauri environment.');
    }

    // Sign in button functionality (works independently of Tauri)
    const signInButton = document.querySelector('.sign-in-button');
    if (signInButton) {
      signInButton.addEventListener('click', () => {
        // Add sign in functionality here
      });
    }
    
    // Initialize the status bar and sidebar
    initStatusBar();
    initSidebar();
    
    // Initialize sidebar resizer
    initSidebarResizer();
  } catch (error) {
    console.error('Error initializing window controls:', error);
  }
});

// Toggle between maximize and unmaximize
async function toggleMaximize() {
  try {
    if (typeof window.__TAURI__ === 'undefined') {
      console.error('Tauri API not available');
      return;
    }
    
    const currentWindow = window.__TAURI__.window.getCurrentWindow();
    const isMaximized = await currentWindow.isMaximized();
    
    if (isMaximized) {
      await currentWindow.unmaximize();
    } else {
      await currentWindow.maximize();
    }
  } catch (error) {
    console.error('Error toggling maximize state:', error);
  }
}

// Initialize the status bar
function initStatusBar() {
  // Get status bar elements
  const statusBar = document.getElementById('status-bar');
  const statusBarLeft = statusBar.querySelector('.status-bar-left');
  const statusBarRight = statusBar.querySelector('.status-bar-right');
  
  // Add tree view toggle button
  addTreeViewToggle(statusBarLeft);
  
  // This is just a placeholder for now
  // In the future, we can add dynamic status items here
  
  // Example of how to add status items programmatically:
  // addStatusItem(statusBarLeft, 'Line: 1, Column: 1');
  // addStatusItem(statusBarRight, 'UTF-8');
}

// Initialize the sidebar
function initSidebar() {
  // Apply initial state based on tree variable
  updateSidebarVisibility();
}

// Initialize the sidebar resizer for drag functionality
function initSidebarResizer() {
  const sidebar = document.getElementById('sidebar');
  const resizer = document.getElementById('sidebar-resizer');
  
  if (!sidebar || !resizer) return;
  
  // Variables for tracking resize state
  let isResizing = false;
  let startX = 0;
  let startWidth = 0;
  
  // Handle mouse down event
  resizer.addEventListener('mousedown', (e) => {
    isResizing = true;
    startX = e.clientX;
    startWidth = parseInt(window.getComputedStyle(sidebar).width, 10);
    
    // Add active class for styling
    resizer.classList.add('active');
    
    // Prevent selection during resize
    document.body.style.userSelect = 'none';
  });
  
  // Handle mouse move event
  document.addEventListener('mousemove', (e) => {
    // Only run if we're resizing
    if (!isResizing) return;
    
    // Calculate the new width
    const newWidth = startWidth + (e.clientX - startX);
    
    // Apply min and max constraints
    const minWidth = 150; // Minimum sidebar width
    const maxWidth = 500; // Maximum sidebar width
    
    if (newWidth >= minWidth && newWidth <= maxWidth) {
      sidebar.style.width = `${newWidth}px`;
    }
  });
  
  // Handle mouse up event
  document.addEventListener('mouseup', () => {
    // Stop resizing
    if (isResizing) {
      isResizing = false;
      resizer.classList.remove('active');
      document.body.style.userSelect = '';
    }
  });
}

// Update sidebar visibility based on tree state
function updateSidebarVisibility() {
  const sidebar = document.getElementById('sidebar');
  if (sidebar) {
    if (tree) {
      sidebar.classList.add('open');
    } else {
      sidebar.classList.remove('open');
    }
  }
}

// Add tree view toggle button to the status bar
function addTreeViewToggle(container) {
  const treeViewItem = document.createElement('div');
  treeViewItem.className = 'status-bar-item tree-view-toggle';
  treeViewItem.setAttribute('title', 'Toggle Tree View');
  
  // Create SVG container
  const svgContainer = document.createElement('div');
  svgContainer.className = 'tree-icon';
  svgContainer.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-list-tree"><path d="M21 12h-8"/><path d="M21 6H8"/><path d="M21 18h-8"/><path d="M3 6v4c0 1.1.9 2 2 2h3"/><path d="M3 10v6c0 1.1.9 2 2 2h3"/></svg>`;
  treeViewItem.appendChild(svgContainer);
  
  // Add click event listener
  treeViewItem.addEventListener('click', toggleTreeView);
  
  // Add to container
  container.prepend(treeViewItem);
  
  // Initialize state
  updateTreeViewToggleState();
}

// Toggle tree view state
function toggleTreeView() {
  tree = !tree;
  updateTreeViewToggleState();
  updateSidebarVisibility();
  console.log('Tree view state:', tree ? 'open' : 'closed');
}

// Update tree view toggle button state
function updateTreeViewToggleState() {
  const treeViewToggle = document.querySelector('.tree-view-toggle');
  if (treeViewToggle) {
    if (tree) {
      treeViewToggle.classList.add('active');
    } else {
      treeViewToggle.classList.remove('active');
    }
  }
}

// Helper function to add status items
function addStatusItem(container, text, icon = null) {
  const statusItem = document.createElement('div');
  statusItem.className = 'status-bar-item status-fade-in';
  
  if (icon) {
    const iconElement = document.createElement('span');
    iconElement.className = 'status-icon';
    iconElement.textContent = icon;
    statusItem.appendChild(iconElement);
  }
  
  const textElement = document.createElement('span');
  textElement.className = 'status-text';
  textElement.textContent = text;
  statusItem.appendChild(textElement);
  
  container.appendChild(statusItem);
  return statusItem;
}
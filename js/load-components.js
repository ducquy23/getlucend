// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
	// Load header
	fetch('includes/header.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('header-placeholder').innerHTML = data;
			// Reinitialize Webflow scripts if needed
			if (typeof window.Webflow !== 'undefined') {
				window.Webflow.require('ix2').init();
			}
		})
		.catch(error => console.error('Error loading header:', error));

	// Load footer
	fetch('includes/footer.html')
		.then(response => response.text())
		.then(data => {
			document.getElementById('footer-placeholder').innerHTML = data;
		})
		.catch(error => console.error('Error loading footer:', error));
});


// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
	// Tính toán đường dẫn đến includes folder
	function getIncludesPath() {
		const path = window.location.pathname;
		// Nếu đang ở root (index.html hoặc /), dùng đường dẫn tương đối
		if (path === '/' || path.endsWith('/index.html') || path.endsWith('index.html')) {
			return 'includes/';
		}
		// Nếu đang ở file HTML khác ở root, cũng dùng đường dẫn tương đối
		if (path.endsWith('.html')) {
			return 'includes/';
		}
		// Mặc định
		return 'includes/';
	}

	// Điều chỉnh các link trong header/footer để hoạt động đúng
	function adjustLinks(container) {
		if (!container) return;
		
		const links = container.querySelectorAll('a[href^="/"]');
		const currentPath = window.location.pathname;
		const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
		
		links.forEach(link => {
			const href = link.getAttribute('href');
			// Chỉ điều chỉnh các link nội bộ (bắt đầu bằng /) và chưa có .html ở cuối
			if (href && href.startsWith('/') && !href.startsWith('//') && !href.endsWith('.html')) {
				// Loại bỏ dấu / đầu tiên
				const path = href.substring(1);
				
				// Chuyển sang đường dẫn tương đối với .html
				if (path === '') {
					// Trang chủ
					link.setAttribute('href', 'index.html');
				} else {
					// Các trang khác
					link.setAttribute('href', path + '.html');
				}
			}
		});
		
		// Cập nhật active state cho menu items
		links.forEach(link => {
			const href = link.getAttribute('href');
			if (href) {
				const linkPage = href.replace('.html', '').replace('index.html', 'index');
				const isCurrent = (currentPage === 'index' && linkPage === 'index') || 
								  (currentPage !== 'index' && linkPage === currentPage);
				
				if (isCurrent) {
					link.classList.add('w--current');
					link.setAttribute('aria-current', 'page');
				} else {
					link.classList.remove('w--current');
					link.removeAttribute('aria-current');
				}
			}
		});
	}

	const includesPath = getIncludesPath();

	// Load header
	fetch(includesPath + 'header.html')
		.then(response => response.text())
		.then(data => {
			const headerPlaceholder = document.getElementById('header-placeholder');
			if (headerPlaceholder) {
				headerPlaceholder.innerHTML = data;
				adjustLinks(headerPlaceholder);
				// Reinitialize Webflow scripts if needed
				if (typeof window.Webflow !== 'undefined') {
					window.Webflow.require('ix2').init();
				}
			}
		})
		.catch(error => console.error('Error loading header:', error));

	// Load footer
	fetch(includesPath + 'footer.html')
		.then(response => response.text())
		.then(data => {
			const footerPlaceholder = document.getElementById('footer-placeholder');
			if (footerPlaceholder) {
				footerPlaceholder.innerHTML = data;
				adjustLinks(footerPlaceholder);
			}
		})
		.catch(error => console.error('Error loading footer:', error));

	// Điều chỉnh các link trong body của trang (sau khi header và footer đã load)
	setTimeout(function() {
		adjustLinks(document.body);
	}, 100);
});


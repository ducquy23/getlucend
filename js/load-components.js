// Load header and footer components
document.addEventListener('DOMContentLoaded', function() {
	// Tính toán đường dẫn đến includes folder
	function getIncludesPath() {
		const path = window.location.pathname;
		// Đếm số cấp thư mục con (ví dụ: /articles/file.html = 1 cấp)
		// Path: /articles/file.html -> có 2 dấu / -> depth = 1
		const depth = (path.match(/\//g) || []).length - 1;
		
		// Nếu ở root (depth = 0), dùng đường dẫn tương đối
		if (depth <= 0) {
			return 'includes/';
		}
		
		// Nếu ở thư mục con, dùng ../ để quay về root
		// depth = 1 -> '../includes/'
		// depth = 2 -> '../../includes/'
		return '../'.repeat(depth) + 'includes/';
	}
	
	// Tính toán đường dẫn đến js folder (tương tự)
	function getJsPath() {
		const path = window.location.pathname;
		const depth = (path.match(/\//g) || []).length - 1;
		
		if (depth <= 0) {
			return 'js/';
		}
		
		return '../'.repeat(depth) + 'js/';
	}

	// Điều chỉnh các link trong header/footer để hoạt động đúng
	function adjustLinks(container) {
		if (!container) return;
		
		const links = container.querySelectorAll('a[href^="/"]');
		const currentPath = window.location.pathname;
		const currentPage = currentPath.split('/').pop().replace('.html', '') || 'index';
		
		// Tính độ sâu của thư mục hiện tại
		const depth = (currentPath.match(/\//g) || []).length - 1;
		const prefix = depth > 0 ? '../'.repeat(depth) : '';
		
		links.forEach(link => {
			const href = link.getAttribute('href');
			// Chỉ điều chỉnh các link nội bộ (bắt đầu bằng /) và chưa có .html ở cuối
			if (href && href.startsWith('/') && !href.startsWith('//') && !href.endsWith('.html')) {
				// Loại bỏ dấu / đầu tiên
				const path = href.substring(1);
				
				// Chuyển sang đường dẫn tương đối với .html
				if (path === '') {
					// Trang chủ
					link.setAttribute('href', prefix + 'index.html');
				} else {
					// Các trang khác
					link.setAttribute('href', prefix + path + '.html');
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


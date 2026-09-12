/**
 * layout.js - Quản lý & nạp các thành phần dùng chung toàn website:
 * 1. Header dùng chung (#header-placeholder)
 * 2. Thanh Menu dùng chung (#sidebar-placeholder)
 * 3. Chân trang web dùng chung (#footer-placeholder)
 * 4. Nút bật/tắt nhạc nền dùng chung (#music-placeholder)
 * 5. Các Cửa sổ Modal dùng chung (#modals-placeholder)
 */

async function loadLayoutComponent(placeholderId, componentPath) {
    const placeholder = document.getElementById(placeholderId);
    if (!placeholder) return;

    try {
        const response = await fetch(componentPath);
        if (!response.ok) throw new Error(`HTTP status ${response.status}`);
        const html = await response.text();
        placeholder.innerHTML = html;
    } catch (error) {
        console.error(`Không thể nạp component từ ${componentPath}:`, error);
    }
}

// Khởi tạo và đồng bộ trạng thái nhạc nền toàn cục
function initSharedMusicPlayer() {
    const musicBtn = document.getElementById('music-toggle-btn');
    const music = document.getElementById('background-music');
    if (!musicBtn || !music) return;

    // Lấy trạng thái lưu từ localStorage (mặc định là tắt)
    let isPlaying = localStorage.getItem('bgMusicPlaying') === 'true';

    function updateMusicUI() {
        if (isPlaying) {
            musicBtn.innerHTML = '<i class="fas fa-volume-up"></i>';
            musicBtn.classList.add('playing');
            musicBtn.setAttribute('title', 'Tắt nhạc nền');
        } else {
            musicBtn.innerHTML = '<i class="fas fa-volume-mute"></i>';
            musicBtn.classList.remove('playing');
            musicBtn.setAttribute('title', 'Bật nhạc nền');
        }
    }

    if (isPlaying) {
        music.play().catch(() => {
            // Trường hợp trình duyệt chặn autoplay
            isPlaying = false;
            localStorage.setItem('bgMusicPlaying', 'false');
            updateMusicUI();
        });
    }
    updateMusicUI();

    musicBtn.addEventListener('click', () => {
        if (music.paused) {
            music.play().then(() => {
                isPlaying = true;
                localStorage.setItem('bgMusicPlaying', 'true');
                updateMusicUI();
            }).catch(err => console.log('Không thể phát audio:', err));
        } else {
            music.pause();
            isPlaying = false;
            localStorage.setItem('bgMusicPlaying', 'false');
            updateMusicUI();
        }
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Tải đồng thời 5 thành phần dùng chung toàn trang
    await Promise.all([
        loadLayoutComponent('header-placeholder', 'components/header.html'),
        loadLayoutComponent('sidebar-placeholder', 'components/sidebar.html'),
        loadLayoutComponent('footer-placeholder', 'components/footer.html'),
        loadLayoutComponent('music-placeholder', 'components/music.html'),
        loadLayoutComponent('modals-placeholder', 'components/modals.html')
    ]);

    // 1. Tự động highlight menu item tương ứng trang hiện tại
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('#main-nav ul li a');
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // 2. Khởi tạo nhạc nền dùng chung
    initSharedMusicPlayer();

    // 3. Xử lý mở/đóng Sidebar Menu toàn cục
    document.addEventListener('click', (e) => {
        const openMenuBtn = e.target.closest('.open-menu-btn');
        const closeMenuBtn = e.target.closest('.close-menu-btn');
        const sideMenu = document.getElementById('side-menu');

        if (openMenuBtn && sideMenu) {
            sideMenu.classList.remove('hidden');
            sideMenu.classList.add('open');
        }

        if (closeMenuBtn && sideMenu) {
            sideMenu.classList.remove('open');
            sideMenu.classList.add('hidden');
        }

        if (sideMenu && sideMenu.classList.contains('open') && !sideMenu.contains(e.target) && !openMenuBtn) {
            sideMenu.classList.remove('open');
            sideMenu.classList.add('hidden');
        }
    });

    // 4. Khởi tạo nút cuộn Lên Đầu Trang & Cuộn Xuống Cuối Trang
    const scrollTopBtn = document.getElementById('scroll-to-top-btn');
    const scrollBottomBtn = document.getElementById('scroll-to-bottom-btn');

    if (scrollTopBtn) {
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    if (scrollBottomBtn) {
        scrollBottomBtn.addEventListener('click', () => {
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        });
    }

    // Phát sự kiện hoàn tất tải tất cả layout dùng chung
    document.dispatchEvent(new CustomEvent('layoutLoaded'));
});


function initMainApp() {
    // Khai báo các phần tử DOM
    const showLoginBtn = document.getElementById('show-login-btn');
    const showRegisterBtn = document.getElementById('show-register-btn');
    const showProfileBtn = document.getElementById('show-profile-btn');
    const showRegisterFromLogin = document.getElementById('show-register-from-login');
    const showLoginFromRegister = document.getElementById('show-login-from-register');
    const loggedOutView = document.getElementById('logged-out-view');
    const loggedInView = document.getElementById('logged-in-view');
    const userDisplay = document.getElementById('user-display');
    const logoutBtn = document.getElementById('logout-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const profileModal = document.getElementById('profile-modal');
    const profileName = document.getElementById('profile-name');
    const profileEmail = document.getElementById('profile-email');
    const profileDob = document.getElementById('profile-dob');
    const profileGender = document.getElementById('profile-gender');
    const profileOccupation = document.getElementById('profile-occupation');
    const profileBio = document.getElementById('profile-bio');
    const profileUsername = document.getElementById('profile-username');
    const profilePoints = document.getElementById('profile-points');
    const profileView = document.getElementById('profile-view');
    const editProfileForm = document.getElementById('edit-profile-form');
    const editProfileBtn = document.getElementById('edit-profile-btn');
    const cancelEditBtn = document.getElementById('cancel-edit-btn');
    const closeBtns = document.querySelectorAll('.modal .close-btn');
    const loginFormModal = document.getElementById('login-form-modal');
    const registerFormModal = document.getElementById('register-form-modal');
    const musicToggleBtn = document.getElementById('music-toggle-btn');
    const music = document.getElementById('background-music');
   
    const searchInput = document.getElementById('search-input');
    const postsContainer = document.getElementById('posts-container');
    const topPostsContainer = document.getElementById('top-posts-container');
    const leaderboardContainer = document.getElementById('leaderboard-container');
    const proposeChallengeBtn = document.getElementById('propose-challenge-btn');
    const challengeModal = document.getElementById('challenge-modal');
    const challengeForm = document.getElementById('propose-challenge-form');
    const newChallengeInput = document.getElementById('new-challenge-text');
    const proposedChallengesContainer = document.getElementById('proposed-challenges-container');
    const closeChallengeModalBtn = document.querySelector('#challenge-modal .close-btn');
    const cardGrid = document.querySelector('.card-grid');
    const allCards = Array.from(document.querySelectorAll('.card-link'));
    const notificationModal = document.getElementById('notification-modal');
    const notificationMessage = document.getElementById('notification-message');
    const openMenuBtn = document.querySelector('.open-menu-btn');
    const closeMenuBtn = document.querySelector('.close-menu-btn');
    const sideMenu = document.getElementById('side-menu');
    const adminLink = document.getElementById('admin-link');


    // Dữ liệu và trạng thái người dùng
    let currentUser = localStorage.getItem('currentUser');
    const ADMIN_USER = 'admin';
    let posts = JSON.parse(localStorage.getItem('creativePosts')) || [];
    let users = JSON.parse(localStorage.getItem('users')) || {};
    // Thêm tài khoản admin vào đây nếu chưa tồn tại
    if (!users['admin']) {
        users['admin'] = {
            name: 'Admin',
            email: 'admin@example.com',
            username: 'admin',
            password: 'admin123', // Anh có thể thay đổi mật khẩu này
            points: 0,
            dob: '',
            gender: '',
            occupation: '',
            bio: ''
        };
        // Lưu lại dữ liệu người dùng
        localStorage.setItem('users', JSON.stringify(users));
    }
    let userPoints = JSON.parse(localStorage.getItem('userPoints')) || {};
    let proposedChallenges = JSON.parse(localStorage.getItem('proposedChallenges')) || [];

    // Các hàm xử lý dữ liệu
    function savePosts() {
        localStorage.setItem('creativePosts', JSON.stringify(posts));
    }
    
    function saveUsers() {
        localStorage.setItem('users', JSON.stringify(users));
    }
    
    function saveUserPoints() {
        localStorage.setItem('userPoints', JSON.stringify(userPoints));
    }

    function updateUserPoints(username, pointsToAdd) {
        if (!userPoints[username]) {
            userPoints[username] = 0;
        }
        userPoints[username] += pointsToAdd;
        saveUserPoints();
    }

    function saveChallenges() {
        localStorage.setItem('proposedChallenges', JSON.stringify(proposedChallenges));
    }
    
    function showNotification(message) {
        if (!notificationModal || !notificationMessage) return;
        notificationMessage.textContent = message;
        notificationModal.style.display = 'block';
        setTimeout(() => {
            notificationModal.style.display = 'none';
        }, 3000);
    }
    
    // Hàm cập nhật giao diện đăng nhập/đăng xuất
    function updateAuthUI() {
        if (currentUser) {
            if (loggedOutView) loggedOutView.style.display = 'none';
            if (loggedInView) loggedInView.style.display = 'flex';
            if (userDisplay) userDisplay.textContent = currentUser;
            if (proposeChallengeBtn) proposeChallengeBtn.style.display = 'block';
            if (adminLink && currentUser === ADMIN_USER) {
                adminLink.style.display = 'block';
            } else if (adminLink) {
                adminLink.style.display = 'none';
            }
        } else {
            if (loggedOutView) loggedOutView.style.display = 'flex';
            if (loggedInView) loggedInView.style.display = 'none';
            if (proposeChallengeBtn) proposeChallengeBtn.style.display = 'none';
            if (adminLink) adminLink.style.display = 'none';
        }
    }
    
    function updateProfileDisplay(user) {
        if (!user) return;
        profileName.textContent = user.name || 'Chưa cập nhật';
        profileEmail.textContent = user.email || 'Chưa cập nhật';
        profileDob.textContent = user.dob || 'Chưa cập nhật';
        profileGender.textContent = user.gender || 'Chưa cập nhật';
        profileOccupation.textContent = user.occupation || 'Chưa cập nhật';
        profileBio.textContent = user.bio || 'Chưa cập nhật';
        profileUsername.textContent = user.username;
        profilePoints.textContent = user.points || 0;
    }

    // Handled centrally by layout.js initSharedMusicPlayer

    // === HIỆU ỨNG TRÁI TIM (Giới hạn số lượng nhẹ nhàng) ===
    const heartsContainer = document.getElementById('hearts-container');

    function createHeart() {
        if (!heartsContainer) return;
        // Giới hạn tối đa 6 trái tim cùng lúc trên màn hình để không làm rối mắt
        if (heartsContainer.childElementCount >= 6) return;

        const heart = document.createElement('div');
        heart.classList.add('heart');
        
        heart.style.left = (Math.random() * 92 + 4) + 'vw';
        
        const size = Math.random() * 12 + 8;
        heart.style.width = size + 'px';
        heart.style.height = size + 'px';

        const colors = ['#f72585', '#ff7e5f', '#feb47b', '#e0bbe4', '#4361ee'];
        heart.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];

        const duration = Math.random() * 6 + 8; // 8 - 14 giây
        heart.style.animationDuration = duration + 's';

        heartsContainer.appendChild(heart);

        // Xóa phần tử trái tim khi hiệu ứng rơi kết thúc
        heart.addEventListener('animationend', () => {
            heart.remove();
        });
    }

    // Tạo trái tim định kỳ mỗi 3.5 giây một cách nhẹ nhàng
    if (heartsContainer) {
        createHeart();
        setInterval(createHeart, 3500);
    }


    // Xử lý sự kiện click cho các nút liên quan đến modal
    if (showLoginBtn) {
        showLoginBtn.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
    }
    if (showRegisterBtn) {
        showRegisterBtn.addEventListener('click', () => {
            registerModal.style.display = 'flex';
        });
    }
    if (showProfileBtn) {
        showProfileBtn.addEventListener('click', () => {
            if (currentUser && users[currentUser]) {
                updateProfileDisplay(users[currentUser]);
                profileModal.style.display = 'flex';
                if (profileView) profileView.style.display = 'block';
                if (editProfileForm) editProfileForm.style.display = 'none';
            }
        });
    }
    if (showRegisterFromLogin) {
        showRegisterFromLogin.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'none';
            registerModal.style.display = 'flex';
        });
    }
    if (showLoginFromRegister) {
        showLoginFromRegister.addEventListener('click', (e) => {
            e.preventDefault();
            registerModal.style.display = 'none';
            loginModal.style.display = 'flex';
        });
    }
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('currentUser');
            currentUser = null;
            if (profileModal) profileModal.style.display = 'none';
            updateAuthUI();
            showNotification('Đã đăng xuất thành công.');
        });
    }
    
    // Xử lý form đăng nhập
    if (loginFormModal) {
        loginFormModal.addEventListener('submit', (e) => {
            e.preventDefault();
            const username = document.getElementById('login-username').value.trim();
            const password = document.getElementById('login-password').value;
            if (users[username] && users[username].password === password) {
                currentUser = username;
                localStorage.setItem('currentUser', currentUser);
                updateAuthUI();
                loginModal.style.display = 'none';
                showNotification(`Chào mừng ${currentUser} đã trở lại!`);
            } else {
                showNotification('Sai tên người dùng hoặc mật khẩu.');
            }
        });
    }

    // Xử lý form đăng ký
    if (registerFormModal) {
        registerFormModal.addEventListener('submit', (e) => {
            e.preventDefault();
            const name = document.getElementById('register-name').value.trim();
            const email = document.getElementById('register-email').value.trim();
            const username = document.getElementById('register-username').value.trim();
            const password = document.getElementById('register-password').value;

            if (users[username] !== undefined) {
                showNotification('Tên người dùng đã tồn tại. Vui lòng chọn tên khác.');
            } else {
                users[username] = {
                    name: name,
                    email: email,
                    password: password,
                    username: username,
                    points: 0,
                    dob: '',
                    gender: '',
                    occupation: '',
                    bio: ''
                };
                saveUsers();
                currentUser = username;
                localStorage.setItem('currentUser', currentUser);
                updateAuthUI();
                registerModal.style.display = 'none';
                showNotification(`Đăng ký thành công! Chào mừng ${currentUser}.`);
            }
        });
    }

    // Xử lý nút Chỉnh sửa
    if (editProfileBtn) {
        editProfileBtn.addEventListener('click', () => {
            const user = users[currentUser];
            document.getElementById('edit-name').value = user.name || '';
            document.getElementById('edit-email').value = user.email || '';
            document.getElementById('edit-dob').value = user.dob || '';
            document.getElementById('edit-gender').value = user.gender || '';
            document.getElementById('edit-occupation').value = user.occupation || '';
            document.getElementById('edit-bio').value = user.bio || '';

            if (profileView) profileView.style.display = 'none';
            if (editProfileForm) editProfileForm.style.display = 'block';
        });
    }

    // Xử lý nút Hủy
    if (cancelEditBtn) {
        cancelEditBtn.addEventListener('click', () => {
            if (profileView) profileView.style.display = 'block';
            if (editProfileForm) editProfileForm.style.display = 'none';
        });
    }
    
    // Xử lý form Lưu thay đổi
    if (editProfileForm) {
        editProfileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const user = users[currentUser];
            user.name = document.getElementById('edit-name').value.trim();
            user.email = document.getElementById('edit-email').value.trim();
            user.dob = document.getElementById('edit-dob').value;
            user.gender = document.getElementById('edit-gender').value;
            user.occupation = document.getElementById('edit-occupation').value.trim();
            user.bio = document.getElementById('edit-bio').value.trim();

            saveUsers();
            updateProfileDisplay(user);
            showNotification('Thông tin cá nhân đã được cập nhật!');
            profileModal.style.display = 'none';
        });
    }

    // Xử lý đóng modal
    closeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (registerModal) registerModal.style.display = 'none';
            if (profileModal) profileModal.style.display = 'none';
        });
    });

    window.addEventListener('click', (e) => {
        if (e.target == loginModal) loginModal.style.display = 'none';
        if (e.target == registerModal) registerModal.style.display = 'none';
        if (e.target == profileModal) profileModal.style.display = 'none';
    });
    
    // Xử lý menu bên
    if (openMenuBtn) {
        openMenuBtn.addEventListener('click', () => {
            sideMenu.classList.remove('hidden');
            sideMenu.classList.add('open');
        });
    }

    if (closeMenuBtn) {
        closeMenuBtn.addEventListener('click', () => {
            sideMenu.classList.remove('open');
            sideMenu.classList.add('hidden');
        });
    }

    // Xử lý tìm kiếm trên trang chủ
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.toLowerCase();
            const filteredCards = allCards.filter(card => {
                const searchTerms = card.dataset.searchTerms.toLowerCase();
                return searchTerms.includes(query);
            });
            
            cardGrid.innerHTML = '';
            if (filteredCards.length > 0) {
                filteredCards.forEach(card => cardGrid.appendChild(card));
            } else {
                cardGrid.innerHTML = '<p style="text-align:center; color:var(--secondary-text-color);">Không tìm thấy kết quả phù hợp.</p>';
            }
        });
    }
    
    // Xử lý đề xuất thử thách
    if (proposeChallengeBtn) {
        proposeChallengeBtn.addEventListener('click', () => {
            if (currentUser) {
                challengeModal.style.display = 'block';
            } else {
                showNotification("Vui lòng đăng nhập để đề xuất thử thách!");
            }
        });
    }

    if (closeChallengeModalBtn) {
        closeChallengeModalBtn.addEventListener('click', () => {
            challengeModal.style.display = 'none';
        });
    }
    
    if (challengeForm) {
        challengeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const newChallengeText = newChallengeInput.value.trim();
            if (newChallengeText) {
                const newChallenge = {
                    id: Date.now(),
                    text: newChallengeText,
                    author: currentUser,
                    votes: 0
                };
                proposedChallenges.push(newChallenge);
                saveChallenges();
                renderProposedChallenges();
                challengeModal.style.display = 'none';
                challengeForm.reset();
                showNotification("Đề xuất thử thách đã được gửi thành công!");
            }
        });
    }

    function renderProposedChallenges() {
        if (!proposedChallengesContainer) return;
        proposedChallengesContainer.innerHTML = '';
        if (proposedChallenges.length === 0) {
            proposedChallengesContainer.innerHTML = '<p style="text-align:center; color:var(--secondary-text-color);">Chưa có thử thách nào được đề xuất. Hãy là người đầu tiên!</p>';
            return;
        }

        proposedChallenges.forEach(challenge => {
            const challengeElement = document.createElement('div');
            challengeElement.classList.add('challenge-voting-item');

            let manageBtnsHtml = '';
            if (currentUser && (challenge.author === currentUser || currentUser === ADMIN_USER)) {
                manageBtnsHtml = `
                    <button class="edit-challenge-btn" data-id="${challenge.id}">Sửa</button>
                    <button class="delete-challenge-btn" data-id="${challenge.id}">Xóa</button>
                `;
            }
            
            challengeElement.innerHTML = `
                <p>${challenge.text}</p>
                <div class="voting-actions">
                    <button class="vote-btn" data-id="${challenge.id}">👍 <span class="vote-count">${challenge.votes}</span></button>
                    <span class="challenge-author">Đề xuất bởi: ${challenge.author}</span>
                    ${manageBtnsHtml}
                </div>
            `;
            proposedChallengesContainer.appendChild(challengeElement);
        });
        
        document.querySelectorAll('.vote-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!currentUser) {
                    showNotification("Vui lòng đăng nhập để bình chọn!");
                    return;
                }
                const id = parseInt(e.currentTarget.dataset.id);
                const challengeToUpdate = proposedChallenges.find(c => c.id === id);
                if (challengeToUpdate) {
                    challengeToUpdate.votes++;
                    saveChallenges();
                    renderProposedChallenges();
                    showNotification("Bạn đã bình chọn thành công!");
                }
            });
        });

        document.querySelectorAll('.delete-challenge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToDelete = parseInt(e.currentTarget.dataset.id);
                const challengeIndex = proposedChallenges.findIndex(c => c.id === idToDelete);
                if (challengeIndex !== -1) {
                    if (proposedChallenges[challengeIndex].author === currentUser || currentUser === ADMIN_USER) {
                        if (confirm("Bạn có chắc chắn muốn xóa thử thách này không?")) {
                            proposedChallenges.splice(challengeIndex, 1);
                            saveChallenges();
                            renderProposedChallenges();
                            showNotification("Thử thách đã được xóa thành công!");
                        }
                    } else {
                        showNotification("Bạn không có quyền xóa thử thách này!");
                    }
                }
            });
        });

        document.querySelectorAll('.edit-challenge-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToEdit = parseInt(e.currentTarget.dataset.id);
                const challengeToEdit = proposedChallenges.find(c => c.id === idToEdit);
                if (challengeToEdit) {
                    if (challengeToEdit.author === currentUser || currentUser === ADMIN_USER) {
                        const newText = prompt("Chỉnh sửa nội dung thử thách:", challengeToEdit.text);
                        if (newText !== null && newText.trim() !== '') {
                            challengeToEdit.text = newText;
                            saveChallenges();
                            renderProposedChallenges();
                            showNotification("Thử thách đã được cập nhật thành công!");
                        }
                    } else {
                        showNotification("Bạn không có quyền sửa thử thách này!");
                    }
                }
            });
        });
    }

    function renderPosts(filteredPosts = posts) {
        if (!postsContainer) return;
        postsContainer.innerHTML = '';
        if (filteredPosts.length === 0) {
            postsContainer.innerHTML = '<p style="text-align:center; color:var(--secondary-text-color);">Chưa có tác phẩm nào được đăng. Hãy là người đầu tiên!</p>';
            return;
        }
        filteredPosts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item');
            const postHeader = document.createElement('div');
            postHeader.classList.add('post-header');
            postHeader.innerHTML = `<h4>${post.author}</h4>`;
            let mediaHtml = '';
            if (post.fileType && post.fileUrl) {
                if (post.fileType.startsWith('image')) {
                    mediaHtml = `<img src="${post.fileUrl}" alt="${post.text}">`;
                } else if (post.fileType.startsWith('video')) {
                    mediaHtml = `<video controls src="${post.fileUrl}"></video>`;
                } else if (post.fileType.startsWith('audio')) {
                    mediaHtml = `<audio controls src="${post.fileUrl}"></audio>`;
                }
            }
            if (mediaHtml) {
                postElement.appendChild(document.createRange().createContextualFragment(mediaHtml));
            }
            if (post.text) {
                const textElement = document.createElement('p');
                textElement.innerText = post.text;
                postElement.appendChild(textElement);
            }
            const actionsElement = document.createElement('div');
            actionsElement.classList.add('actions');
            let manageBtnsHtml = '';
            if (currentUser && (post.author === currentUser || currentUser === ADMIN_USER)) {
                manageBtnsHtml = `
                    <button class="edit-btn" data-id="${post.id}">Sửa</button>
                    <button class="delete-btn" data-id="${post.id}">Xóa</button>
                `;
            }
            actionsElement.innerHTML = `
                <button class="like-btn" data-id="${post.id}">❤️ <span class="like-count">${post.likes || 0}</span></button>
                <input type="text" class="comment-input" placeholder="Viết bình luận..." data-id="${post.id}">
                ${manageBtnsHtml}
            `;
            postElement.appendChild(postHeader);
            postElement.appendChild(actionsElement);
            if (post.comments && post.comments.length > 0) {
                const commentsContainer = document.createElement('div');
                commentsContainer.classList.add('comments-container');
                post.comments.forEach((comment, commentIndex) => {
                    const commentElement = document.createElement('p');
                    commentElement.classList.add('comment');
                    let commentManageBtnsHtml = '';
                    if (currentUser && (comment.author === currentUser || currentUser === ADMIN_USER)) {
                        commentManageBtnsHtml = `
                            <button class="edit-comment-btn" data-post-id="${post.id}" data-comment-index="${commentIndex}">Sửa</button>
                            <button class="delete-comment-btn" data-post-id="${post.id}" data-comment-index="${commentIndex}">Xóa</button>
                        `;
                    }
                    commentElement.innerHTML = `
                        <strong>${comment.author}</strong>: <span>${comment.text}</span>
                        <span class="comment-actions">
                            <button class="like-comment-btn" data-post-id="${post.id}" data-comment-index="${commentIndex}">❤️ <span class="like-count">${comment.likes || 0}</span></button>
                            ${commentManageBtnsHtml}
                        </span>
                    `;
                    commentsContainer.appendChild(commentElement);
                });
                postElement.appendChild(commentsContainer);
            }
            postsContainer.appendChild(postElement);
        });
        addEventListenersToPosts();
    }

    function addEventListenersToPosts() {
        const likeButtons = document.querySelectorAll('.like-btn');
        likeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                if (!currentUser) {
                    showNotification("Vui lòng đăng nhập để thích bài viết!");
                    return;
                }
                const id = e.currentTarget.dataset.id;
                const post = posts.find(p => p.id === id);
                if (post) {
                    post.likes = (post.likes || 0) + 1;
                    if (post.author) {
                         updateUserPoints(post.author, 5);
                    }
                    savePosts();
                    renderPosts();
                    renderTopPosts();
                    renderLeaderboard();
                }
            });
        });
        const commentInputs = document.querySelectorAll('.comment-input');
        commentInputs.forEach(input => {
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && currentUser) {
                    const id = e.currentTarget.dataset.id;
                    const commentText = e.currentTarget.value;
                    const post = posts.find(p => p.id === id);
                    if (commentText.trim() !== '' && post) {
                        if (!post.comments) {
                            post.comments = [];
                        }
                        const newComment = {text: commentText, likes: 0, author: currentUser};
                        post.comments.push(newComment);
                        updateUserPoints(currentUser, 2);
                        savePosts();
                        renderPosts();
                        renderLeaderboard();
                    }
                } else if (e.key === 'Enter' && !currentUser) {
                    showNotification("Vui lòng đăng nhập để bình luận!");
                }
            });
        });
        const deleteButtons = document.querySelectorAll('.delete-btn');
        deleteButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToDelete = e.currentTarget.dataset.id;
                const postIndex = posts.findIndex(p => p.id === idToDelete);
                if (postIndex !== -1) {
                    if (posts[postIndex].author === currentUser || currentUser === ADMIN_USER) {
                        if (confirm("Bạn có chắc chắn muốn xóa bài viết này không?")) {
                            posts.splice(postIndex, 1);
                            savePosts();
                            renderPosts();
                            renderTopPosts();
                            renderLeaderboard();
                        }
                    } else {
                        showNotification("Bạn không có quyền xóa bài viết này!");
                    }
                }
            });
        });
        const editButtons = document.querySelectorAll('.edit-btn');
        editButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const idToEdit = e.currentTarget.dataset.id;
                const postToEdit = posts.find(p => p.id === idToEdit);
                if (postToEdit) {
                    if (postToEdit.author === currentUser || currentUser === ADMIN_USER) {
                        const newText = prompt("Chỉnh sửa nội dung bài viết:", postToEdit.text);
                        if (newText !== null && newText.trim() !== '') {
                            postToEdit.text = newText;
                            savePosts();
                            renderPosts();
                            renderTopPosts();
                        }
                    } else {
                        showNotification("Bạn không có quyền sửa bài viết này!");
                    }
                }
            });
        });
        const deleteCommentButtons = document.querySelectorAll('.delete-comment-btn');
        deleteCommentButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = e.currentTarget.dataset.postId;
                const commentIndex = parseInt(e.currentTarget.dataset.commentIndex);
                const post = posts.find(p => p.id === postId);
                if (post && (post.comments[commentIndex].author === currentUser || currentUser === ADMIN_USER)) {
                    if (confirm("Bạn có chắc chắn muốn xóa bình luận này không?")) {
                        post.comments.splice(commentIndex, 1);
                        savePosts();
                        renderPosts();
                        renderLeaderboard();
                    }
                } else {
                    showNotification("Bạn không có quyền xóa bình luận này!");
                }
            });
        });
        const editCommentButtons = document.querySelectorAll('.edit-comment-btn');
        editCommentButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const postId = e.currentTarget.dataset.postId;
                const commentIndex = parseInt(e.currentTarget.dataset.commentIndex);
                const post = posts.find(p => p.id === postId);
                if (post && (post.comments[commentIndex].author === currentUser || currentUser === ADMIN_USER)) {
                    const newCommentText = prompt("Chỉnh sửa bình luận:", post.comments[commentIndex].text);
                    if (newCommentText !== null && newCommentText.trim() !== '') {
                        post.comments[commentIndex].text = newCommentText;
                        savePosts();
                        renderPosts();
                    }
                } else {
                    showNotification("Bạn không có quyền sửa bình luận này!");
                }
            });
        });
    }

    function renderTopPosts() {
        if (!topPostsContainer) return;
        topPostsContainer.innerHTML = '';
        const sortedPosts = [...posts].sort((a, b) => (b.likes || 0) - (a.likes || 0));
        const top1Posts = sortedPosts.slice(0, 1);

        if (top1Posts.length === 0) {
            topPostsContainer.innerHTML = '<p style="text-align:center; color:var(--secondary-text-color);">Chưa có tác phẩm nào đạt đủ lượt thích để lên bảng vàng!</p>';
            return;
        }

        top1Posts.forEach((post) => {
            const postElement = document.createElement('div');
            postElement.classList.add('post-item', 'top-post-item');
            const postHeader = document.createElement('div');
            postHeader.classList.add('post-header');
            postHeader.innerHTML = `<h4>${post.author}</h4>`;
            let mediaHtml = '';
            if (post.fileType && post.fileUrl) {
                if (post.fileType.startsWith('image')) {
                    mediaHtml = `<img src="${post.fileUrl}" alt="${post.text}">`;
                } else if (post.fileType.startsWith('video')) {
                    mediaHtml = `<video controls src="${post.fileUrl}"></video>`;
                } else if (post.fileType.startsWith('audio')) {
                    mediaHtml = `<audio controls src="${post.fileUrl}"></audio>`;
                }
            }
            if (mediaHtml) {
                postElement.appendChild(document.createRange().createContextualFragment(mediaHtml));
            }
            if (post.text) {
                const textElement = document.createElement('p');
                textElement.innerText = post.text;
                postElement.appendChild(textElement);
            }
            const likesElement = document.createElement('p');
            likesElement.classList.add('top-likes');
            likesElement.innerText = `❤️ ${post.likes || 0} lượt thích`;
            postElement.appendChild(postHeader);
            postElement.appendChild(likesElement);
            topPostsContainer.appendChild(postElement);
        });
    }

    function renderLeaderboard() {
        if (!leaderboardContainer) return;
        leaderboardContainer.innerHTML = '';
        const sortedUsers = Object.entries(userPoints)
                                .sort(([,a],[,b]) => b - a)
                                .slice(0, 10);
        if (sortedUsers.length > 0) {
            const list = document.createElement('ol');
            sortedUsers.forEach(([username, points], index) => {
                const listItem = document.createElement('li');
                listItem.classList.add('leaderboard-item');
                listItem.innerHTML = `
                    <span class="leaderboard-rank">${index + 1}.</span>
                    <span class="leaderboard-user">${username}</span>
                    <span class="leaderboard-points">${points} điểm</span>
                `;
                list.appendChild(listItem);
            });
            leaderboardContainer.appendChild(list);
        } else {
            leaderboardContainer.innerHTML = '<p>Chưa có ai ghi điểm. Hãy là người đầu tiên!</p>';
        }
    }
    
    // Xử lý contact form
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            alert("Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.");
            contactForm.reset();
        });
    }

    // === XỬ LÝ CHUYỂN ĐỔI CHỦ ĐỀ MÀU SẮC VỚI MODAL ===
    const showThemeModalBtn = document.getElementById('show-theme-modal');
    const themeModal = document.getElementById('theme-modal');
    const closeThemeModalBtn = document.getElementById('close-theme-modal-btn');
    const closePaletteBtn = document.getElementById('close-palette-btn');
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const savedTheme = localStorage.getItem('theme') || 'default';

    // Hàm áp dụng chủ đề
    function applyTheme(themeName) {
        document.body.setAttribute('data-theme', themeName);
        localStorage.setItem('theme', themeName);
    }

    // Áp dụng chủ đề đã lưu khi tải trang
    applyTheme(savedTheme);

    // Xử lý sự kiện mở/đóng modal
    if (showThemeModalBtn) {
        showThemeModalBtn.addEventListener('click', () => {
            themeModal.style.display = 'flex';
        });
    }

    if (closeThemeModalBtn) {
        closeThemeModalBtn.addEventListener('click', () => {
            themeModal.style.display = 'none';
        });
    }

    if (closePaletteBtn) {
        closePaletteBtn.addEventListener('click', () => {
            themeModal.style.display = 'none';
        });
    }

    // Xử lý sự kiện click vào các ô màu
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', () => {
            const theme = swatch.dataset.theme;
            applyTheme(theme);
            showNotification(`Đã chuyển sang chủ đề ${theme}!`);
            themeModal.style.display = 'none';
        });
    });

    // === HIỆU ỨNG XUẤT HIỆN KHI CUỘN TRANG ===
    const observerOptions = {
        root: null, // Sử dụng viewport làm root
        rootMargin: '0px',
        threshold: 0.1 // Kích hoạt khi 10% phần tử hiển thị
    };

    function handleIntersection(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target); // Ngừng theo dõi sau khi hiệu ứng đã chạy
            }
        });
    }

    const observer = new IntersectionObserver(handleIntersection, observerOptions);

    document.querySelectorAll('.hidden-on-load').forEach(element => {
        observer.observe(element);
    });

    // === GỌI HÀM HIỂN THỊ DỮ LIỆU BAN ĐẦU ===
    renderProposedChallenges();
    renderLeaderboard();
    renderTopPosts();
    renderPosts();
    updateAuthUI();
}

// Khởi chạy khi các thành phần layout đã nạp xong (hoặc khi DOM ready)
document.addEventListener('layoutLoaded', initMainApp);
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    // Nếu layoutLoaded đã kích hoạt trước đó
    setTimeout(initMainApp, 50);
} else {
    document.addEventListener('DOMContentLoaded', () => {
        setTimeout(initMainApp, 50);
    });
}

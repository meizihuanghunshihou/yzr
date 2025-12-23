// 照片数据
const photos = [
    '微信图片_20251223162917_618_249.jpg',
    '微信图片_20251223162918_619_249.jpg',
    '微信图片_20251223162919_620_249.jpg',
    '微信图片_20251223162920_621_249.jpg',
    '微信图片_20251223162921_622_249.jpg',
    '微信图片_20251223162922_623_249.jpg',
    '微信图片_20251223162923_624_249.jpg',
    '微信图片_20251223162924_625_249.jpg',
    '微信图片_20251223162925_626_249.jpg',
    '微信图片_20251223162926_627_249.jpg'
];

// DOM元素
const loginContainer = document.getElementById('loginContainer');
const mainContent = document.getElementById('mainContent');
const loginForm = document.getElementById('loginForm');
const logoutBtn = document.getElementById('logoutBtn');
const photoGallery = document.getElementById('photoGallery');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const closeBtn = document.querySelector('.close-btn');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const navLinks = document.querySelectorAll('.nav-link');
const pageContents = document.querySelectorAll('.page-content');

// 当前照片索引
let currentPhotoIndex = 0;

// 初始化满屏飘爱心 - 增强版
function initFloatingHearts() {
    const floatingHeartsContainer = document.createElement('div');
    floatingHeartsContainer.className = 'floating-hearts';
    document.body.appendChild(floatingHeartsContainer);
    
    // 创建星光背景
    createStarryBackground();
    
    // 创建更多类型的飘动元素
    setInterval(() => {
        createFloatingHeart(floatingHeartsContainer);
        if (Math.random() > 0.7) createFloatingStar(floatingHeartsContainer);
        if (Math.random() > 0.9) createFloatingSparkle(floatingHeartsContainer);
    }, 300);
}

function createFloatingHeart(container) {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '❤️';
    
    // 随机位置、大小和颜色
    const size = Math.random() * 40 + 20;
    const left = Math.random() * 100;
    const delay = Math.random() * 5;
    const duration = Math.random() * 4 + 6;
    const colors = ['#e91e63', '#ff4081', '#f50057', '#c2185b', '#d81b60', '#ff6b6b', '#ff4757'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    heart.style.fontSize = `${size}px`;
    heart.style.left = `${left}vw`;
    heart.style.animationDelay = `${delay}s`;
    heart.style.animationDuration = `${duration}s`;
    heart.style.color = color;
    heart.style.filter = `drop-shadow(0 0 10px ${color})`;
    
    container.appendChild(heart);
    
    // 动画结束后移除爱心
    setTimeout(() => {
        if (heart.parentNode) {
            heart.remove();
        }
    }, duration * 1000);
}

function createStarryBackground() {
    const starryBg = document.createElement('div');
    starryBg.className = 'starry-background';
    document.body.appendChild(starryBg);
    
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.width = `${Math.random() * 3 + 1}px`;
        star.style.height = star.style.width;
        star.style.left = `${Math.random() * 100}vw`;
        star.style.top = `${Math.random() * 100}vh`;
        star.style.animationDelay = `${Math.random() * 5}s`;
        starryBg.appendChild(star);
    }
}

function createFloatingStar(container) {
    const star = document.createElement('div');
    star.className = 'floating-star';
    star.innerHTML = '⭐';
    
    const size = Math.random() * 20 + 10;
    const left = Math.random() * 100;
    const duration = Math.random() * 3 + 4;
    
    star.style.fontSize = `${size}px`;
    star.style.left = `${left}vw`;
    star.style.animationDuration = `${duration}s`;
    
    container.appendChild(star);
    
    setTimeout(() => {
        if (star.parentNode) {
            star.remove();
        }
    }, duration * 1000);
}

function createFloatingSparkle(container) {
    const sparkle = document.createElement('div');
    sparkle.className = 'floating-sparkle';
    sparkle.innerHTML = '✨';
    
    const size = Math.random() * 25 + 15;
    const left = Math.random() * 100;
    const duration = Math.random() * 2 + 2;
    
    sparkle.style.fontSize = `${size}px`;
    sparkle.style.left = `${left}vw`;
    sparkle.style.animationDuration = `${duration}s`;
    
    container.appendChild(sparkle);
    
    setTimeout(() => {
        if (sparkle.parentNode) {
            sparkle.remove();
        }
    }, duration * 1000);
}

// 点击爱心动画
function createClickHeart(x, y) {
    const heart = document.createElement('div');
    heart.className = 'click-heart';
    heart.style.left = `${x - 15}px`;
    heart.style.top = `${y - 15}px`;
    
    document.body.appendChild(heart);
    
    // 1秒后移除爱心
    setTimeout(() => {
        heart.remove();
    }, 1000);
}

// 页面切换
function switchPage(pageId) {
    // 隐藏所有页面
    pageContents.forEach(page => {
        page.classList.remove('active');
    });
    
    // 显示目标页面
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
        targetPage.classList.add('active');
    }
    
    // 更新导航链接状态
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-page') === pageId) {
            link.classList.add('active');
        }
    });
}

// 登录验证
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // 验证账号密码（支持更多昵称和密码）
    const validUsernames = ['尹昭蓉', '昭昭', '蓉蓉', '昭蓉', '蓉蓉宝贝'];
    const validPasswords = ['woaini', '520', '1314', '1314520', 'iloveyou', 'love'];
    
    if (validUsernames.includes(username) && validPasswords.includes(password)) {
        // 登录成功动画
        const loginBtn = loginForm.querySelector('.login-btn');
        
        loginBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 登录中...';
        loginBtn.disabled = true;
        
        setTimeout(() => {
            loginBtn.innerHTML = '<i class="fas fa-check"></i> 登录成功！';
            loginBtn.style.background = 'linear-gradient(135deg, #4CAF50, #45a049)';
            loginBtn.style.transform = 'translateY(-2px)';
            
            // 创建登录成功特效
            createLoginSuccessEffect();
            
            setTimeout(() => {
                // 切换到主界面
                loginContainer.classList.add('hidden');
                mainContent.classList.remove('hidden');
                
                // 初始化各种功能
                loadPhotos();
                showWelcomeAnimation();
                initFloatingHearts();
                initPageAnimations();
                
                // 保存登录状态
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('username', username);
                
            }, 1000);
        }, 1000);
    } else {
        // 登录失败动画
        showLoginError();
    }
});

// 退出登录
logoutBtn.addEventListener('click', function() {
    mainContent.classList.add('hidden');
    loginContainer.classList.remove('hidden');
    
    // 重置表单
    loginForm.reset();
});

// 导航链接点击事件
navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const pageId = this.getAttribute('data-page');
        switchPage(pageId);
    });
});

// 加载照片到画廊
function loadPhotos() {
    photoGallery.innerHTML = '';
    
    photos.forEach((photo, index) => {
        const photoItem = document.createElement('div');
        photoItem.className = 'photo-item';
        photoItem.innerHTML = `
            <img src="${photo}" alt="美好回忆 ${index + 1}" loading="lazy">
            <div class="photo-overlay">
                <p>美好回忆 ${index + 1}</p>
            </div>
        `;
        
        // 点击照片打开大图
        photoItem.addEventListener('click', () => {
            openPhotoModal(index);
        });
        
        photoGallery.appendChild(photoItem);
    });
}

// 打开照片模态框
function openPhotoModal(index) {
    currentPhotoIndex = index;
    modalImage.src = photos[index];
    modalImage.alt = `美好回忆 ${index + 1}`;
    photoModal.classList.remove('hidden');
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closePhotoModal() {
    photoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 显示上一张照片
function showPrevPhoto() {
    currentPhotoIndex = (currentPhotoIndex - 1 + photos.length) % photos.length;
    modalImage.src = photos[currentPhotoIndex];
    modalImage.alt = `美好回忆 ${currentPhotoIndex + 1}`;
}

// 显示下一张照片
function showNextPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    modalImage.src = photos[currentPhotoIndex];
    modalImage.alt = `美好回忆 ${currentPhotoIndex + 1}`;
}

// 显示欢迎动画
function showWelcomeAnimation() {
    const welcomeElements = document.querySelectorAll('.welcome-content h2, .welcome-content p, .love-message');
    
    welcomeElements.forEach((element, index) => {
        element.style.animation = `fadeInUp 1s ease ${index * 0.2}s both`;
    });
}

// 显示登录错误提示
function showLoginError() {
    const loginBtn = document.querySelector('.login-btn');
    const originalText = loginBtn.querySelector('span').textContent;
    
    // 添加抖动动画
    loginForm.style.animation = 'shake 0.5s ease-in-out';
    
    // 改变按钮文本和颜色
    loginBtn.querySelector('span').textContent = '账号或密码错误';
    loginBtn.style.background = 'linear-gradient(135deg, #ff4757, #ff3838)';
    
    setTimeout(() => {
        loginForm.style.animation = '';
        loginBtn.querySelector('span').textContent = originalText;
        loginBtn.style.background = 'linear-gradient(135deg, #e91e63, #ad1457)';
    }, 2000);
}

// 添加抖动动画的CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes shake {
        0%, 100% { transform: translateX(0); }
        25% { transform: translateX(-10px); }
        75% { transform: translateX(10px); }
    }
`;
document.head.appendChild(style);

// 事件监听器
closeBtn.addEventListener('click', closePhotoModal);
prevBtn.addEventListener('click', showPrevPhoto);
nextBtn.addEventListener('click', showNextPhoto);

// 点击模态框背景关闭
photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
        closePhotoModal();
    }
});

// 点击页面任意位置创建爱心
document.addEventListener('click', function(e) {
    if (!photoModal.classList.contains('hidden')) return;
    createClickHeart(e.clientX, e.clientY);
});

// 键盘事件支持
document.addEventListener('keydown', (e) => {
    if (!photoModal.classList.contains('hidden')) {
        switch(e.key) {
            case 'Escape':
                closePhotoModal();
                break;
            case 'ArrowLeft':
                showPrevPhoto();
                break;
            case 'ArrowRight':
                showNextPhoto();
                break;
        }
    }
});

// 页面加载完成后的初始化
window.addEventListener('load', function() {
    // 检查是否已经登录
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (isLoggedIn) {
        loginContainer.classList.add('hidden');
        mainContent.classList.remove('hidden');
        loadPhotos();
        initFloatingHearts();
        showWelcomeAnimation();
        initPageAnimations();
    }
    
    // 退出时清除登录状态
    logoutBtn.addEventListener('click', function() {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
    });
});

// 添加滚动动画效果
window.addEventListener('scroll', function() {
    const photoItems = document.querySelectorAll('.photo-item');
    const loveCards = document.querySelectorAll('.love-card');
    const timelineItems = document.querySelectorAll('.timeline-item');
    const windowHeight = window.innerHeight;
    
    photoItems.forEach(item => {
        const position = item.getBoundingClientRect().top;
        if (position < windowHeight - 100) {
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }
    });
    
    loveCards.forEach((card, index) => {
        const position = card.getBoundingClientRect().top;
        if (position < windowHeight - 100) {
            card.style.animation = `fadeInUp 0.8s ease ${index * 0.1}s both`;
        }
    });
    
    timelineItems.forEach((item, index) => {
        const position = item.getBoundingClientRect().top;
        if (position < windowHeight - 100) {
            item.style.animation = `fadeInUp 0.8s ease ${index * 0.2}s both`;
        }
    });
});

// 预加载照片
function preloadPhotos() {
    photos.forEach(photo => {
        const img = new Image();
        img.src = photo;
    });
}

// 页面加载时预加载照片
preloadPhotos();
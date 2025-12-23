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
const video = document.getElementById('video');
const heartTree = document.getElementById('heartTree');
const treeCrown = document.getElementById('treeCrown');
const startCameraBtn = document.getElementById('startCamera');
const stopCameraBtn = document.getElementById('stopCamera');
const resetTreeBtn = document.getElementById('resetTree');
const photoModal = document.getElementById('photoModal');
const modalImage = document.getElementById('modalImage');
const closeModalBtn = document.getElementById('closeModal');

// 手势识别变量
let stream = null;
let isCameraActive = false;
let scale = 1;
let currentPhotoIndex = 0;
let isProcessing = false;

// 运动检测变量
let previousFrame = null;
let motionHistory = [];
let gestureStartTime = 0;
let activeGesture = null;

// 状态管理
let cameraStatus = '未启动';
let gestureStatus = '等待手势';
let lastGestureTime = 0;

// 初始化爱心树 - 增强版
function initHeartTree() {
    console.log('开始初始化爱心树...');
    
    // 确保treeCrown元素存在
    if (!treeCrown) {
        console.error('treeCrown元素未找到');
        showStatusMessage('❌ 树冠元素未找到，请刷新页面', 'error');
        return;
    }
    
    treeCrown.innerHTML = '';
    
    // 创建更多爱心叶子（50个）
    const heartCount = 50;
    for (let i = 0; i < heartCount; i++) {
        createHeartLeaf(i);
    }
    
    console.log(`爱心树初始化完成，创建了${heartCount}个爱心叶子`);
    
    // 检查爱心树是否正常显示
    setTimeout(() => {
        const heartLeaves = document.querySelectorAll('.heart-leaf');
        console.log(`检测到 ${heartLeaves.length} 个爱心叶子`);
        
        if (heartLeaves.length === 0) {
            console.error('爱心叶子未正确创建');
            showStatusMessage('❌ 爱心树创建失败，请检查CSS样式', 'error');
            
            // 备用方案：使用简单的div显示
            createFallbackTree();
        } else {
            console.log('✅ 爱心树创建成功');
            showStatusMessage('✅ 爱心树已加载完成', 'success');
            
            // 添加动态闪烁效果
            startHeartTreeAnimation();
        }
    }, 500);
}

function createHeartLeaf(index) {
    const heartLeaf = document.createElement('div');
    heartLeaf.className = 'heart-leaf';
    heartLeaf.setAttribute('data-photo-index', index % photos.length);
    heartLeaf.id = `heart-${index}`;
    
    // 随机位置，确保在树冠范围内
    const left = Math.random() * 80 + 10; // 10% - 90%
    const top = Math.random() * 80 + 10; // 10% - 90%
    heartLeaf.style.left = `${left}%`;
    heartLeaf.style.top = `${top}%`;
    
    // 随机大小和动画延迟
    const size = Math.random() * 30 + 20; // 20px - 50px
    heartLeaf.style.fontSize = `${size}px`;
    heartLeaf.style.animationDelay = `${Math.random() * 3}s`;
    
    // 随机颜色变化
    const colors = ['#e91e63', '#ff4081', '#f50057', '#c2185b', '#d81b60', '#ff6b6b', '#ff4757', '#ff3838'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    heartLeaf.style.setProperty('--heart-color', color);
    
    // 添加点击事件监听器
    heartLeaf.addEventListener('click', function() {
        const photoIndex = parseInt(this.getAttribute('data-photo-index'));
        openPhotoModal(photoIndex);
        
        // 增强点击效果
        this.style.transform = 'scale(1.8)';
        this.style.filter = 'brightness(2) drop-shadow(0 0 30px currentColor)';
        this.style.zIndex = '1000';
        
        // 创建点击特效
        createClickEffect(this);
        
        setTimeout(() => {
            this.style.transform = '';
            this.style.filter = '';
            this.style.zIndex = '';
        }, 800);
    });
    
    // 增强鼠标悬停效果
    heartLeaf.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.5)';
        this.style.filter = 'brightness(1.8) drop-shadow(0 0 25px currentColor)';
        this.style.zIndex = '100';
    });
    
    heartLeaf.addEventListener('mouseleave', function() {
        this.style.transform = '';
        this.style.filter = '';
        this.style.zIndex = '';
    });
    
    treeCrown.appendChild(heartLeaf);
}

function createClickEffect(heartElement) {
    const effect = document.createElement('div');
    const rect = heartElement.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top + rect.height / 2;
    
    effect.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: radial-gradient(circle, currentColor 0%, transparent 70%);
        pointer-events: none;
        z-index: 999;
        animation: click-expand 0.8s ease-out;
    `;
    effect.style.color = getComputedStyle(heartElement).getPropertyValue('--heart-color');
    
    document.body.appendChild(effect);
    
    setTimeout(() => {
        if (effect.parentNode) {
            effect.remove();
        }
    }, 800);
}

function createFallbackTree() {
    const fallbackDiv = document.createElement('div');
    fallbackDiv.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: white;
        font-size: 18px;
        text-align: center;
        background: rgba(0,0,0,0.7);
        padding: 20px;
        border-radius: 10px;
        animation: pulse 2s infinite;
    `;
    fallbackDiv.innerHTML = '❤️ 爱心树加载中...<br><small>如果长时间未显示，请刷新页面</small>';
    treeCrown.appendChild(fallbackDiv);
}

function startHeartTreeAnimation() {
    // 添加随机闪烁效果
    setInterval(() => {
        const heartLeaves = document.querySelectorAll('.heart-leaf');
        if (heartLeaves.length > 0) {
            const randomHeart = heartLeaves[Math.floor(Math.random() * heartLeaves.length)];
            randomHeart.style.animation = 'heartGlow 0.5s ease-in-out';
            setTimeout(() => {
                randomHeart.style.animation = '';
            }, 500);
        }
    }, 2000);
}

// 开启摄像头
async function startCamera() {
    try {
        // 显示加载状态
        startCameraBtn.disabled = true;
        startCameraBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 开启中...';
        
        stream = await navigator.mediaDevices.getUserMedia({ 
            video: { 
                width: 640, 
                height: 480,
                facingMode: 'user' 
            } 
        });
        
        video.srcObject = stream;
        isCameraActive = true;
        
        // 显示摄像头状态
        updateCameraStatus('摄像头已开启', 'success');
        
        // 等待视频加载
        video.onloadedmetadata = function() {
            console.log('视频尺寸:', video.videoWidth, 'x', video.videoHeight);
            
            // 开始计算机视觉手势识别
            startComputerVisionRecognition();
            
            // 恢复按钮状态
            startCameraBtn.disabled = false;
            startCameraBtn.innerHTML = '开启摄像头';
        };
        
        video.onerror = function() {
            console.error('视频加载错误');
            updateCameraStatus('视频加载失败', 'error');
            startCameraBtn.disabled = false;
            startCameraBtn.innerHTML = '开启摄像头';
        };
        
    } catch (error) {
        console.error('无法开启摄像头:', error);
        updateCameraStatus('摄像头访问失败', 'error');
        
        // 根据错误类型给出具体提示
        if (error.name === 'NotAllowedError') {
            alert('请允许摄像头访问权限，然后重新开启摄像头');
        } else if (error.name === 'NotFoundError') {
            alert('未找到摄像头设备，请检查摄像头连接');
        } else {
            alert('无法访问摄像头：' + error.message);
        }
        
        startCameraBtn.disabled = false;
        startCameraBtn.innerHTML = '开启摄像头';
    }
}

// 关闭摄像头
function stopCamera() {
    if (stream) {
        stream.getTracks().forEach(track => track.stop());
        video.srcObject = null;
        isCameraActive = false;
        isProcessing = false;
        
        // 清除所有Canvas元素
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => canvas.remove());
        
        // 清除调试信息
        const debugInfo = document.querySelector('.camera-section div[style*="position: absolute"]');
        if (debugInfo) debugInfo.remove();
        
        updateCameraStatus('摄像头已关闭', 'info');
        console.log('摄像头已关闭');
    }
}

// 更新摄像头状态
function updateCameraStatus(message, type = 'info') {
    cameraStatus = message;
    
    // 更新状态显示
    const statusElement = document.getElementById('cameraStatus');
    if (statusElement) {
        statusElement.textContent = message;
        
        // 根据类型设置颜色
        switch(type) {
            case 'success':
                statusElement.style.color = '#4CAF50';
                break;
            case 'error':
                statusElement.style.color = '#F44336';
                break;
            case 'info':
                statusElement.style.color = '#2196F3';
                break;
            default:
                statusElement.style.color = '#666';
        }
    }
    
    // 显示状态提示
    showStatusMessage(message, type);
}

// 显示状态消息
function showStatusMessage(message, type = 'info') {
    // 移除现有的状态消息
    const existingMessage = document.querySelector('.status-message');
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // 创建新的状态消息
    const statusMessage = document.createElement('div');
    statusMessage.className = 'status-message';
    statusMessage.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: ${type === 'error' ? '#F44336' : type === 'success' ? '#4CAF50' : '#2196F3'};
        color: white;
        padding: 20px 30px;
        border-radius: 10px;
        z-index: 1000;
        font-size: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        animation: fadeInOut 3s ease-in-out;
    `;
    
    statusMessage.textContent = message;
    document.body.appendChild(statusMessage);
    
    // 3秒后自动移除
    setTimeout(() => {
        if (statusMessage.parentNode) {
            statusMessage.remove();
        }
    }, 3000);
}

// 添加CSS动画
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInOut {
        0% { opacity: 0; transform: translate(-50%, -60%); }
        20% { opacity: 1; transform: translate(-50%, -50%); }
        80% { opacity: 1; transform: translate(-50%, -50%); }
        100% { opacity: 0; transform: translate(-50%, -40%); }
    }
`;
document.head.appendChild(style);

// 计算机视觉手势识别
function startComputerVisionRecognition() {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // 创建用于显示处理结果的canvas
    const resultCanvas = document.createElement('canvas');
    const resultCtx = resultCanvas.getContext('2d');
    resultCanvas.style.position = 'absolute';
    resultCanvas.style.top = '0';
    resultCanvas.style.left = '0';
    resultCanvas.style.zIndex = '50';
    resultCanvas.style.opacity = '0.7';
    resultCanvas.style.border = '2px solid #e91e63';
    resultCanvas.style.borderRadius = '10px';
    
    // 添加调试信息显示
    const debugInfo = document.createElement('div');
    debugInfo.style.position = 'absolute';
    debugInfo.style.top = '10px';
    debugInfo.style.left = '10px';
    debugInfo.style.backgroundColor = 'rgba(0,0,0,0.7)';
    debugInfo.style.color = 'white';
    debugInfo.style.padding = '10px';
    debugInfo.style.borderRadius = '5px';
    debugInfo.style.zIndex = '100';
    debugInfo.style.fontSize = '12px';
    debugInfo.style.fontFamily = 'monospace';
    debugInfo.innerHTML = '<div>摄像头状态: <span id="cameraStatus">运行中</span></div>' +
                         '<div>帧率: <span id="frameRate">0</span> FPS</div>' +
                         '<div>检测到手指: <span id="fingerCount">0</span></div>' +
                         '<div>手势状态: <span id="gestureStatus">无</span></div>';
    
    document.querySelector('.camera-section').appendChild(resultCanvas);
    document.querySelector('.camera-section').appendChild(debugInfo);
    
    let frameCount = 0;
    let lastFrameTime = performance.now();
    
    function processFrame() {
        if (!isCameraActive || isProcessing || !video.videoWidth) {
            requestAnimationFrame(processFrame);
            return;
        }
        
        isProcessing = true;
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        resultCanvas.width = video.videoWidth;
        resultCanvas.height = video.videoHeight;
        
        try {
            // 绘制当前帧
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 检测手势
            detectGestures(imageData, ctx, resultCtx);
            
            // 保存当前帧用于运动检测
            previousFrame = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 更新帧率显示
            frameCount++;
            const currentTime = performance.now();
            if (currentTime - lastFrameTime >= 1000) {
                const fps = Math.round((frameCount * 1000) / (currentTime - lastFrameTime));
                document.getElementById('frameRate').textContent = fps;
                frameCount = 0;
                lastFrameTime = currentTime;
            }
            
        } catch (error) {
            console.error('处理帧时出错:', error);
        }
        
        isProcessing = false;
        requestAnimationFrame(processFrame);
    }
    
    // 立即开始处理
    processFrame();
    
    console.log('计算机视觉手势识别已启动');
    updateCameraStatus('手势识别运行中', 'success');
}

// 手势检测函数
function detectGestures(imageData, ctx, resultCtx) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    
    // 清空结果画布
    resultCtx.clearRect(0, 0, width, height);
    
    // 运动检测
    const motionData = detectMotion(imageData);
    
    if (motionData) {
        const { centerX, centerY, intensity, area } = motionData;
        
        // 绘制运动区域
        resultCtx.fillStyle = `rgba(255, 0, 0, ${Math.min(intensity * 5, 0.5)})`;
        resultCtx.beginPath();
        resultCtx.arc(centerX, centerY, Math.sqrt(area) * 0.5, 0, 2 * Math.PI);
        resultCtx.fill();
        
        // 手势识别逻辑
        recognizeGesture(motionData);
    }
    
    // 检测手指位置（简单的手部检测）
    const fingerPositions = detectFingers(imageData);
    
    if (fingerPositions.length > 0) {
        // 绘制手指位置
        fingerPositions.forEach((pos, index) => {
            resultCtx.fillStyle = 'rgba(0, 255, 0, 0.8)';
            resultCtx.beginPath();
            resultCtx.arc(pos.x, pos.y, 10, 0, 2 * Math.PI);
            resultCtx.fill();
            
            resultCtx.fillStyle = 'white';
            resultCtx.font = '12px Arial';
            resultCtx.fillText(`手指${index + 1}`, pos.x - 15, pos.y - 15);
        });
        
        // 根据手指数量识别手势
        recognizeFingerGesture(fingerPositions);
    }
}

// 运动检测
function detectMotion(currentImageData) {
    if (!previousFrame) return null;
    
    const width = currentImageData.width;
    const height = currentImageData.height;
    const currentData = currentImageData.data;
    const previousData = previousFrame.data;
    
    let totalMotion = 0;
    let motionPixels = 0;
    let centerX = 0;
    let centerY = 0;
    
    // 简单的帧差法检测运动
    for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
            const index = (y * width + x) * 4;
            
            // 计算RGB差异
            const diffR = Math.abs(currentData[index] - previousData[index]);
            const diffG = Math.abs(currentData[index + 1] - previousData[index + 1]);
            const diffB = Math.abs(currentData[index + 2] - previousData[index + 2]);
            
            const diff = (diffR + diffG + diffB) / 3;
            
            if (diff > 30) { // 运动阈值
                totalMotion += diff;
                motionPixels++;
                centerX += x;
                centerY += y;
            }
        }
    }
    
    if (motionPixels === 0) return null;
    
    centerX /= motionPixels;
    centerY /= motionPixels;
    
    const intensity = totalMotion / (motionPixels * 255);
    const area = motionPixels;
    
    return { centerX, centerY, intensity, area };
}

// 改进的手指检测（基于肤色和运动）
function detectFingers(imageData) {
    const width = imageData.width;
    const height = imageData.height;
    const data = imageData.data;
    const fingerPositions = [];
    
    // 肤色检测（改进的RGB阈值）
    const skinRegions = [];
    
    for (let y = 0; y < height; y += 4) {
        for (let x = 0; x < width; x += 4) {
            const index = (y * width + x) * 4;
            const r = data[index];
            const g = data[index + 1];
            const b = data[index + 2];
            
            // 改进的肤色检测条件
            const isSkin = (
                r > 80 && g > 40 && b > 20 &&
                r > g && r > b &&
                Math.abs(r - g) > 10 &&
                r - b > 10 &&
                Math.max(r, g, b) - Math.min(r, g, b) > 20 && // 避免灰度区域
                r < 250 && g < 250 && b < 250 // 避免过亮区域
            );
            
            if (isSkin) {
                skinRegions.push({ x, y });
            }
        }
    }
    
    // 对皮肤区域进行聚类，找到手指尖端
    if (skinRegions.length > 0) {
        // 简单的聚类：找到Y坐标最小的点（通常是手指尖端）
        const clusters = [];
        
        skinRegions.forEach(region => {
            let addedToCluster = false;
            
            for (const cluster of clusters) {
                const lastPoint = cluster[cluster.length - 1];
                const distance = Math.sqrt(
                    Math.pow(region.x - lastPoint.x, 2) + 
                    Math.pow(region.y - lastPoint.y, 2)
                );
                
                if (distance < 30) { // 聚类半径
                    cluster.push(region);
                    addedToCluster = true;
                    break;
                }
            }
            
            if (!addedToCluster) {
                clusters.push([region]);
            }
        });
        
        // 从每个聚类中找到最上方的点（手指尖端）
        clusters.forEach(cluster => {
            if (cluster.length > 5) { // 确保有足够的点形成手指
                const tip = cluster.reduce((min, point) => 
                    point.y < min.y ? point : min
                );
                fingerPositions.push(tip);
            }
        });
    }
    
    // 更新调试信息
    document.getElementById('fingerCount').textContent = fingerPositions.length;
    
    return fingerPositions.slice(0, 5); // 最多返回5个手指位置
}

// 检查是否是局部最大值（未使用的函数，可以删除）
// function isLocalMaximum(data, x, y, width, height) {
//     const centerIndex = (y * width + x) * 4;
//     const centerValue = data[centerIndex] + data[centerIndex + 1] + data[centerIndex + 2];
//     
//     for (let dy = -2; dy <= 2; dy++) {
//         for (let dx = -2; dx <= 2; dx++) {
//             if (dx === 0 && dy === 0) continue;
//             
//             const newX = x + dx;
//             const newY = y + dy;
//             
//             if (newX >= 0 && newX < width && newY >= 0 && newY < height) {
//                 const neighborIndex = (newY * width + newX) * 4;
//                 const neighborValue = data[neighborIndex] + data[neighborIndex + 1] + data[neighborIndex + 2];
//                 
//                 if (neighborValue > centerValue) {
//                     return false;
//                 }
//             }
//         }
//     }
//     
//     return true;
// }

// 手势识别
function recognizeGesture(motionData) {
    const { intensity, area, centerX, centerY } = motionData;
    const now = Date.now();
    
    // 记录运动历史
    motionHistory.push({
        time: now,
        intensity,
        area,
        centerX,
        centerY
    });
    
    // 只保留最近2秒的数据
    motionHistory = motionHistory.filter(item => now - item.time < 2000);
    
    // 检测挥手动作（大面积高强度运动）
    if (intensity > 0.2 && area > 800 && now - lastGestureTime > 2000) {
        // 检查运动方向是否水平（挥手特征）
        if (motionHistory.length > 5) {
            const recentMotions = motionHistory.slice(-5);
            const xMovement = Math.abs(recentMotions[recentMotions.length-1].centerX - recentMotions[0].centerX);
            const yMovement = Math.abs(recentMotions[recentMotions.length-1].centerY - recentMotions[0].centerY);
            
            // 水平运动大于垂直运动（挥手特征）
            if (xMovement > yMovement * 1.5) {
                if (!activeGesture || activeGesture.type !== 'wave') {
                    activeGesture = { type: 'wave', startTime: now };
                    gestureStatus = '挥手动作';
                    lastGestureTime = now;
                    console.log('检测到挥手动作');
                    showStatusMessage('👋 检测到挥手动作，切换照片', 'success');
                    switchPhoto();
                }
            }
        }
    }
    
    // 检测放大缩小手势（面积变化）
    if (motionHistory.length > 10) {
        const recentArea = motionHistory.slice(-10).reduce((sum, item) => sum + item.area, 0) / 10;
        const olderArea = motionHistory.length > 20 ? 
            motionHistory.slice(-20, -10).reduce((sum, item) => sum + item.area, 0) / 10 : recentArea;
        
        const areaChange = (recentArea - olderArea) / olderArea;
        
        if (Math.abs(areaChange) > 0.3 && now - lastGestureTime > 1000) {
            if (areaChange > 0) {
                // 放大手势
                if (!activeGesture || activeGesture.type !== 'zoom_in') {
                    activeGesture = { type: 'zoom_in', startTime: now };
                    gestureStatus = '放大手势';
                    lastGestureTime = now;
                    console.log('检测到放大手势');
                    showStatusMessage('🔍 检测到放大手势', 'success');
                    scale = Math.min(3, scale + 0.2);
                    heartTree.style.transform = `scale(${scale})`;
                }
            } else {
                // 缩小手势
                if (!activeGesture || activeGesture.type !== 'zoom_out') {
                    activeGesture = { type: 'zoom_out', startTime: now };
                    gestureStatus = '缩小手势';
                    lastGestureTime = now;
                    console.log('检测到缩小手势');
                    showStatusMessage('🔍 检测到缩小手势', 'success');
                    scale = Math.max(0.5, scale - 0.2);
                    heartTree.style.transform = `scale(${scale})`;
                }
            }
        }
    }
    
    // 更新手势状态显示
    updateGestureStatus();
    
    // 清除过时的手势
    if (activeGesture && now - activeGesture.startTime > 1000) {
        activeGesture = null;
        gestureStatus = '等待手势';
        updateGestureStatus();
    }
}

// 更新手势状态显示
function updateGestureStatus() {
    const gestureStatusElement = document.getElementById('gestureStatus');
    if (gestureStatusElement) {
        gestureStatusElement.textContent = gestureStatus;
        
        // 根据手势状态设置颜色
        if (gestureStatus.includes('挥手')) {
            gestureStatusElement.style.color = '#FF9800';
        } else if (gestureStatus.includes('放大') || gestureStatus.includes('缩小')) {
            gestureStatusElement.style.color = '#2196F3';
        } else if (gestureStatus.includes('点击')) {
            gestureStatusElement.style.color = '#4CAF50';
        } else {
            gestureStatusElement.style.color = '#666';
        }
    }
}

// 手指手势识别
function recognizeFingerGesture(fingerPositions) {
    const fingerCount = fingerPositions.length;
    const now = Date.now();
    
    // 单指点击检测
    if (fingerCount === 1 && (!activeGesture || activeGesture.type !== 'click') && now - lastGestureTime > 1000) {
        const finger = fingerPositions[0];
        
        // 将摄像头坐标转换为屏幕坐标
        const screenX = (finger.x / video.videoWidth) * window.innerWidth;
        const screenY = (finger.y / video.videoHeight) * window.innerHeight;
        
        // 检测是否指向爱心
        const heartLeaf = getHeartAtPosition(screenX, screenY);
        if (heartLeaf) {
            activeGesture = { type: 'click', startTime: now };
            gestureStatus = '点击手势';
            lastGestureTime = now;
            console.log('检测到点击手势，指向爱心:', heartLeaf.id);
            showStatusMessage('👆 检测到点击手势，打开照片', 'success');
            
            // 添加点击视觉反馈
            addVisualFeedback('click', screenX, screenY);
            
            // 模拟点击爱心
            const photoIndex = parseInt(heartLeaf.getAttribute('data-photo-index'));
            openPhotoModal(photoIndex);
        }
    }
    
    // 双指手势检测
    if (fingerCount === 2 && now - lastGestureTime > 800) {
        const distance = getFingerDistance(fingerPositions[0], fingerPositions[1]);
        
        if (!activeGesture || (activeGesture.type !== 'pinch' && activeGesture.type !== 'spread')) {
            // 检测捏合或分开手势
            if (distance < 80) {
                activeGesture = { type: 'pinch', startTime: now, initialDistance: distance };
                gestureStatus = '捏合手势';
                lastGestureTime = now;
                console.log('检测到捏合手势');
                showStatusMessage('🤏 检测到捏合手势，缩小树', 'success');
                
                // 添加捏合视觉反馈
                const centerX = (fingerPositions[0].x + fingerPositions[1].x) / 2;
                const centerY = (fingerPositions[0].y + fingerPositions[1].y) / 2;
                const screenX = (centerX / video.videoWidth) * window.innerWidth;
                const screenY = (centerY / video.videoHeight) * window.innerHeight;
                addVisualFeedback('pinch', screenX, screenY);
                
                scale = Math.max(0.5, scale - 0.15);
                heartTree.style.transform = `scale(${scale})`;
            } else if (distance > 120) {
                activeGesture = { type: 'spread', startTime: now, initialDistance: distance };
                gestureStatus = '分开手势';
                lastGestureTime = now;
                console.log('检测到分开手势');
                showStatusMessage('✌️ 检测到分开手势，放大树', 'success');
                
                // 添加分开视觉反馈
                const centerX = (fingerPositions[0].x + fingerPositions[1].x) / 2;
                const centerY = (fingerPositions[0].y + fingerPositions[1].y) / 2;
                const screenX = (centerX / video.videoWidth) * window.innerWidth;
                const screenY = (centerY / video.videoHeight) * window.innerHeight;
                addVisualFeedback('spread', screenX, screenY);
                
                scale = Math.min(3, scale + 0.15);
                heartTree.style.transform = `scale(${scale})`;
            }
        }
    }
    
    // 更新手势状态显示
    updateGestureStatus();
}

// 获取两个手指之间的距离
function getFingerDistance(finger1, finger2) {
    const dx = finger1.x - finger2.x;
    const dy = finger1.y - finger2.y;
    return Math.sqrt(dx * dx + dy * dy);
}

// 改进的爱心点击检测
function getHeartAtPosition(x, y) {
    const heartLeaves = document.querySelectorAll('.heart-leaf');
    
    // 增加点击区域容错范围
    const tolerance = 20;
    
    for (const heart of heartLeaves) {
        const rect = heart.getBoundingClientRect();
        
        // 扩展点击区域，增加容错
        const expandedRect = {
            left: rect.left - tolerance,
            right: rect.right + tolerance,
            top: rect.top - tolerance,
            bottom: rect.bottom + tolerance
        };
        
        // 检查点击是否在扩展后的爱心范围内
        if (x >= expandedRect.left && x <= expandedRect.right && 
            y >= expandedRect.top && y <= expandedRect.bottom) {
            
            // 高亮显示被点击的爱心
            heart.style.filter = 'brightness(1.5) drop-shadow(0 0 10px #e91e63)';
            setTimeout(() => {
                heart.style.filter = '';
            }, 500);
            
            return heart;
        }
    }
    
    return null;
}

// 添加视觉反馈效果
function addVisualFeedback(type, x, y) {
    const feedback = document.createElement('div');
    feedback.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        pointer-events: none;
        z-index: 1000;
        animation: feedbackPulse 0.6s ease-out;
    `;
    
    switch(type) {
        case 'click':
            feedback.style.background = 'radial-gradient(circle, rgba(233,30,99,0.3), transparent)';
            feedback.style.border = '2px solid #e91e63';
            break;
        case 'pinch':
            feedback.style.background = 'radial-gradient(circle, rgba(33,150,243,0.3), transparent)';
            feedback.style.border = '2px solid #2196F3';
            break;
        case 'spread':
            feedback.style.background = 'radial-gradient(circle, rgba(76,175,80,0.3), transparent)';
            feedback.style.border = '2px solid #4CAF50';
            break;
    }
    
    document.body.appendChild(feedback);
    
    // 动画结束后移除元素
    setTimeout(() => {
        if (feedback.parentNode) {
            feedback.remove();
        }
    }, 600);
}

// 添加反馈动画样式
const feedbackStyle = document.createElement('style');
feedbackStyle.textContent = `
    @keyframes feedbackPulse {
        0% { 
            transform: translate(-50%, -50%) scale(0.5); 
            opacity: 0.8; 
        }
        50% { 
            transform: translate(-50%, -50%) scale(1.2); 
            opacity: 0.5; 
        }
        100% { 
            transform: translate(-50%, -50%) scale(1.5); 
            opacity: 0; 
        }
    }
`;
document.head.appendChild(feedbackStyle);

// 获取指定位置的爱心
function getHeartAtPosition(x, y) {
    const heartLeaves = document.querySelectorAll('.heart-leaf');
    
    for (const heart of heartLeaves) {
        const rect = heart.getBoundingClientRect();
        
        // 检查点击是否在爱心范围内
        if (x >= rect.left && x <= rect.right && 
            y >= rect.top && y <= rect.bottom) {
            return heart;
        }
    }
    
    return null;
}

// 切换照片
function switchPhoto() {
    currentPhotoIndex = (currentPhotoIndex + 1) % photos.length;
    
    // 更新所有爱心叶子的照片索引
    const heartLeaves = document.querySelectorAll('.heart-leaf');
    heartLeaves.forEach((leaf, index) => {
        const newIndex = (currentPhotoIndex + index) % photos.length;
        leaf.setAttribute('data-photo-index', newIndex);
    });
    
    console.log('切换到照片:', currentPhotoIndex + 1);
}

// 打开照片模态框
function openPhotoModal(photoIndex) {
    modalImage.src = photos[photoIndex];
    modalImage.alt = `美好回忆 ${photoIndex + 1}`;
    photoModal.classList.remove('hidden');
    
    // 防止背景滚动
    document.body.style.overflow = 'hidden';
}

// 关闭照片模态框
function closePhotoModal() {
    photoModal.classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// 重置爱心树
function resetTree() {
    scale = 1;
    heartTree.style.transform = `scale(${scale})`;
    initHeartTree();
}

// 事件监听器
startCameraBtn.addEventListener('click', startCamera);
stopCameraBtn.addEventListener('click', stopCamera);
resetTreeBtn.addEventListener('click', resetTree);
closeModalBtn.addEventListener('click', closePhotoModal);

// 点击模态框背景关闭
photoModal.addEventListener('click', (e) => {
    if (e.target === photoModal) {
        closePhotoModal();
    }
});

// 键盘事件支持（备用控制）
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case '+':
        case '=':
            scale = Math.min(3, scale + 0.1);
            heartTree.style.transform = `scale(${scale})`;
            break;
        case '-':
        case '_':
            scale = Math.max(0.5, scale - 0.1);
            heartTree.style.transform = `scale(${scale})`;
            break;
        case 'ArrowRight':
            switchPhoto();
            break;
        case 'Escape':
            closePhotoModal();
            break;
    }
});

// 页面加载时初始化
window.addEventListener('load', function() {
    initHeartTree();
    
    // 检查摄像头权限
    checkCameraPermission();
    
    // 添加性能优化提示
    console.log('💡 性能优化提示：');
    console.log('- 确保摄像头前光线充足');
    console.log('- 避免背景过于复杂');
    console.log('- 手势动作要清晰明确');
    
    // 添加帮助提示
    const helpTip = document.createElement('div');
    helpTip.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        background: rgba(255,255,255,0.9);
        padding: 10px 20px;
        border-radius: 20px;
        font-size: 14px;
        color: #666;
        z-index: 100;
        backdrop-filter: blur(10px);
        animation: slideUp 1s ease-out;
    `;
    helpTip.innerHTML = '💡 提示：点击"开启摄像头"按钮开始手势交互';
    document.body.appendChild(helpTip);
    
    // 5秒后自动隐藏提示
    setTimeout(() => {
        helpTip.style.animation = 'slideDown 1s ease-in';
        setTimeout(() => {
            if (helpTip.parentNode) {
                helpTip.remove();
            }
        }, 1000);
    }, 5000);
});

// 检查摄像头权限
async function checkCameraPermission() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.log('摄像头API不支持');
        showStatusMessage('❌ 浏览器不支持摄像头功能，请使用Chrome或Edge浏览器', 'error');
        return;
    }
    
    try {
        // 检查摄像头权限但不开启
        const permissions = await navigator.permissions.query({ name: 'camera' });
        
        if (permissions.state === 'granted') {
            console.log('摄像头权限已授予');
            showStatusMessage('✅ 摄像头权限已就绪，点击"开启摄像头"开始', 'success');
        } else if (permissions.state === 'prompt') {
            console.log('需要用户授权摄像头权限');
            showStatusMessage('💡 需要授权摄像头权限，点击"开启摄像头"开始', 'info');
        } else {
            console.log('摄像头权限被拒绝');
            showStatusMessage('❌ 摄像头权限被拒绝，请在浏览器设置中允许', 'error');
        }
        
    } catch (error) {
        console.log('摄像头权限检查正常，等待用户操作');
        showStatusMessage('💡 点击"开启摄像头"按钮开始手势交互', 'info');
    }
}

// 添加帮助提示动画样式
const helpStyle = document.createElement('style');
helpStyle.textContent = `
    @keyframes slideUp {
        0% { transform: translateX(-50%) translateY(100px); opacity: 0; }
        100% { transform: translateX(-50%) translateY(0); opacity: 1; }
    }
    @keyframes slideDown {
        0% { transform: translateX(-50%) translateY(0); opacity: 1; }
        100% { transform: translateX(-50%) translateY(100px); opacity: 0; }
    }
`;
document.head.appendChild(helpStyle);

// 页面卸载时关闭摄像头
window.addEventListener('beforeunload', function() {
    stopCamera();
});

console.log(`
🤖 计算机视觉手势识别系统已加载！

操作指南（使用摄像头）：
👆 单指指向爱心：点击查看照片
✌️ 双指分开：放大爱心树
🤏 双指捏合：缩小爱心树  
👋 挥手动作：切换所有照片

💻 键盘备用控制：
+/=：放大 | -：缩小
→：下一张照片 | ESC：关闭照片

💡 使用提示：
- 确保光线充足
- 手势动作要明显
- 手指要在摄像头范围内
- 挥手动作幅度要大一些

📸 当前照片数量：${photos.length}张
`);
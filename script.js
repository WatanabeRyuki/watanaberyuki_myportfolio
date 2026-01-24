// DOM要素の取得
const contactForm = document.getElementById('contactForm');
const navLinks = document.querySelectorAll('.nav-menu a');

// ページ読み込み完了時の処理
document.addEventListener('DOMContentLoaded', () => {
    initializeNavigation();
    initializeContactForm();
    initializeAnimations();
    initializeScrollEffects();
});

// ナビゲーション初期化
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// お問い合わせフォーム初期化
function initializeContactForm() {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // フォームデータの取得
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const message = formData.get('message');
        
        // バリデーション
        if (!name || !email || !message) {
            showNotification('すべての項目を入力してください。', 'error');
            return;
        }
        
        if (!isValidEmail(email)) {
            showNotification('有効なメールアドレスを入力してください。', 'error');
            return;
        }
        
        // 送信ボタンの状態を変更
        const submitBtn = contactForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 送信中...';
        submitBtn.disabled = true;
        
        try {
            // FormSubmitのAJAXエンドポイントを使用
            // この方法ならGitHub Pagesでも確実に動作します
            const formDataToSend = new FormData();
            formDataToSend.append('name', name);
            formDataToSend.append('email', email);
            formDataToSend.append('message', message);
            formDataToSend.append('_subject', `ポートフォリオサイトからのお問い合わせ: ${name}様`);
            formDataToSend.append('_captcha', 'false');
            formDataToSend.append('_template', 'box');
            formDataToSend.append('_next', window.location.href);
            
            // FormSubmitのAJAXエンドポイントを使用
            const response = await fetch('https://formsubmit.co/ajax/ryumushi@icloud.com', {
                method: 'POST',
                body: formDataToSend,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            const result = await response.json();
            
            if (response.ok && result.success) {
                showNotification('お問い合わせを送信しました。ありがとうございます！', 'success');
                contactForm.reset();
            } else {
                throw new Error(result.message || '送信に失敗しました。');
            }
            
        } catch (error) {
            console.error('送信エラー:', error);
            showNotification('送信に失敗しました。しばらく時間をおいて再度お試しください。', 'error');
        } finally {
            // ボタンの状態を元に戻す
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// メールアドレスのバリデーション
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// 通知表示機能
function showNotification(message, type = 'info') {
    // 既存の通知を削除
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // 通知要素の作成
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    // スタイルの追加
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // 通知内容のスタイル
    const notificationContent = notification.querySelector('.notification-content');
    notificationContent.style.cssText = `
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex: 1;
    `;
    
    // 閉じるボタンのスタイル
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.style.cssText = `
        background: none;
        border: none;
        color: white;
        cursor: pointer;
        padding: 0.25rem;
        border-radius: 4px;
        transition: background-color 0.3s ease;
    `;
    
    // 閉じるボタンのイベント
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
    
    // 通知をページに追加
    document.body.appendChild(notification);
    
    // 自動で閉じる（5秒後）
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// 通知タイプに応じたアイコンを取得
function getNotificationIcon(type) {
    switch (type) {
        case 'success':
            return 'fa-check-circle';
        case 'error':
            return 'fa-exclamation-circle';
        case 'warning':
            return 'fa-exclamation-triangle';
        default:
            return 'fa-info-circle';
    }
}

// 通知タイプに応じた色を取得
function getNotificationColor(type) {
    switch (type) {
        case 'success':
            return '#10b981';
        case 'error':
            return '#ef4444';
        case 'warning':
            return '#f59e0b';
        default:
            return '#3b82f6';
    }
}

// アニメーション初期化
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.project-card, .stat, .skill-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// スクロール効果初期化
function initializeScrollEffects() {
    // ヘッダーの背景変更（スクロール時）
    window.addEventListener('scroll', () => {
        const header = document.querySelector('.header');
        if (window.scrollY > 100) {
            header.style.background = 'rgba(26, 26, 26, 0.98)';
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.3)';
        } else {
            header.style.background = 'rgba(26, 26, 26, 0.95)';
            header.style.boxShadow = 'none';
        }
    });

    // スキルバーのアニメーション
    const skillsSection = document.querySelector('#skills');
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateSkillBars();
                skillsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }
}

// スキルバーのアニメーション
function animateSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    skillBars.forEach(bar => {
        const width = bar.style.width;
        bar.style.width = '0%';
        
        setTimeout(() => {
            bar.style.width = width;
        }, 500);
    });
}

// CSS アニメーションの追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-close:hover {
        background-color: rgba(255, 255, 255, 0.2) !important;
    }
`;
document.head.appendChild(style);

// パララックス動画背景の動き
window.addEventListener('scroll', () => {
    const video = document.querySelector('.parallax-video');
    const svg = document.querySelector('.parallax-shape');
    if (video) {
        const scrollY = window.scrollY;
        video.style.transform = `translateY(${scrollY * 0.3}px)`;
    }
    if (svg) {
        const scrollY = window.scrollY;
        svg.style.transform = `translateY(${scrollY * 0.15}px)`;
    }
});

// プロジェクト詳細ページ遷移時のフェードアウト
const projectLinks = document.querySelectorAll('.project-link');
projectLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '0';
        setTimeout(() => {
            window.location.href = link.getAttribute('href');
        }, 500);
    });
});

// ページ読み込み時のフェードイン
window.addEventListener('pageshow', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.7s';
        document.body.style.opacity = '1';
    }, 50);
}); 
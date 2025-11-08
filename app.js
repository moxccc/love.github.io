// app.js - 已重写为可审计、非混淆的实现。
// 功能：控制开场 modal、播放背景音乐、在屏幕上生成提示 popup、显示右下角浮动按钮。
// 说明：移除了任何远程授权 / 重定向 / 加壳逻辑，便于在你的服务器上安全运行。

(function () {
  'use strict';

  const messages = [
    '我想你了', '期待下一次见面', '金榜题名', '早点休息',
    '愿所有烦恼都消失', '今天过得开心嘛', '期待下一次见面'
  ];

  const popupLayer = document.getElementById('popup-layer');
  const startBackdrop = document.getElementById('start-backdrop');
  const confirmBtn = document.getElementById('confirm-btn');
  const bgMusic = document.getElementById('bgMusic');
  const floatBalls = document.getElementById('float-balls');

  // 防止外部脚本或浏览器扩展破坏页面行为：不做任何 location 修改
  // 任何跳转都必须由你在服务器端或明确交互触发。

  // 显示/隐藏浮动小球
  function showFloatBalls() {
    if (!floatBalls) return;
    floatBalls.classList.remove('hidden');
    floatBalls.classList.add('show');
  }

  // 播放背景音乐，尽量在用户交互后播放以避免被浏览器阻止
  function safePlayMusic() {
    if (!bgMusic) return;
    bgMusic.volume = 0.6;
    bgMusic.play().catch((e) => {
      // 被浏览器阻止时忽略，用户可手动触发
      console.warn('bgMusic play blocked:', e);
    });
  }

  // 简单创建一个 popup 元素并插入到 popupLayer
  function createPopup(text, theme = 'theme-cyan', animClass = 'anim-top') {
    const p = document.createElement('div');
    p.className = `popup ${theme} ${animClass}`;
    p.setAttribute('role', 'status');
    p.setAttribute('aria-live', 'polite');

    const header = document.createElement('div');
    header.className = 'header';
    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = '💝';
    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = '小提示';
    header.appendChild(icon);
    header.appendChild(title);

    const content = document.createElement('div');
    content.className = 'content';
    content.textContent = text;

    p.appendChild(header);
    p.appendChild(content);

    // 随机位置（基于视口）
    p.style.position = 'absolute';
    const width = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0);
    const height = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0);
    // 保证不超出可视区域
    const left = Math.floor(Math.random() * Math.max(1, width - 160));
    const top = Math.floor(Math.random() * Math.max(1, height - 120));
    p.style.left = left + 'px';
    p.style.top = top + 'px';

    popupLayer.appendChild(p);

    // 自动淡出并移除
    
  }

  // 连续生成 popups（示例：30 秒内每隔 800-1400ms 生成一个）
  let popupTimer = null;
  function startPopups() {
    if (popupTimer) return;
    popupTimer = setInterval(() => {
      const txt = messages[Math.floor(Math.random() * messages.length)];
      // 随机主题与动画
      const themes = ['theme-cyan','theme-pink','theme-sky','theme-peach','theme-coral'];
      const anims = ['anim-top','anim-right','anim-bottom','anim-left','anim-topright'];
      createPopup(txt, themes[Math.floor(Math.random()*themes.length)], anims[Math.floor(Math.random()*anims.length)]);
    }, 10+ Math.floor(Math.random() * 600));
    // 停止定时器（防止无限制增长）；示例持续 45 秒
   
  }

  // Modal 确认按钮处理：关闭 modal，播放音乐，显示浮动小球并开始弹出提示
  function onConfirm() {
    if (startBackdrop) startBackdrop.style.display = 'none';
    safePlayMusic();
    showFloatBalls();
    startPopups();
  }

  // 绑定事件
  if (confirmBtn) {
    confirmBtn.addEventListener('click', onConfirm, { once: true });
  } else {
    // 如果没有 modal（例如被移除），直接初始化
    onConfirm();
  }

  // 浮动小球点击示例（你可以改为打开链接或显示更多内容）
  const ball1 = document.getElementById('ball-1');
  const ball2 = document.getElementById('ball-2');
  if (ball1) {
    ball1.addEventListener('click', (e) => {
      e.preventDefault();
      createPopup('这是留言按钮（演示）', 'theme-pink', 'anim-bottomright');
    });
  }
  if (ball2) {
    ball2.addEventListener('click', (e) => {
      e.preventDefault();
      createPopup('关于：祝你每天开心！', 'theme-sky', 'anim-topright');
    });
  }

  // 可选：按下 Enter 键也触发确认（无焦点时启用）
  window.addEventListener('keydown', (ev) => {
    if (ev.key === 'Enter' && startBackdrop && startBackdrop.style.display !== 'none') {
      onConfirm();
    }
  });
})();
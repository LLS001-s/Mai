/* =========================================================================
   app.js  —  逻辑文件（不需要修改）
   所有可以改的内容都在 config.js 里。
   ========================================================================= */
(function () {
  "use strict";

  var CFG = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 小工具 ---------- */
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  // 图片不存在时优雅降级为占位框，而不是裂图
  function safeImage(src, alt, onOk) {
    if (!src) return false;
    var img = new Image();
    img.onload = function () { if (onOk) onOk(img); };
    img.onerror = function () { /* 静默失败，由调用方显示占位 */ };
    img.src = src;
    img.alt = alt || "";
    return true;
  }

  /* =======================================================================
     1. 预加载
     ======================================================================= */
  function hidePreloader() {
    var p = $("#preloader");
    if (!p) return;
    setTimeout(function () { p.classList.add("is-done"); }, 350);
  }
  window.addEventListener("load", hidePreloader);
  setTimeout(hidePreloader, 2600); // 兜底，避免一直卡在加载页

  /* =======================================================================
     2. 背景层（视频 / 图片）
     ======================================================================= */
  function setupBackground() {
    var bg = CFG.background || {};
    var layer = $("#bgLayer");
    var video = $("#bgVideo");
    var image = $("#bgImage");

    if (layer && bg.overlay != null) layer.style.setProperty("--bg-overlay", bg.overlay);
    if (layer && bg.blur > 0) layer.classList.add("is-blurred");

    // 静图
    var picSrc = bg.image || bg.poster;
    if (picSrc) {
      image.onload = function () { image.classList.add("is-ready"); };
      image.onerror = function () { image.removeAttribute("src"); };
      image.src = picSrc;
    }

    // 视频
    if (bg.video) {
      video.oncanplay = function () {
        video.classList.add("is-ready");
        if (image.classList.contains("is-ready")) image.classList.remove("is-ready");
        video.play().catch(function () {});
      };
      video.onerror = function () { video.remove(); };   // 失败就靠图片/渐变顶着
      video.src = bg.video;
      video.play().catch(function () {});
    }
    window.__bgVideo = video;
    window.__bgImage = image;
  }

  /* =======================================================================
     3. 漂浮粒子（爱心光点）
     ======================================================================= */
  function setupParticles() {
    if (reduced) return;
    var cv = $("#particles");
    if (!cv) return;
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var parts = [];
    var W, H;

    function resize() {
      W = cv.width = Math.floor(window.innerWidth * dpr);
      H = cv.height = Math.floor(window.innerHeight * dpr);
      cv.style.width = window.innerWidth + "px";
      cv.style.height = window.innerHeight + "px";
      var count = Math.min(30, Math.max(10, Math.round(window.innerWidth / 46)));
      parts = [];
      for (var i = 0; i < count; i++) parts.push(spawn(true));
    }
    function spawn(anywhere) {
      return {
        x: Math.random() * W,
        y: anywhere ? Math.random() * H : H + 40 * dpr,
        r: (3 + Math.random() * 7) * dpr,
        vy: (0.18 + Math.random() * 0.45) * dpr,
        vx: (Math.random() - 0.5) * 0.25 * dpr,
        a: 0.10 + Math.random() * 0.30,
        hue: 330 + Math.random() * 50,
        pulse: Math.random() * Math.PI * 2
      };
    }
    function heart(c, x, y, r, rot) {
      c.save(); c.translate(x, y); c.rotate(rot); c.scale(r / 16, r / 16);
      c.beginPath();
      c.moveTo(0, 8);
      c.bezierCurveTo(-14, -3, -9, -14, 0, -7);
      c.bezierCurveTo(9, -14, 14, -3, 0, 8);
      c.closePath(); c.fill(); c.restore();
    }
    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        p.y -= p.vy; p.x += p.vx; p.pulse += 0.02;
        if (p.y < -30 * dpr) parts[i] = spawn(false);
        var alpha = p.a * (0.6 + 0.4 * Math.sin(p.pulse));
        ctx.fillStyle = "hsla(" + p.hue + ",100%,78%," + alpha + ")";
        heart(ctx, p.x, p.y, p.r, Math.sin(p.pulse) * 0.25);
      }
      requestAnimationFrame(frame);
    }
    resize();
    window.addEventListener("resize", resize);
    requestAnimationFrame(frame);
    document.addEventListener("visibilitychange", function () {
      if (!document.hidden) requestAnimationFrame(frame);
    });
  }

  /* =======================================================================
     4. 内容渲染（全部来自 config.js）
     ======================================================================= */
  function setText(sel, val) { var n = $(sel); if (n && val != null) n.textContent = val; }

  function renderStatic() {
    var s = CFG.site || {};
    if (s.title) document.title = s.title;
    setText("#loginTitle", s.title);
    setText("#loginFooterName", s.openedBy);
    setText("#loginOverline", (CFG.letter && CFG.letter.kicker) || "A LITTLE GIFT");

    var intro = CFG.intro || {};
    setText("#introOverline", intro.overline);
    setText("#introAfter", intro.after);

    var st = CFG.story || {};
    setText("#storyKicker", st.kicker);
    setText("#storyTitle", st.title);

    var g = CFG.gallery || {};
    setText("#galleryKicker", g.kicker);
    setText("#galleryTitle", g.title);

    var e = CFG.ending || {};
    setText("#endingTitle", e.title);
    setText("#endingText", e.text);
    setText("#wishBtn", e.buttonText);
    setText("#endingFoot", e.foot);
    setText("#endingSecret", e.secret);

    setText("#loginHint", CFG.passwordHint || "");
    setText("#musicLabel", (CFG.music && CFG.music.title) || "音乐");
  }

  /* --- 数字统计 --- */
  function renderCounter() {
    var s = CFG.site || {};
    var start = s.startDate ? new Date(s.startDate) : null;
    var days = start ? Math.max(0, Math.ceil((Date.now() - start.getTime()) / 86400000)) : 0;

    if (start) {
      var lab = $("#statDaysLabel");
      if (lab) lab.textContent = "kể từ ngày chúng ta gặp nhau";
    } else {
      $("#statDaysWrap") && $("#statDaysWrap").remove();
    }
    animateNumber($("#statDays"), days);

    // 距离 & 时差（需要 people 配置）
    var p = CFG.people;
    if (p && p.me && p.you && p.me.lat != null && p.you.lat != null) {
      var km = haversine(p.me.lat, p.me.lng, p.you.lat, p.you.lng);
      animateNumber($("#statDistance"), km);
      var tz = Math.abs(p.me.lng / 15 - p.you.lng / 15);
      var tzWrap = $("#statCountryWrap");
      if (tzWrap && tz >= 0.4) {
        var num = $("#statCountry");
        num.classList.add("stat__num--text");
        num.textContent = tz.toFixed(tz % 1 === 0 ? 0 : 1).replace(/\.0$/, "");
        tzWrap.querySelector(".stat__label").textContent = "chênh lệch múi giờ (giờ)";
      } else if (tzWrap) {
        tzWrap.remove();
      }
      var from = p.me.city, to = p.you.city;
      if (from && to) {
        var note = $("#counterNote");
        if (note) note.textContent = "Từ" + from + "  đến  " + to + "，cách nhau " +
          km.toLocaleString("en-US") + " km. Khoảng cách chưa bao giờ là vấn đề, vì em luôn ở đây.";
      }
    } else {
      var dw = $("#statDistanceWrap"); if (dw) dw.remove();
      var cw = $("#statCountryWrap"); if (cw) cw.remove();
    }
  }
  function haversine(a1, o1, a2, o2) {
    var R = 6371, rad = Math.PI / 180;
    var dA = (a2 - a1) * rad, dO = (o2 - o1) * rad;
    var h = Math.sin(dA / 2) * Math.sin(dA / 2) +
            Math.cos(a1 * rad) * Math.cos(a2 * rad) * Math.sin(dO / 2) * Math.sin(dO / 2);
    return Math.round(2 * R * Math.asin(Math.sqrt(h)));
  }
  function animateNumber(node, target, opts) {
    if (!node) return;
    if (reduced) { node.textContent = target.toLocaleString("en-US"); return; }
    var dur = 1500, t0 = null;
    function step(t) {
      if (!t0) t0 = t;
      var k = Math.min(1, (t - t0) / dur);
      var eased = 1 - Math.pow(1 - k, 3);
      node.textContent = Math.round(target * eased).toLocaleString("en-US");
      if (k < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* --- 时间轴故事 --- */
  function renderStory() {
    var list = CFG.chapters || [];
    var tl = $("#timeline");
    if (!tl || !list.length) return;
    var fill = el("div", "timeline__fill");
    tl.appendChild(fill);

    list.forEach(function (c, i) {
      var art = el("article", "chapter reveal");
      art.dataset.align = (c.align || (i % 2 === 0 ? "left" : "right")).toLowerCase();

      // 圆点
      art.appendChild(el("span", "chapter__dot"));

      // 媒体
      var media = el("div", "chapter__media");
      var frame = el("div", "media-frame");
      if (c.video) {
        var v = document.createElement("video");
        v.muted = true; v.loop = true; v.playsInline = true; v.preload = "metadata";
        v.src = c.video;
        v.addEventListener("loadeddata", function () { v.play().catch(function () {}); });
        v.addEventListener("error", function () {
          v.remove(); placeholder(frame, "Đặt video vào assets/video/");
        });
        frame.appendChild(v);
      } else if (c.image) {
        var im = document.createElement("img");
        im.alt = c.caption || c.title || "";
        im.loading = "lazy";
        im.onerror = function () {
          im.remove(); placeholder(frame, "Đặt ảnh vào assets/images/");
        };
        im.src = c.image;
        frame.appendChild(im);
      } else {
        placeholder(frame, "Chương này chưa có ảnh");
      }
      media.appendChild(frame);
      if (c.caption) media.appendChild(el("p", "chapter__caption", c.caption));
      art.appendChild(media);

      // 文字
      var body = el("div", "chapter__body");
      if (c.date) body.appendChild(el("span", "chapter__date", c.date));
      body.appendChild(el("h3", "chapter__title", c.title || ""));
      body.appendChild(el("p", "chapter__text", c.text || ""));
      art.appendChild(body);

      tl.appendChild(art);
    });
  }
  function placeholder(frame, msg) {
    var ph = el("div", "media-frame__ph");
    ph.innerHTML = '<svg viewBox="0 0 24 24"><rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="9" cy="10" r="1.6"/><path d="M21 16l-5.5-5.5L6 20"/></svg>';
    ph.appendChild(el("span", null, msg));
    frame.appendChild(ph);
  }

  /* --- 相册 --- */
  function renderGallery() {
    var g = CFG.gallery || {};
    var photos = g.photos || [];
    var sec = $("#gallerySection");
    var grid = $("#galleryGrid");
    if (!grid) return;
    if (!photos.length) { sec.hidden = true; return; }
    sec.hidden = false;

    photos.forEach(function (ph, i) {
      var fig = el("figure", "gallery__item reveal");
      var im = document.createElement("img");
      im.alt = ph.caption || ("photo " + (i + 1));
      im.loading = "lazy";
      im.onerror = function () { im.remove(); fig.classList.add("is-placeholder"); };
      im.src = ph.src;
      fig.appendChild(im);
      if (ph.caption) fig.appendChild(el("figcaption", null, ph.caption));
      fig.addEventListener("click", function () {
        if (!im.src) return;
        openLightbox(ph.src, ph.caption || "");
      });
      grid.appendChild(fig);
    });
  }

  /* --- 信 --- */
  function renderLetter() {
    var L = CFG.letter || {};
    var sec = $("#letterSection");
    if (!sec) return;
    var paras = L.body || [];
    if (!paras.length && !L.hello) { sec.hidden = true; return; }
    sec.hidden = false;
    setText("#letterHello", L.hello);
    setText("#letterSign", L.sign);
    var body = $("#letterBody");
    body.innerHTML = "";
    paras.forEach(function (t) { body.appendChild(el("p", null, t)); });
  }

  /* --- 蜡烛 --- */
  function renderCandles() {
    var box = $("#candles");
    if (!box) return;
    for (var i = 0; i < 4; i++) box.appendChild(el("span", "candle"));
  }

  /* =======================================================================
     5. 滚动效果：进度条 / 时间轴填充 / 出现动画
     ======================================================================= */
  function setupScroll() {
    var bar = $("#progressBar");
    var prog = $(".progress");
    var fillEl = $(".timeline__fill");
    var tl = $("#timeline");

    function onScroll() {
      var doc = document.documentElement;
      var max = doc.scrollHeight - window.innerHeight;
      var ratio = max > 0 ? window.scrollY / max : 0;
      if (bar) bar.style.width = (ratio * 100).toFixed(2) + "%";
      if (prog) prog.classList.toggle("is-on", ratio > 0.01);

      if (fillEl && tl) {
        var rect = tl.getBoundingClientRect();
        var center = window.innerHeight * 0.5;
        var passed = center - rect.top;
        var h = Math.max(0, Math.min(rect.height, passed));
        fillEl.style.height = h + "px";
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  function setupReveal() {
    var items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || reduced) {
      items.forEach(function (n) { n.classList.add("is-visible"); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-visible");
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    items.forEach(function (n) { io.observe(n); });
  }

  /* =======================================================================
     6. 打字机
     ======================================================================= */
  function typewriter(node, lines) {
    if (!node) return Promise.resolve();
    var caret = el("span", "caret");
    node.textContent = ""; node.appendChild(caret);
    if (reduced) {
      node.textContent = lines.join("\n");
      return Promise.resolve();
    }
    return (async function () {
      for (var i = 0; i < lines.length; i++) {
        var line = lines[i];
        for (var j = 0; j < line.length; j++) {
          caret.insertAdjacentText("beforebegin", line[j]);
          await sleep(line[j] === "，" || line[j] === "。" || line[j] === "、" ? 190 : 62);
        }
        if (i < lines.length - 1) {
          caret.insertAdjacentText("beforebegin", "\n");
          await sleep(230);
        }
      }
      await sleep(500);
      caret.remove();
    })();
  }

  /* =======================================================================
     7. 登录
     ======================================================================= */
  function setupLogin() {
    var screenNode = $("#loginScreen");
    var form = $("#loginForm");
    var input = $("#passwordInput");
    var err = $("#loginError");
    var field = input ? input.closest(".login__field") : null;
    var hintBtn = $("#hintBtn");
    var hint = $("#loginHint");
    var eye = $("#togglePassword");
    var tries = 0;
    var expect = (CFG.password == null ? "" : String(CFG.password));

    // 不需要密码
    if (!expect) { startExperience(); return; }

    if (eye) eye.addEventListener("click", function () {
      var show = input.type === "password";
      input.type = show ? "text" : "password";
      eye.classList.toggle("is-shown", show);
    });

    if (hintBtn && hint) hintBtn.addEventListener("click", function () {
      hint.hidden = !hint.hidden;
    });

    if (form) form.addEventListener("submit", function (ev) {
      ev.preventDefault();
      var val = input.value.trim();
      if (val === expect) {
        err.classList.remove("is-on");
        if (hintBtn) hintBtn.style.display = "none";
        startExperience();
      } else {
        tries++;
        showError("Không đúng rồi, nghĩ thêm chút nữa nhé.");
        field.classList.add("is-error");
        var card = $(".login__card");
        card.classList.remove("shake");
        void card.offsetWidth;
        card.classList.add("shake");
        input.value = "";
        input.focus();
        if (CFG.maxAttempts > 0 && tries >= CFG.maxAttempts && hint) {
          hint.hidden = false;
          showError("Vẫn chưa đúng. Đây là một gợi ý nhỏ ↓");
        }
      }
      function showError(msg) { err.textContent = msg; err.classList.add("is-on"); }
    });

    if (input) input.addEventListener("input", function () {
      field.classList.remove("is-error");
      err.classList.remove("is-on");
    });

    function startExperience() {
      if (hintBtn) hintBtn.style.display = "none";
      document.body.classList.remove("is-locked");

      var bgv = window.__bgVideo;
      if (bgv) bgv.play().catch(function () {});      // 用户点击=合法手势，视频/音乐可播

      startMusic();

      screenNode.classList.add("is-leaving");
      setTimeout(function () {
        screenNode.setAttribute("hidden", "");
        var exp = $("#experience");
        exp.hidden = false;
        setupReveal();
        runIntro();
        window.scrollTo(0, 0);
        setupScrollAfterLogin();
      }, 850);
    }
  }

  /* 登录后：进度条 + 音乐按钮出现 */
  function setupScrollAfterLogin() {
    var mt = $("#musicToggle");
    if (mt) mt.classList.add("is-on");
    var prog = $(".progress");
    if (prog) prog.classList.add("is-on");
    window.dispatchEvent(new Event("scroll"));   // 刷新时间轴/进度条
  }

  /* =======================================================================
     8. 开篇打字
     ======================================================================= */
  function runIntro() {
    var intro = CFG.intro || {};
    var lines = intro.lines || [];
    var overline = $("#introOverline");
    var after = $("#introAfter");
    var cue = $("#scrollCue");

    if (overline) overline.classList.add("is-on");
    typewriter($("#introType"), lines).then(function () {
      if (after && intro.after) after.classList.add("is-on");
      if (cue) cue.classList.add("is-on");
    });
  }

  /* =======================================================================
     9. 背景音乐
     ======================================================================= */
  /* =======================================================================
   9. 背景音乐
   ======================================================================= */
  var audio, playlist = [], trackIndex = 0;
  function startMusic() {
    var m = CFG.music || {};
    audio = $("#bgAudio");
    playlist = m.srcs || (m.src ? [m.src] : []);
    if (!audio || !playlist.length) { var b = $("#musicToggle"); if (b) b.remove(); return; }

    audio.volume = m.volume == null ? 0.45 : m.volume;
    audio.loop = (playlist.length === 1) && (m.loop !== false);

    trackIndex = 0;
    audio.src = playlist[0];
    if (m.startAt) audio.currentTime = m.startAt;

    audio.addEventListener("ended", function () {
      if (playlist.length <= 1) return;
      trackIndex = (trackIndex + 1) % playlist.length;
      audio.src = playlist[trackIndex];
      audio.play().catch(function () { setMuted(true); });
    });

    var btn = $("#musicToggle");
    var trying = audio.play();
    if (trying && trying.catch) trying.catch(function () { setMuted(true); });
    setMuted(audio.paused);
    if (btn) btn.addEventListener("click", function () {
      if (audio.paused) { audio.play().catch(function () {}); setMuted(false); }
      else { audio.pause(); setMuted(true); }
    });
  }
  function setMuted(muted) {
    var btn = $("#musicToggle");
    if (btn) btn.classList.toggle("is-muted", muted);
  }

  /* =======================================================================
     10. 结尾：吹蜡烛 + 彩带
     ======================================================================= */
  function setupEnding() {
    var btn = $("#wishBtn");
    var ending = $("#endingSection");
    var secret = $("#endingSecret");
    if (!btn) return;
    btn.addEventListener("click", function () {
      if (ending) ending.classList.add("is-blown");
      if (secret) secret.hidden = false;
      confettiBurst();
      btn.textContent = "再吹一次";
      btn.dataset.done = "1";
    });
  }

  function confettiBurst() {
    if (reduced) return;
    var cv = $("#confetti");
    cv.classList.add("is-on");
    var ctx = cv.getContext("2d");
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = cv.width = Math.floor(window.innerWidth * dpr);
    var H = cv.height = Math.floor(window.innerHeight * dpr);
    cv.style.width = window.innerWidth + "px";
    cv.style.height = window.innerHeight + "px";

    var colors = ["#ff8fab", "#ffd6a5", "#b892ff", "#f7c873", "#ff6b8a", "#fff0f5"];
    var bits = [];
    for (var i = 0; i < 160; i++) {
      bits.push({
        x: Math.random() * W,
        y: -Math.random() * H * 0.6,
        w: (5 + Math.random() * 7) * dpr,
        h: (8 + Math.random() * 10) * dpr,
        vy: (1.6 + Math.random() * 3.2) * dpr,
        vx: (Math.random() - 0.5) * 2.2 * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.22,
        c: colors[(Math.random() * colors.length) | 0],
        life: 1
      });
    }
    var t0 = null;
    function frame(t) {
      if (!t0) t0 = t;
      var elapsed = (t - t0) / 1000;
      ctx.clearRect(0, 0, W, H);
      for (var i = 0; i < bits.length; i++) {
        var b = bits[i];
        b.x += b.vx; b.y += b.vy; b.rot += b.vr;
        b.vy += 0.012 * dpr;
        b.vx *= 0.995;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.globalAlpha = Math.max(0, 1 - elapsed / 6);
        ctx.fillStyle = b.c;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      }
      if (elapsed < 6) requestAnimationFrame(frame);
      else { cv.classList.remove("is-on"); ctx.clearRect(0, 0, W, H); }
    }
    requestAnimationFrame(frame);
  }

  /* =======================================================================
     11. 大图查看
     ======================================================================= */
  function openLightbox(src, caption) {
    var lb = $("#lightbox"), im = $("#lightboxImg"), cap = $("#lightboxCaption");
    im.src = src; cap.textContent = caption || "";
    lb.hidden = false;
    document.body.classList.add("is-locked");
  }
  function closeLightbox() {
    var lb = $("#lightbox");
    if (!lb || lb.hidden) return;
    lb.hidden = true;
    $("#lightboxImg").removeAttribute("src");
    document.body.classList.remove("is-locked");
  }
  function setupLightbox() {
    var close = $("#lightboxClose"), lb = $("#lightbox");
    if (close) close.addEventListener("click", closeLightbox);
    if (lb) lb.addEventListener("click", function (e) { if (e.target === lb) closeLightbox(); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeLightbox(); });
  }

  /* =======================================================================
     12. 初始化
     ======================================================================= */
  function init() {
    document.body.classList.add("is-locked");   // 先锁滚动，登录页居中
    renderStatic();
    renderCandles();
    renderStory();
    renderGallery();
    renderLetter();
    renderCounter();
    setupBackground();
    setupParticles();
    setupScroll();
    setupLightbox();
    setupEnding();
    setupLogin();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();

/* ============================================
   槐安村事件 ARG — 核心交互脚本
   ============================================ */

// ===== 全局：页面淡入 =====
document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('fade-in');
});

// ===== 密码保护页：journal.html =====
function checkJournalPassword() {
    var input = document.getElementById('journal-password');
    var msg = document.getElementById('journal-message');
    var locked = document.querySelectorAll('.journal-entry.locked');
    var unlockArea = document.getElementById('journal-unlocked');

    // 密码来自 projects.html 的项目编号 HAC-1987-0815 → 19870815
    var password = input.value.trim();

    if (password === '19870815') {
        locked.forEach(function(el) {
            el.classList.remove('locked');
        });
        msg.style.color = 'var(--color-gold)';
        msg.textContent = '密码正确。以下为完整日志记录。';
        if (unlockArea) unlockArea.style.display = 'block';
        input.disabled = true;
    } else {
        msg.textContent = '密码错误。请重试。';
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
    }
}

// ===== 摩斯码解码：archive.html =====
var MORSE_TABLE = {
    '.-': 'A', '-...': 'B', '-.-.': 'C', '-..': 'D', '.': 'E',
    '..-.': 'F', '--.': 'G', '....': 'H', '..': 'I', '.---': 'J',
    '-.-': 'K', '.-..': 'L', '--': 'M', '-.': 'N', '---': 'O',
    '.--.': 'P', '--.-': 'Q', '.-.': 'R', '...': 'S', '-': 'T',
    '..-': 'U', '...-': 'V', '.--': 'W', '-..-': 'X', '-.--': 'Y',
    '--..': 'Z'
};

function decodeMorse(morseStr) {
    var words = morseStr.trim().split(' / ');
    var result = [];
    for (var i = 0; i < words.length; i++) {
        var letters = words[i].split(' ');
        var word = '';
        for (var j = 0; j < letters.length; j++) {
            var letter = letters[j].trim();
            if (letter && MORSE_TABLE[letter]) {
                word += MORSE_TABLE[letter];
            }
        }
        result.push(word);
    }
    return result.join(' ');
}

function revealArchiveSecret() {
    // 摩斯码以"旧式分类标记"形式显示在照片下方
    // L=.--.. E=. T=- T=- E=. R=.-. S=...  → "LETTERS"
    var morseMarks = document.querySelectorAll('.card .font-mono, .card [style*="font-mono"]');
    var morseParts = [];

    // 兜底：直接扫描照片卡片中的摩斯符号 div
    var cards = document.querySelectorAll('.card');
    cards.forEach(function(card) {
        var divs = card.querySelectorAll('div');
        divs.forEach(function(div) {
            var t = div.textContent.trim();
            if (/^[.\- ]+$/.test(t) && t.length > 0 && t.length < 8) {
                morseParts.push(t);
            }
        });
    });

    var morseStr = morseParts.join(' ');
    var decoded = decodeMorse(morseStr);

    var output = document.getElementById('archive-decoded');
    if (output) {
        output.textContent = '解码结果: ' + decoded + '（提示：英文单词，指向某类档案）';
        output.style.opacity = '1';
    }

    var hidden = document.getElementById('archive-hidden-link');
    if (hidden) {
        hidden.style.opacity = '1';
        hidden.style.pointerEvents = 'auto';
    }
}

// ===== 凯撒密码：letters.html =====
function caesarShift(text, shift) {
    var result = '';
    for (var i = 0; i < text.length; i++) {
        var c = text.charCodeAt(i);
        if (c >= 65 && c <= 90) {
            result += String.fromCharCode((c - 65 + shift + 26) % 26 + 65);
        } else if (c >= 97 && c <= 122) {
            result += String.fromCharCode((c - 97 + shift + 26) % 26 + 97);
        } else {
            result += text[i];
        }
    }
    return result;
}

function decodeLetterCipher() {
    var cipherText = document.getElementById('cipher-text');
    if (!cipherText) return;

    var raw = cipherText.textContent.trim();
    // 凯撒密码，位移 7（正向解密 = 位移 -7）
    var decoded = caesarShift(raw, -7);

    var output = document.getElementById('cipher-decoded');
    if (output) {
        output.textContent = decoded;
        output.style.opacity = '1';
    }

    var hidden = document.getElementById('letter-hidden-link');
    if (hidden) {
        hidden.style.opacity = '1';
        hidden.style.pointerEvents = 'auto';
        hidden.style.fontSize = '0.9rem';
    }
}

// ===== 地图交互：map.html =====
function initMap() {
    var points = document.querySelectorAll('.map-point');
    var tooltip = document.getElementById('map-tooltip');
    if (!tooltip) return;

    // 三个标记点对应字符：禁、封、渡
    var chars = ['禁', '封', '渡'];
    var combined = '';

    points.forEach(function(point, idx) {
        point.addEventListener('mouseenter', function(e) {
            var char = point.getAttribute('data-char') || chars[idx];
            var rect = point.getBoundingClientRect();
            var mapRect = document.querySelector('.map-canvas').getBoundingClientRect();

            tooltip.textContent = char;
            tooltip.style.left = (rect.left - mapRect.left + rect.width / 2 - 15) + 'px';
            tooltip.style.top = (rect.top - mapRect.top - 35) + 'px';
            tooltip.classList.add('visible');
        });

        point.addEventListener('mouseleave', function() {
            tooltip.classList.remove('visible');
        });

        point.addEventListener('click', function() {
            var char = point.getAttribute('data-char') || chars[idx];
            if (combined.indexOf(char) === -1) {
                combined += char;
            }
            var display = document.getElementById('map-sequence');
            if (display) {
                if (combined.length >= 3) {
                    // 集齐三个字后，按禁卷记载的"封印之名"固定顺序显示
                    display.textContent = '禁 封 渡';
                } else {
                    display.textContent = combined;
                }
            }

            if (combined.length >= 3) {
                var link = document.getElementById('map-cipher-link');
                if (link) {
                    link.style.opacity = '1';
                    link.style.pointerEvents = 'auto';
                }
            }
        });
    });
}

// ===== 密码破译页：cipher.html =====
function checkCipherPassword() {
    var input = document.getElementById('cipher-input');
    var msg = document.getElementById('cipher-message');
    var unlocked = document.getElementById('cipher-unlocked');

    // 密码来自 map.html 三个标记点：禁封渡
    var password = input.value.trim().replace(/\s+/g, '');

    if (password === '禁封渡') {
        msg.style.color = 'var(--color-gold)';
        msg.textContent = '封印解除...';
        if (unlocked) unlocked.style.display = 'block';
        input.disabled = true;

        // 逐字显示解锁内容
        if (unlocked) {
            var text = unlocked.querySelector('.unlocked-text');
            if (text) typewriterEffect(text);
        }
    } else {
        msg.textContent = '符文不匹配。';
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
    }
}

// ===== 仪式交互：ritual.html =====
var ritualSequence = [];
var ritualCorrect = ['香烛', '引魂幡', '纸船', '河灯', '纸钱'];

function initRitual() {
    var items = document.querySelectorAll('.ritual-item');
    var message = document.getElementById('ritual-message');
    var dots = document.querySelectorAll('.sequence-dot');

    items.forEach(function(item) {
        item.addEventListener('click', function() {
            var name = item.getAttribute('data-name');
            var idx = parseInt(item.getAttribute('data-idx'));

            if (item.classList.contains('lit')) return;

            item.classList.add('lit');
            ritualSequence.push(name);

            var seqIdx = ritualSequence.length - 1;
            if (dots[seqIdx]) {
                dots[seqIdx].classList.add('active');
            }

            if (name === ritualCorrect[ritualSequence.length - 1]) {
                message.textContent = '正确...';
                message.style.color = 'var(--color-gold-dim)';

                if (ritualSequence.length === 5) {
                    message.textContent = '仪式完成。封印已开...';
                    message.style.color = 'var(--color-blood-bright)';
                    setTimeout(function() {
                        var link = document.getElementById('ritual-next');
                        if (link) {
                            link.style.opacity = '1';
                            link.style.pointerEvents = 'auto';
                        }
                    }, 1500);
                }
            } else {
                message.textContent = '顺序错误。仪式失败。';
                message.style.color = 'var(--color-blood-bright)';

                setTimeout(function() {
                    ritualSequence = [];
                    items.forEach(function(el) { el.classList.remove('lit'); });
                    dots.forEach(function(dot) { dot.classList.remove('active'); });
                    message.textContent = '重新开始仪式...';
                    message.style.color = 'var(--color-text-dim)';
                }, 2000);
            }
        });
    });
}

// ===== 打字机效果 =====
function typewriterEffect(element) {
    var text = element.getAttribute('data-full') || element.textContent;
    element.textContent = '';
    element.style.opacity = '1';

    var i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, 35);
        }
    }
    type();
}

// ===== 页面初始化分发 =====
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('map-canvas')) {
        initMap();
    }
    if (document.querySelector('.ritual-item')) {
        initRitual();
    }
});

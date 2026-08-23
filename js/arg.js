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

// ===== 档案室：archive.html =====
// 仅把照片下方的摩斯符号按原始顺序拼出（不翻译），交给玩家自己破译
function showArchiveMorse() {
    var morseParts = [];
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

    var out = document.getElementById('archive-morse');
    if (out) {
        out.textContent = morseParts.join(' ');
        out.style.opacity = '1';
    }
}

// 玩家自行破译后输入，正确才解锁信件入口
function checkArchiveAnswer() {
    var input = document.getElementById('archive-answer');
    var msg = document.getElementById('archive-message');
    if (!input || !msg) return;

    // 答案由摩斯表对"显示出的符号"自动解出，不硬编码，密文改动则答案自动跟随
    var morseParts = [];
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
    var answer = decodeMorse(morseParts.join(' ')).replace(/\s+/g, '');

    var guess = input.value.trim().toUpperCase().replace(/\s+/g, '');

    if (guess === answer && guess !== '') {
        msg.style.color = 'var(--color-gold)';
        msg.textContent = '破译正确：L · E · T · T · E · R · S。这些标记指向——信件。';
        var decoded = document.getElementById('archive-decoded');
        if (decoded) {
            decoded.textContent = 'LETTERS';
            decoded.style.opacity = '1';
        }
        var hidden = document.getElementById('archive-hidden-link');
        if (hidden) {
            hidden.style.opacity = '1';
            hidden.style.pointerEvents = 'auto';
        }
        input.disabled = true;
    } else {
        msg.textContent = '破译有误。再看看那些标记。';
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
    }
}

// ===== 研究项目：projects.html 隐藏入口显形（悬停显形，数秒后自动消失） =====
var projectsHideTimer = null;
function revealProjectsLink() {
    var hidden = document.getElementById('projects-hidden-link');
    if (!hidden) return;
    hidden.style.opacity = '1';
    hidden.style.pointerEvents = 'auto';
    if (projectsHideTimer) clearTimeout(projectsHideTimer);
    projectsHideTimer = setTimeout(function() {
        hidden.style.opacity = '0';
        hidden.style.pointerEvents = 'none';
    }, 5000);
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

// 展开/收起周然所长的破译笔记（凯撒密码提示）
function toggleLetterHint() {
    var hint = document.getElementById('letter-hint');
    if (!hint) return;
    hint.style.display = (hint.style.display === 'none') ? 'block' : 'none';
}

// 玩家自行解密后输入译文，验证通过才放行
function checkLetterAnswer() {
    var input = document.getElementById('letter-answer');
    var msg = document.getElementById('cipher-message');
    var cipherText = document.getElementById('cipher-text');
    if (!input || !msg) return;

    // 标准答案：对密文做位移 -7 解密（不硬编码，密文改了答案自动跟着变）
    var answer = '';
    if (cipherText) {
        answer = caesarShift(cipherText.textContent.trim(), -7);
    }

    // 归一化：去首尾空格、压成单空格、统一大写
    var guess = input.value.trim().toUpperCase().replace(/\s+/g, ' ');
    var target = answer.trim().toUpperCase().replace(/\s+/g, ' ');

    if (guess === target && guess !== '') {
        msg.style.color = 'var(--color-gold)';
        msg.textContent = '译文无误。沈墨的嘱托已为你敞开。';
        input.disabled = true;

        var hidden = document.getElementById('letter-hidden-link');
        if (hidden) {
            hidden.style.opacity = '1';
            hidden.style.pointerEvents = 'auto';
        }
    } else {
        msg.textContent = '译文有误。再想想那位罗马人的把戏。';
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
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

// 祭品位置随机洗牌（页面加载时、仪式失败重置时各执行一次）
function shuffleRitualItems() {
    var circle = document.querySelector('.ritual-circle');
    if (!circle) return;
    var items = Array.prototype.slice.call(circle.querySelectorAll('.ritual-item'));
    // Fisher-Yates 洗牌
    for (var i = items.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = items[i];
        items[i] = items[j];
        items[j] = tmp;
    }
    // 按新顺序重新插入
    items.forEach(function(item) {
        circle.appendChild(item);
    });
}

function initRitual() {
    var items = document.querySelectorAll('.ritual-item');
    var message = document.getElementById('ritual-message');
    var dots = document.querySelectorAll('.sequence-dot');

    // 每次进入页面，祭品位置随机排列
    shuffleRitualItems();

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
                    // 仪式失败后，祭品位置重新随机排列
                    shuffleRitualItems();
                    message.textContent = '重新开始仪式...（祭品已挪动了位置）';
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

// ===== 残账棋盘密码：ledger.html =====
var LEDGER_GRID = [
    ['渡', '口', '莫', '回', '头'],
    ['莫', '问', '归', '处', '安'],
    ['禁', '封', '渡', '夜', '中'],
    ['元', '子', '沉', '即', '槐'],
    ['村', '火', '水', '书', '然']
];

function renderLedgerGrid() {
    var g = document.getElementById('ledger-grid');
    if (!g) return;
    var html = '<table class="ledger-grid-table">';
    html += '<tr><th></th><th>1</th><th>2</th><th>3</th><th>4</th><th>5</th></tr>';
    for (var r = 0; r < 5; r++) {
        html += '<tr><th class="lg-row">' + (r + 1) + '</th>';
        for (var c = 0; c < 5; c++) {
            html += '<td>' + LEDGER_GRID[r][c] + '</td>';
        }
        html += '</tr>';
    }
    html += '</table>';
    g.innerHTML = html;
}

function checkLedgerAnswer() {
    // 只取朱笔圈定者（.ledger-real），黑底干扰项忽略
    var els = document.querySelectorAll('#ledger-roster .ledger-real');
    var answer = '';
    els.forEach(function(el) {
        var p = el.textContent.trim();
        var r = parseInt(p.charAt(0), 10) - 1;
        var c = parseInt(p.charAt(1), 10) - 1;
        if (LEDGER_GRID[r] && LEDGER_GRID[r][c]) answer += LEDGER_GRID[r][c];
    });

    var input = document.getElementById('ledger-answer');
    var msg = document.getElementById('ledger-message');
    var hidden = document.getElementById('ledger-hidden-link');
    if (!input || !msg) return;

    var guess = input.value.replace(/\s+/g, '');
    if (guess === answer && guess !== '') {
        msg.style.color = 'var(--color-gold)';
        msg.textContent = '名册上的名字，原来是一句告诫。';
        if (hidden) {
            hidden.style.opacity = '1';
            hidden.style.pointerEvents = 'auto';
        }
        input.disabled = true;
    } else {
        msg.style.color = 'var(--color-blood-bright)';
        msg.textContent = '数字对不上。只取朱笔圈定的那些。';
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
    }
}

// ===== 镜书蛇形密码：mirror.html =====
var MIRROR_GRID = [
    ['回', '头', '即', '沉'],
    ['期', '归', '问', '莫'],
    ['渡', '口', '安', '处']
];

function renderMirror() {
    var wrap = document.getElementById('mirror-grid');
    if (!wrap) return;
    var html = '';
    for (var r = 0; r < MIRROR_GRID.length; r++) {
        html += '<div class="mirror-row">';
        for (var c = 0; c < MIRROR_GRID[r].length; c++) {
            html += '<span class="mirror-cell">' + MIRROR_GRID[r][c] + '</span>';
        }
        html += '</div>';
    }
    wrap.innerHTML = html;
}

function checkMirrorAnswer() {
    // 蛇形：偶数行正读，奇数行反读（自上而下）
    var answer = '';
    for (var r = 0; r < MIRROR_GRID.length; r++) {
        if (r % 2 === 0) {
            answer += MIRROR_GRID[r].join('');
        } else {
            answer += MIRROR_GRID[r].slice().reverse().join('');
        }
    }

    var input = document.getElementById('mirror-answer');
    var msg = document.getElementById('mirror-message');
    var hidden = document.getElementById('mirror-hidden-link');
    if (!input || !msg) return;

    var guess = input.value.replace(/\s+/g, '');
    if (guess === answer && guess !== '') {
        msg.style.color = 'var(--color-gold)';
        msg.textContent = '镜中读出的，是给后来者的警告。';
        if (hidden) {
            hidden.style.opacity = '1';
            hidden.style.pointerEvents = 'auto';
        }
        input.disabled = true;
    } else {
        msg.style.color = 'var(--color-blood-bright)';
        msg.textContent = '镜面颠倒——不止字反，行亦反。再循蛇形读一遍。';
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
    }
}

// ===== 卦象爻变密码：omen.html =====
// 三爻结构，自上而下（上、中、下），1=阳 0=阴
var TRIGRAM_LINES = {
    '☰': [1, 1, 1], '☱': [0, 1, 1], '☲': [1, 0, 1], '☳': [0, 0, 1],
    '☴': [1, 1, 0], '☵': [0, 1, 0], '☶': [1, 0, 0], '☷': [0, 0, 0]
};
var TRIGRAM_CHAR = {
    '☰': '中', '☷': '元', '☳': '子', '☴': '夜',
    '☵': '莫', '☲': '回', '☶': '头', '☱': '禁'
};

function trigramFromLines(arr) {
    for (var k in TRIGRAM_LINES) {
        var v = TRIGRAM_LINES[k];
        if (v[0] === arr[0] && v[1] === arr[1] && v[2] === arr[2]) return k;
    }
    return '?';
}

function toggleOmenNote() {
    var note = document.getElementById('omen-note');
    if (note) note.style.display = (note.style.display === 'none' || note.style.display === '') ? 'block' : 'none';
}

function checkOmenAnswer() {
    var guaWrap = document.getElementById('omen-gua');
    var input = document.getElementById('omen-answer');
    var msg = document.getElementById('omen-message');
    var hidden = document.getElementById('omen-hidden-link');
    if (!guaWrap || !input || !msg) return;

    // 只取有效卦（跳过废卦）；遇动爻则先翻转该爻阴阳，得真卦后再查表
    var guaEls = guaWrap.querySelectorAll('.gua:not(.gua-decoy)');
    var answer = '';
    guaEls.forEach(function(el) {
        var sym = el.getAttribute('data-gua');
        var chg = el.getAttribute('data-change');
        var lines = TRIGRAM_LINES[sym].slice();
        if (chg) {
            var idx = parseInt(chg, 10) - 1; // 1=上 2=中 3=下
            lines[idx] = lines[idx] ? 0 : 1;
        }
        var trueSym = trigramFromLines(lines);
        answer += TRIGRAM_CHAR[trueSym] || '';
    });

    var guess = input.value.replace(/\s+/g, '');
    if (guess === answer && guess !== '') {
        msg.style.color = 'var(--color-gold)';
        msg.textContent = '天意所示，时辰已定。';
        if (hidden) {
            hidden.style.opacity = '1';
            hidden.style.pointerEvents = 'auto';
        }
        input.disabled = true;
    } else {
        msg.style.color = 'var(--color-blood-bright)';
        msg.textContent = '卦象有误。先化动爻、再查表、依左序连读——别把相似的卦看混了。';
        input.classList.add('shake');
        setTimeout(function() { input.classList.remove('shake'); }, 500);
    }
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

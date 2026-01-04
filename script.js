/**
 * Word Scramble Game - Professional Senior Implementation
 * اصلاح شده: تفکیک منطق Reset و Random + سیستم اعلان اختصاصی
 */
 const WordGame = (() => {
    // تنظیمات زبان و کلمات
    const translations = {
        en: {
            title: "Word Scramble",
            tryLabel: "Tries",
            randomBtn: "Random",
            resetBtn: "Reset",
            success: "Success!",
            successMsg: "You guessed the word correctly!",
            gameOver: "Game Over!",
            gameOverMsg: "You ran out of tries. Better luck next time!",
            continue: "Continue",
            words: ENGLISH_WORDS // متصل به فایل words.js
        },
        fa: {
            title: "حدس کلمه",
            tryLabel: "تلاش",
            randomBtn: "کلمه جدید",
            resetBtn: "دوباره",
            success: "آفرین!",
            successMsg: "کلمه رو درست حدس زدی!",
            gameOver: "باختی!",
            gameOverMsg: "تلاش‌های تو تموم شد. دوباره امتحان کن!",
            continue: "ادامه",
            words: pPER_WORDS // متصل به فایل words.js (اصلاح شد)
        }
    };

    // وضعیت داخلی بازی (State)
    let state = {
        currentLang: 'en',
        currentWord: "",
        mistakes: [],
        maxTries: 6
    };

    const el = {
        scrambledWord: document.getElementById("scrambled-word"),
        inputsContainer: document.getElementById("inputs-container"),
        triesCount: document.getElementById("tries-count"),
        mistakesList: document.getElementById("mistakes-list"),
        title: document.querySelector("h1"),
        randomBtn: document.getElementById("random-btn"),
        resetBtn: document.getElementById("reset-btn"),
        toggleLangBtn: document.getElementById("toggle-lang"),
        modal: document.getElementById("custom-alert"),
        modalTitle: document.getElementById("modal-title"),
        modalMessage: document.getElementById("modal-message"),
        modalIcon: document.querySelector(".modal-icon"),
        modalBtn: document.getElementById("modal-close-btn")
    };

    const showNotification = (title, message, icon = "🎉") => {
        el.modalTitle.innerText = title;
        el.modalMessage.innerText = message;
        el.modalIcon.innerText = icon;
        el.modalBtn.innerText = translations[state.currentLang].continue;
        el.modal.style.display = "flex";

        el.modalBtn.onclick = () => {
            el.modal.style.display = "none";
            init(); 
        };
    };

    const scramble = (word) => {
        return word.split('').sort(() => Math.random() - 0.5).join(' ');
    };

    const updateLanguageUI = () => {
        const langData = translations[state.currentLang];
        el.title.innerText = langData.title;
        el.randomBtn.innerText = langData.randomBtn;
        el.resetBtn.innerText = langData.resetBtn;
        // تغییر لیبل Tries اگر در HTML وجود دارد
        const label = document.querySelector(".status-row p");
        if(label) label.firstChild.textContent = `${langData.tryLabel} : `;
        
        document.body.dir = state.currentLang === 'fa' ? 'rtl' : 'ltr';
    };

    // --- تابع Reset: فقط پاک کردن حدس‌های فعلی ---
    const resetGame = () => {
        state.mistakes = [];
        el.triesCount.innerText = "0";
        el.mistakesList.innerText = "";
        const inputs = el.inputsContainer.querySelectorAll("input");
        inputs.forEach(input => input.value = "");
        if (inputs[0]) inputs[0].focus();
    };

    // --- تابع Init: انتخاب کلمه کاملاً جدید ---
    const init = () => {
        const langWords = translations[state.currentLang].words;
        state.currentWord = langWords[Math.floor(Math.random() * langWords.length)].toUpperCase();
        state.mistakes = [];
        
        el.scrambledWord.innerText = scramble(state.currentWord);
        el.triesCount.innerText = "0";
        el.mistakesList.innerText = "";

        el.inputsContainer.innerHTML = state.currentWord.split("")
            .map((_, i) => `<input type="text" maxlength="1" data-index="${i}" autocomplete="off">`)
            .join("");

        const firstInput = el.inputsContainer.querySelector("input");
        if (firstInput) firstInput.focus();
    };

    const handleInput = (e) => {
        if (e.target.tagName !== "INPUT") return;

        const char = e.target.value.toUpperCase();
        const index = parseInt(e.target.dataset.index);
        e.target.value = char;

        if (!char) return;

        if (char === state.currentWord[index]) {
            const next = e.target.nextElementSibling;
            if (next) next.focus();
            checkWin();
        } else {
            state.mistakes.push(char);
            e.target.value = "";
            el.triesCount.innerText = state.mistakes.length;
            el.mistakesList.innerText = state.mistakes.join(", ");

            if (state.mistakes.length >= state.maxTries) {
                showNotification(
                    translations[state.currentLang].gameOver,
                    translations[state.currentLang].gameOverMsg,
                    "❌"
                );
            }
        }
    };

    const checkWin = () => {
        const guess = Array.from(el.inputsContainer.querySelectorAll('input'))
            .map(i => i.value).join("");
        
        if (guess === state.currentWord) {
            setTimeout(() => {
                showNotification(
                    translations[state.currentLang].success,
                    translations[state.currentLang].successMsg,
                    "🎉"
                );
            }, 100);
        }
    };

    // رویدادها
    el.toggleLangBtn.addEventListener("click", () => {
        state.currentLang = state.currentLang === 'en' ? 'fa' : 'en';
        updateLanguageUI();
        init();
    });

    el.inputsContainer.addEventListener("input", handleInput);
    el.randomBtn.addEventListener("click", init); // دکمه کلمه جدید
    el.resetBtn.addEventListener("click", resetGame); // دکمه تلاش مجدد برای همان کلمه

    return { init, updateLanguageUI };
})();

document.addEventListener("DOMContentLoaded", () => {
    WordGame.updateLanguageUI();
    WordGame.init();
});
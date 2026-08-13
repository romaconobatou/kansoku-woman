(() => {
  const config = window.KANSOKU_CONFIG || {};
  const urls = config.urls || {};

  // 公開時刻を過ぎたら、その段階へ自動で進める。判定は閲覧者の端末時計。
  // 進めるだけで、設定済みの段階を巻き戻すことはしない。
  const PHASE_ORDER = ["pre_register", "free_released", "full_release"];

  const resolvePhase = () => {
    const base = config.phase || "pre_register";

    const hasPassed = (value) => {
      if (!value) return false;
      const at = Date.parse(value);
      return !Number.isNaN(at) && Date.now() >= at;
    };

    const advance = (current, next, at) =>
      hasPassed(at) && PHASE_ORDER.indexOf(next) > PHASE_ORDER.indexOf(current) ? next : current;

    let resolved = advance(base, "free_released", config.freeReleaseAt);
    resolved = advance(resolved, "full_release", config.fullReleaseAt);

    return resolved;
  };

  const phase = resolvePhase();

  // 未設定・空文字・プレースホルダ（REPLACE-WITH）を弾く共通判定。
  const isUsableUrl = (url) => Boolean(url) && !url.includes("REPLACE-WITH");
  // 先頭から順に、使えるURLを返す。すべて不可なら空文字。
  const firstUsableUrl = (...candidates) => candidates.find(isUsableUrl) || "";

  const boothUrl = firstUsableUrl(urls.boothProduct, urls.boothShop);

  const phaseCopy = {
    pre_register: {
      hero: {
        href: urls.substack,
        label: "体験版を受け取る",
        note: "Substackへ登録すると、8月1日にプレイURLが届きます。"
      },
      free: {
        href: urls.substack,
        label: "Substackに登録する",
        note: "体験版の案内と、8月10日の発売情報を受け取れます。"
      },
      product: {
        href: urls.substack,
        label: "発売案内を受け取る",
        note: "8月10日の販売開始を、メールで確実にお届けします。"
      },
      final: {
        href: urls.substack,
        label: "体験版を受け取る",
        note: "登録しろよ、このブタ野郎。"
      }
    },
    free_released: {
      hero: {
        href: urls.freeGame,
        label: "体験版をプレイする",
        note: "ブラウザですぐ遊べます。ノーマルエンドまで無料です。"
      },
      free: {
        href: urls.freeGame,
        label: "観測を始める",
        note: "ブラウザで、そのままプレイできます。"
      },
      product: {
        href: urls.substack,
        label: "製品版の発売案内を受け取る",
        note: "8月10日の販売開始をメールでお届けします。"
      },
      final: {
        href: urls.freeGame,
        label: "体験版をプレイする",
        note: "最後まで観測してください。"
      }
    },
    full_release: {
      hero: {
        href: boothUrl,
        label: "製品版を購入する",
        note: "BOOTHで販売中です。810円〜11,810円（税込）の3プランです。"
      },
      free: {
        href: urls.freeGame,
        label: "体験版をプレイする",
        note: "購入前に、ノーマルエンドまで無料で体験できます。"
      },
      product: {
        href: boothUrl,
        label: "BOOTHで購入する",
        note: "ロマ子様の初ボイス付きゲームです。"
      },
      final: {
        href: boothUrl,
        label: "製品版を購入する",
        note: "ここまで観測して、逃げるつもりですか。"
      }
    }
  };

  // 体験版の入手方法の説明。CTAと同時に切り替えないと、案内が食い違う。
  const phaseText = {
    pre_register: {
      freeAccess: "プレイURLは、罵尻ロマ子様のSubstack登録者へお届けします。",
      faqAccess: "Substackへ登録すると、公開時にプレイURLが届きます。"
    },
    free_released: {
      freeAccess: "下のボタンから、そのままプレイできます。",
      faqAccess: "このページの「観測を始める」から、そのままプレイできます。"
    },
    full_release: {
      freeAccess: "下のボタンから、そのままプレイできます。",
      faqAccess: "このページの「体験版をプレイする」から、そのままプレイできます。"
    }
  };

  document.querySelectorAll("[data-phase-text]").forEach((node) => {
    const text = phaseText[phase]?.[node.dataset.phaseText];
    if (text) node.textContent = text;
  });

  document.querySelectorAll("[data-phase-slot]").forEach((slot) => {
    const key = slot.dataset.phaseSlot;
    const content = phaseCopy[phase]?.[key] || phaseCopy.pre_register[key];
    const usable = isUsableUrl(content.href);

    const link = document.createElement("a");
    link.className = `cta ${key === "product" || key === "final" ? "secondary" : ""}`;
    link.href = usable ? content.href : "#";
    link.target = usable ? "_blank" : "_self";
    link.rel = usable ? "noopener noreferrer" : "";
    link.dataset.event = `${phase}_${key}_cta`;

    const strong = document.createElement("strong");
    strong.textContent = content.label;

    const small = document.createElement("small");
    small.textContent = content.note;

    link.append(strong, small);
    slot.append(link);

    if (!usable) {
      link.addEventListener("click", (event) => {
        event.preventDefault();
        window.alert("公開前に config.js のURLを差し替えてください。");
      });
    }
  });

  // Special Thanks: supporters.js の配列を読み取り、書かれた順のまま一覧表示する。
  const supportersConfig = window.KANSOKU_SUPPORTERS || {};
  const rawSupporters = Array.isArray(supportersConfig.supporters) ? supportersConfig.supporters : [];
  const supporterNames = rawSupporters.filter((name) => typeof name === "string" && name.trim() !== "");

  const supportersList = document.querySelector("[data-supporters-list]");

  if (supportersList && supporterNames.length > 0) {
    const grid = document.createElement("ul");
    grid.className = "supporters-grid";

    supporterNames.forEach((name) => {
      const item = document.createElement("li");
      item.textContent = name;
      grid.append(item);
    });

    supportersList.replaceChildren(grid);
  }

  // サンプルボイス。フルボイス版の価値を、買う前に聞いて確かめてもらうための試聴。
  // 自動再生はしない。再生は、必ず利用者のクリック（またはEnter/Space）から始まる。
  const voicePlayer = document.querySelector("[data-voice-player]");

  if (voicePlayer) {
    const audio = voicePlayer.querySelector("[data-voice-audio]");
    const ui = voicePlayer.querySelector("[data-voice-ui]");
    const toggle = voicePlayer.querySelector("[data-voice-toggle]");
    const label = voicePlayer.querySelector("[data-voice-label]");
    const fill = voicePlayer.querySelector("[data-voice-progress]");
    const currentTime = voicePlayer.querySelector("[data-voice-time]");
    const duration = voicePlayer.querySelector("[data-voice-duration]");

    // ここへ来られた時点でJSは動く。既定のコントロールを、自前のUIへ差し替える。
    // JSが動かない環境では controls が残るため、試聴そのものは失われない。
    if (audio && ui && toggle && label) {
      audio.removeAttribute("controls");
      ui.hidden = false;

      const PLAY_LABEL = "サンプルを再生する";
      const PAUSE_LABEL = "停止する";

      const formatTime = (seconds) => {
        if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
        const whole = Math.floor(seconds);
        return `${Math.floor(whole / 60)}:${String(whole % 60).padStart(2, "0")}`;
      };

      const paint = () => {
        const ratio = audio.duration > 0 ? audio.currentTime / audio.duration : 0;
        if (fill) fill.style.width = `${Math.min(ratio, 1) * 100}%`;
        if (currentTime) currentTime.textContent = formatTime(audio.currentTime);
      };

      const showPaused = () => {
        voicePlayer.dataset.state = "paused";
        label.textContent = PLAY_LABEL;
      };

      showPaused();

      // preload="none" のため、長さは再生を始めるまで分からない。
      // HTMLに書いた目安の秒数を、実際の値が分かった時点で上書きする。
      audio.addEventListener("loadedmetadata", () => {
        if (duration) duration.textContent = formatTime(audio.duration);
        paint();
      });

      audio.addEventListener("timeupdate", paint);

      // 試聴した人数を見るための計測。1回の閲覧につき1回だけ送る。
      // CTAクリックとは別のイベント名にして、CTAの数値を混ぜない。
      let hasTracked = false;

      audio.addEventListener("play", () => {
        voicePlayer.dataset.state = "playing";
        label.textContent = PAUSE_LABEL;

        if (hasTracked) return;
        hasTracked = true;
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "lp_voice_play", location: "voice_sample" });
      });

      audio.addEventListener("pause", showPaused);

      audio.addEventListener("ended", () => {
        showPaused();
        audio.currentTime = 0;
        paint();
      });

      audio.addEventListener("error", () => {
        showPaused();
        label.textContent = "音声を読み込めません";
        toggle.disabled = true;
      });

      toggle.addEventListener("click", () => {
        if (!audio.paused) {
          audio.pause();
          return;
        }

        // play() は Promise を返す。失敗しても例外を投げっぱなしにしない。
        const started = audio.play();
        if (started && typeof started.catch === "function") {
          started.catch(() => {
            showPaused();
            label.textContent = "再生できません";
          });
        }
      });
    }
  }

  // Analytics hook. Connect this to GA4, Plausible, or another tool before launch.
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-event]");
    if (!target) return;

    const eventName = target.dataset.event;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lp_cta_click", location: eventName });
  });
})();

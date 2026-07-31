(() => {
  const config = window.KANSOKU_CONFIG || {};
  const phase = config.phase || "pre_register";
  const urls = config.urls || {};

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
        note: "Substack読者限定で、体験版をノーマルエンドまで無料公開中です。"
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

  // Analytics hook. Connect this to GA4, Plausible, or another tool before launch.
  document.addEventListener("click", (event) => {
    const target = event.target.closest("[data-event]");
    if (!target) return;

    const eventName = target.dataset.event;
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: "lp_cta_click", location: eventName });
  });
})();

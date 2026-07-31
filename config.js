/**
 * Campaign configuration.
 *
 * phase:
 * - "pre_register": 8/1まで。Substack登録が主目的です。
 * - "free_released": 8/1〜8/9。体験版プレイと発売通知登録が主目的です。
 * - "full_release": 8/10以降。BOOTH購入が主目的です。
 *
 * 公開前にURLを必ず差し替えてください。
 */
window.KANSOKU_CONFIG = {
  phase: "pre_register",
  urls: {
    substack: "https://romaco.substack.com/subscribe?next=https%3A%2F%2Fsubstack.com%2F%40romaco&utm_source=profile-page&utm_medium=web&utm_campaign=substack_profile&just_signed_up=true",
    freeGame: "https://REPLACE-WITH-FREE-GAME.example",
    boothShop: "https://romaco0810.booth.pm/",
    boothProduct: "https://REPLACE-WITH-BOOTH-PRODUCT.example"
  }
};

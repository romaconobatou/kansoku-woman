/**
 * Campaign configuration.
 *
 * phase:
 * - "pre_register": 8/1まで。Substack登録が主目的です。
 * - "free_released": 8/1〜8/9。体験版プレイと発売通知登録が主目的です。
 * - "full_release": 8/10以降。BOOTH購入が主目的です。
 *
 * freeReleaseAt:
 * この日時を過ぎると、phase が "pre_register" のままでも自動的に
 * "free_released" として表示されます（体験版の公開時刻に合わせた自動切り替え）。
 * 判定は閲覧者の端末時計で行うため、数秒程度のずれは起こりえます。
 * 切り替え後は phase を "free_released" にして、この値を null にしても構いません。
 * 自動切り替えを使わない場合は null にしてください。
 *
 * 公開前にURLを必ず差し替えてください。
 */
window.KANSOKU_CONFIG = {
  phase: "pre_register",
  freeReleaseAt: "2026-08-01T08:10:00+09:00",
  urls: {
    substack: "https://romaco.substack.com/subscribe?next=https%3A%2F%2Fsubstack.com%2F%40romaco&utm_source=profile-page&utm_medium=web&utm_campaign=substack_profile&just_signed_up=true",
    freeGame: "https://kansoku-woman-trial.netlify.app/",
    boothShop: "https://romaco0810.booth.pm/",
    boothProduct: "https://REPLACE-WITH-BOOTH-PRODUCT.example"
  }
};

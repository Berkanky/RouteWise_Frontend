// animations.js (veya benzer bir dosya)
import { createAnimation } from '@ionic/vue';

export const fadeAnimation = (baseEl, opts) => {
  const enteringAnimation = createAnimation()
    .addElement(opts.enteringEl)
    .duration(300) // Süreyi ayarla
    .fromTo('opacity', '0', '1');

  const leavingAnimation = createAnimation()
    .addElement(opts.leavingEl)
    .duration(300) // Süreyi ayarla
    .fromTo('opacity', '1', '0');

  const animation = createAnimation()
    .addAnimation(enteringAnimation)
    .addAnimation(leavingAnimation);

  return animation;
};
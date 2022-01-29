import { hooks } from "@odoo/owl";

const { onPatched, useRef, useState } = hooks;

export const useAnimation = (refString: string, animationName: string) => {
  const ref = useRef(refString);
  const state = useState({ isDisplayed: <boolean>false });
  const enterCls = `${animationName}-enter`;
  const leaveCls = `${animationName}-leave`;
  let willBeDisplayed = false;

  onPatched(() => {
    if (ref.el) {
      if (willBeDisplayed) {
        willBeDisplayed = false;
        ref.el.classList.add(enterCls);
      }
      ref.el.onanimationend = () => {
        ref.el?.classList.remove(enterCls, leaveCls);
      };
    }
  });

  return {
    get isDisplayed() {
      return state.isDisplayed;
    },
    set isDisplayed(newValue: boolean) {
      if (newValue) {
        state.isDisplayed = newValue;
        willBeDisplayed = true;
      } else if (ref.el) {
        ref.el.classList.add(leaveCls);
        ref.el.addEventListener("animationend", () => {
          state.isDisplayed = false;
        }, { once: true });
      }
    },
  };
};

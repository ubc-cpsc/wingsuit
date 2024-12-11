declare const window: Window;

let behaviorName;
let beahviorsInitialized = false;

export function isInit() {
  return beahviorsInitialized;
}

export function init(pbehaviorName) {
  if (beahviorsInitialized === false) {
    if (typeof global.window !== 'undefined') {
      // @ts-ignore
      if (!global.window[pbehaviorName]?.behaviors) {
        // @ts-ignore
        global.window[pbehaviorName] = { behaviors: {} };
      }
      behaviorName = pbehaviorName;
    }
  }
  beahviorsInitialized = true;
}

export function attachBehaviors(context: any, settings: any) {
  BehaviorExecutor.attachBehaviors(context, settings);
}

class BehaviorExecutor {
  public behaviors: any = {};

  public static throwError(error) {
    setTimeout(() => {
      throw error;
    }, 0);
  }

  public static attachBehaviors(context: any, settings = {}) {
    if (!beahviorsInitialized) {
      console.error(
        "attachBehavior is not initialized. Call initJsBehaviors('Drupal'); in your preview.js."
      );
      return;
    }
    // @ts-ignore
    const { behaviors } = window[behaviorName];
    Object.keys(behaviors).forEach((i) => {
      if (typeof behaviors[i].attach === 'function') {
        try {
          behaviors[i].attach(context, settings);
        } catch (e) {
          BehaviorExecutor.throwError(e);
        }
      }
    });
  }
}

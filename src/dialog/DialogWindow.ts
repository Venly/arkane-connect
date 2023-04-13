import { LoginResult, Security } from '../connect/Security';
import { AuthenticationOptions } from '../connect/connect';
import { WindowMode } from '../models/WindowMode';

declare const lottie: any;

export class DialogWindow {
  public static async openLoginDialog(clientId: string, options?: AuthenticationOptions): Promise<LoginResult> {
    let templateUrl: string;

    switch ((options as AuthenticationOptions).idpHint) {
      case 'google':
        templateUrl = 'https://connect-qa.venly.io/static/html/login-google-idp-hint.html';
        break;
      case 'apple':
        templateUrl = 'https://connect-qa.venly.io/static/html/login-apple-idp-hint.html';
        break;
      case 'twitter':
      case 'arkane-twitter':
        templateUrl = 'https://connect-qa.venly.io/static/html/login-twitter-idp-hint.html';
        break;
      case 'facebook':
      case 'arkane-facebook':
        templateUrl = 'https://connect-qa.venly.io/static/html/login-facebook-idp-hint.html';
        break;
      case 'password':
        templateUrl = 'https://connect-qa.venly.io/static/html/login-password-idp-hint.html';
        break;
      default:
        templateUrl = 'https://connect-qa.venly.io/static/html/login-none-idp-hint.html';
        break;
    }

    return new Promise(resolve => {
      fetch(templateUrl)
        .then(response => response.text())
        .then(template => {
          const overlayContainer = this.createOverlayContainer();
          const container = document.createElement('div');
          const shadowRoot = container.attachShadow({ mode: 'closed' });
          container.classList.add('venly-connect-dialog-container');
          shadowRoot.innerHTML = template;
          container.style.position = 'absolute';
          container.style.zIndex = '2147483647';
          container.style.display = 'block';
          container.style.top = `${(window.innerWidth > 450 ? '0' : '50%')}`;
          container.style.left = `${(window.innerWidth > 450 ? 'calc(50% - 200px)' : '50%')}`;

          const backdrop = document.createElement('div');
          backdrop.classList.add('venly-connect-dialog-backdrop');
          backdrop.style.position = 'fixed';
          backdrop.style.width = '100%';
          backdrop.style.height = '100%';
          backdrop.style.zIndex = '2147483647';
          (backdrop.style as any).backdropFilter = 'blur(5px)';

          const companyLogo = shadowRoot.querySelector('.connect-company-logo');
          (companyLogo as HTMLImageElement).src = `https://content.venly.io/connected-apps/logos/${clientId}.png`;

          overlayContainer.appendChild(backdrop);
          this.addFonts();
          this.addAnimationScript(shadowRoot);

          const { idpHint } = options as AuthenticationOptions;
          if (idpHint === 'register') {
            this.showRefocusLayout();
            Security.login(clientId, {
              ...options,
              idpHint,
              windowMode: WindowMode.POPUP
            }).then(authResult => {
              this.removeBackdrop();
              this.closeRefocusLayout();
              resolve(authResult)
            });
          } else {
            overlayContainer.appendChild(container);
            this.addAuthEventListeners(clientId, options as AuthenticationOptions, resolve, shadowRoot);
            document.body.appendChild(overlayContainer);
            this.addCloseListeners(shadowRoot);
          }
        });
    });
  }

  private static addFonts() {
    const style = 'https://connect-qa.venly.io/static/css/connect/fonts.css';
    const stylesheet = document.createElement('link');
    stylesheet.setAttribute('rel', 'stylesheet');
    stylesheet.setAttribute('href', style);
    stylesheet.setAttribute('type', 'text/css');
    (document.querySelector('head') as HTMLHeadElement).appendChild(stylesheet);
  }

  private static addAnimationScript(shadowRoot: any) {
    const lootieScript = document.createElement('script');
    lootieScript.setAttribute('src', 'https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.10.2/lottie.min.js');
    lootieScript.setAttribute('integrity', 'sha512-fTTVSuY9tLP+l/6c6vWz7uAQqd1rq3Q/GyKBN2jOZvJSLC5RjggSdboIFL1ox09/Ezx/AKwcv/xnDeYN9+iDDA==');
    lootieScript.setAttribute('crossorigin', 'anonymous');
    lootieScript.setAttribute('referrerpolicy', 'no-referrer');
    (document.querySelector('head') as HTMLHeadElement).appendChild(lootieScript);

    const interval = setInterval(() => {
      const lt = lottie; // TS compiler trick
      if (lt) {
        lt.loadAnimation({
          container: shadowRoot.querySelector('.animation'),
          renderer: 'svg',
          loop: true,
          autoplay: true,
          path: 'https://connect-qa.venly.io/static/animations/login-animation.json'
        });
        clearInterval(interval);
      }
    }, 100);
  }

  private static addAuthEventListeners(
    clientId: string,
    options: AuthenticationOptions,
    authResolver: (value?: LoginResult | PromiseLike<LoginResult> | undefined) => void,
    root: ShadowRoot
  ) {
    const authActions = root.querySelectorAll('.auth-action');
    Array.from(authActions).forEach((authAction: any) => {
      authAction.addEventListener('click', (event: MouseEvent) => {
        const idpHint = (event.target as any).dataset.idpHint || (event.target as any).parentElement.dataset.idpHint;

        Security.login(clientId, {
          ...options,
          idpHint,
          windowMode: WindowMode.POPUP
        }).then(authResult => {
          this.removeBackdrop();
          this.closeRefocusLayout(options.closePopup);

          authResolver(authResult)
        });

        this.closeLoginDialog();
        this.showRefocusLayout();
      });
    });

    const selectAnotherOption = root.querySelector('.select-another-option');
    if (selectAnotherOption) {
      selectAnotherOption.addEventListener('click', () => {
        this.closeLoginDialog();
        this.removeBackdrop();
        delete options.idpHint;
        authResolver(this.openLoginDialog(clientId, options));
      });
    }
  }

  private static addCloseListeners(root: ShadowRoot) {
    const close = root.querySelector('.venly-connect-close-dialog');
    const backdrop = document.body.querySelector('.venly-connect-dialog-backdrop');

    if (close) {
      close.addEventListener('click', () => {
        this.closeLoginDialog();
        this.removeBackdrop();
      });
    }

    if (backdrop) {
      backdrop.addEventListener('click', () => {
        if (!Security.hasPopupWindow()) {
          this.closeLoginDialog();
          this.removeBackdrop();
          this.closeRefocusLayout();
        }
      });
    }
  }

  private static closeLoginDialog() {
    const dialogContainer = document.body.querySelector('.venly-connect-dialog-container');

    if (dialogContainer) {
      dialogContainer.remove();
    }
  }

  private static removeBackdrop() {
    const backdrop = document.body.querySelector('.overlay-container');

    if (backdrop) {
      backdrop.remove();
    }
  }

  private static showRefocusLayout() {
    fetch('https://connect-qa.venly.io/static/html/re-focus-layout.html')
      .then(response => response.text())
      .then(template => {
        const overlayContainer = this.createOverlayContainer();
        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'closed' });
        container.classList.add('venly-connect-refocus-container');
        shadowRoot.innerHTML = template;
        container.style.position = 'absolute';
        container.style.top = 'calc(50% - 218px)';
        container.style.left = 'calc(50% - 147.5px)';
        container.style.zIndex = '2147483647';
        overlayContainer.appendChild(container);
        document.body.appendChild(overlayContainer);

        this.addRefocusListeners(shadowRoot);
      });
  }

  private static closeRefocusLayout(closePopup: boolean = true) {
    const backdrop = document.body.querySelector('.overlay-container');
    if (closePopup)
      Security.closePopupWindow();

    if (backdrop) {
      backdrop.remove();
    }
  }

  private static addRefocusListeners(root: ShadowRoot) {
    const reopenAction = root.querySelector('.venly-connect-re-focus-wrapper .reopen-action');

    if (reopenAction) {
      reopenAction.addEventListener('click', () => Security.focusPopupWindow());
    }
  }

  private static createOverlayContainer(): HTMLDivElement {
    const overlayContainer = document.createElement('div');
    overlayContainer.classList.add('overlay-container');
    overlayContainer.style.position = 'fixed';
    overlayContainer.style.zIndex = '2147483647';
    overlayContainer.style.top = '0';
    overlayContainer.style.left = '0';
    overlayContainer.style.height = '100%';
    overlayContainer.style.background = 'rgba(33, 37, 41, 0.5)';
    overlayContainer.style.width = '100%';

    return overlayContainer;
  }
}
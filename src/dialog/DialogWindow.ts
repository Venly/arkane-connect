import { LoginResult, Security } from '../connect/Security';
import { AuthenticationOptions } from '../connect/connect';
import { WindowMode } from '../models/WindowMode';

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
          const container = document.createElement('div');
          const shadowRoot = container.attachShadow({ mode: 'closed' });
          container.classList.add('venly-connect-dialog-container');
          shadowRoot.innerHTML = template;
          container.style.position = 'absolute';
          container.style.top = 'calc(50% - 380px)';
          container.style.left = 'calc(50% - 150px)';
          container.style.zIndex = '999999';

          const backdrop = document.createElement('div');
          backdrop.classList.add('venly-connect-dialog-backdrop');
          backdrop.style.position = 'absolute';
          backdrop.style.width = '100%';
          backdrop.style.height = '100%';
          backdrop.style.background = 'rgba(33, 37, 41, 0.5)';
          backdrop.style.zIndex = '99999';
          (backdrop.style as any).backdropFilter = 'blur(5px)';

          const companyLogo = shadowRoot.querySelector('.connect-company-logo');
          (companyLogo as HTMLImageElement).src = `https://content.venly.io/connected-apps/logos/${clientId}.png`;

          document.body.appendChild(backdrop);

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
            document.body.appendChild(container);
            this.addAuthEventListeners(clientId, options as AuthenticationOptions, resolve, shadowRoot);
            this.addCloseListeners(shadowRoot);
          }
        });
    });
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
          this.closeRefocusLayout();

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
        this.openLoginDialog(clientId, options);
      });
    }
  }

  private static addCloseListeners(root: ShadowRoot) {
    const close = root.querySelector('.venly-connect-close-dialog');
    const backdrop = document.body.querySelector('.venly-connect-dialog-backdrop');

    if (close ) {
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
    const backdrop = document.body.querySelector('.venly-connect-dialog-backdrop');

    if (backdrop) {
      backdrop.remove();
    }
  }

  private static showRefocusLayout() {
    fetch('https://connect-qa.venly.io/static/html/re-focus-layout.html')
      .then(response => response.text())
      .then(template => {
        const container = document.createElement('div');
        const shadowRoot = container.attachShadow({ mode: 'closed' });
        container.classList.add('venly-connect-refocus-container');
        shadowRoot.innerHTML = template;
        container.style.position = 'absolute';
        container.style.top = 'calc(50% - 380px)';
        container.style.left = 'calc(50% - 150px)';
        container.style.zIndex = '999999';
        document.body.appendChild(container);

        this.addRefocusListeners(shadowRoot);
      });
  }

  private static closeRefocusLayout() {
    const refocusContainer = document.body.querySelector('.venly-connect-refocus-container');
    Security.closePopupWindow();

    if (refocusContainer) {
      refocusContainer.remove();
    }
  }

  private static addRefocusListeners(root: ShadowRoot) {
    const reopenAction = root.querySelector('.venly-connect-re-focus-wrapper .reopen-action');

    if (reopenAction) {
      reopenAction.addEventListener('click', () => Security.focusPopupWindow());
    }
  }
}
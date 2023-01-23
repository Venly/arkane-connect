import { LoginResult, Security } from '../connect/Security';
import { AuthenticationOptions } from '../connect/connect';
import { WindowMode } from '../models/WindowMode';

export class DialogWindow {
  public static async openLoginDialog(clientId: string, options?: AuthenticationOptions): Promise<LoginResult> {
    return new Promise(resolve => {
      fetch('https://connect-qa.venly.io/static/html/login-none-idp-hint.html')
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

          document.body.appendChild(backdrop);
          document.body.appendChild(container);
          this.addAuthEventListeners(clientId, options as AuthenticationOptions, resolve, shadowRoot);
          this.addCloseListeners(shadowRoot);
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
        const idpHint = (event.target as any).dataset.idpHint;

        Security.login(clientId, {
          ...options,
          idpHint,
          windowMode: WindowMode.POPUP
        }).then(authResult => {
          this.closeLoginDialog();
          authResolver(authResult);
        });
      });
    });
  }

  private static addCloseListeners(root: ShadowRoot) {
    (root.querySelector('.venly-connect-close-dialog') as Element)
      .addEventListener('click', () => this.closeLoginDialog());

    (document.body.querySelector('.venly-connect-dialog-backdrop') as Element)
      .addEventListener('click', () => this.closeLoginDialog());
  }

  private static closeLoginDialog() {
    (document.body.querySelector('.venly-connect-dialog-container') as Element).remove();
    (document.body.querySelector('.venly-connect-dialog-backdrop') as Element).remove();
  }
}
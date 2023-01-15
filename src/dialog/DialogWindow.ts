import { LoginResult, Security } from '../connect/Security';
import { AuthenticationOptions } from '../connect/connect';
import { WindowMode } from '../models/WindowMode';

export class DialogWindow {
  public static async openLoginDialog(clientId: string, options?: AuthenticationOptions): Promise<LoginResult> {
    return new Promise(resolve => {
      fetch('http://127.0.0.1:8080/src/login-none-idp-hint.html') // TODO: To be updated
        .then(response => response.text())
        .then(template => {
          const container = document.createElement('div');
          container.classList.add('venly-connect-dialog-container');
          container.innerHTML = template;
          container.style.position = 'absolute';
          container.style.top = 'calc(50% - 380px)';
          container.style.left = 'calc(50% - 150px)';
          container.style.zIndex = '999999';

          const backdrop = document.createElement('div');
          backdrop.classList.add('venly-connect-dialog-backdrop');

          document.body.appendChild(backdrop);
          document.body.appendChild(container);
          this.addAuthEventListeners(clientId, options as AuthenticationOptions, resolve);
          this.addCloseListeners();
        });
    });
  }

  private static addAuthEventListeners(
    clientId: string,
    options: AuthenticationOptions,
    authResolver: (value?: LoginResult | PromiseLike<LoginResult> | undefined) => void
  ) {
    const authActions = document.body.querySelectorAll('.auth-action');
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

  private static addCloseListeners() {
    (document.body.querySelector('.venly-connect-close-dialog') as Element)
      .addEventListener('click', () => this.closeLoginDialog());

    (document.body.querySelector('.venly-connect-dialog-backdrop') as Element)
      .addEventListener('click', () => this.closeLoginDialog());
  }

  private static closeLoginDialog() {
    (document.body.querySelector('.venly-connect-dialog-container') as Element).remove();
    (document.body.querySelector('.venly-connect-dialog-backdrop') as Element).remove();
  }
}
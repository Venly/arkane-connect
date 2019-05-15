export class PopupUtils {
    public static openWindow(url: string, title: string = 'Arkane Connect', w: number = 350, h: number = 685) {
        const left = (screen.width / 2) - (w / 2);
        const top = (screen.height / 2) - (h / 2);
        let features = 'toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, ';
        features += `copyhistory=no, width=${w}, height=${h}, top=${top}, left=${left}`;
        const popup = window.open(url, title, features);
        if (popup) {
            return popup;
        } else {
            throw new Error('Something went wrong while trying to open the signer popup');
        }
    }
}

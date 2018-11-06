export enum SnackType {
    SUCCESS = 'success',
    DANGER = 'danger',
    WARNING = 'warning',
    INFO = 'info',
    DEFAULT = 'info',
}

export interface Snack {
    'type': SnackType;
    'message': string;
    'blocking': boolean;
}

export interface PopupResult {
    status: 'SUCCESS' | 'ABORTED' | 'FAILED',
    result?: any,
    errors?: any[]
}

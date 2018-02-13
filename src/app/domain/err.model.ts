export interface Err {
    // 时间戳
    timestamp?: Date;
    status?: string;
    error?: string;
    exception?: string;
    message?: string;
    path?: string;
}
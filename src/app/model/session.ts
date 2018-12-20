export class Session {
    sessionId: string;
    description: string;
    persistence: number;
    current: boolean;
    ip: string;
    ip_ctry: string;
    passwd: string;
    created: number;
    last_request: number;
    expires: number;
}
export interface MessageData {
    ok: boolean;
    columns?: string[];
    rows?: Record<string, any>[];
    row_count?: number;
    sql_executed?: string;
    error?: string;
    userPrompt?: string;
    conversational?: boolean;
    text?: string;
}

export interface message {
    content: string;
    role: string;
    id: string;
    data?: MessageData;
}

export interface ChatSession {
    id: string;
    title: string;
    updatedAt: number;
    messages: message[];
}
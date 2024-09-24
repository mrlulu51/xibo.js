export interface CMSResponse<T> {
    grid: boolean;
    success: boolean;
    status: number;
    message: string;
    id: number;
    data: T;
}
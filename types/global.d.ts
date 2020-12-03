export declare global {
    function setupTestDB(dbname: string): void;
    function mockAuthentication(): void;
    function changeRouterProperties(options?: object): void;
}

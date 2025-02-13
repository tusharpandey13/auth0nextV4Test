import type { User } from "../../types";
export declare function useUser(): {
    user: User;
    isLoading: boolean;
    error: null;
} | {
    user: null;
    isLoading: boolean;
    error: Error;
} | {
    user: undefined;
    isLoading: boolean;
    error: undefined;
};

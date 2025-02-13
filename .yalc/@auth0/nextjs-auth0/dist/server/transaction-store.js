import * as cookies from "./cookies";
const TRANSACTION_COOKIE_PREFIX = "__txn_";
/**
 * TransactionStore is responsible for storing the state required to successfully complete
 * an authentication transaction. The store relies on encrypted, stateless cookies to store
 * the transaction state.
 */
export class TransactionStore {
    constructor({ secret, cookieOptions }) {
        this.secret = secret;
        this.transactionCookiePrefix =
            cookieOptions?.prefix ?? TRANSACTION_COOKIE_PREFIX;
        this.cookieConfig = {
            httpOnly: true,
            sameSite: cookieOptions?.sameSite ?? "lax", // required to allow the cookie to be sent on the callback request
            secure: cookieOptions?.secure ?? false,
            path: "/",
            maxAge: 60 * 60 // 1 hour in seconds
        };
    }
    /**
     * Returns the name of the cookie used to store the transaction state.
     * The cookie name is derived from the state parameter to prevent collisions
     * between different transactions.
     */
    getTransactionCookieName(state) {
        return `${this.transactionCookiePrefix}${state}`;
    }
    async save(resCookies, transactionState) {
        const jwe = await cookies.encrypt(transactionState, this.secret);
        if (!transactionState.state) {
            throw new Error("Transaction state is required");
        }
        resCookies.set(this.getTransactionCookieName(transactionState.state), jwe.toString(), this.cookieConfig);
    }
    async get(reqCookies, state) {
        const cookieName = this.getTransactionCookieName(state);
        const cookieValue = reqCookies.get(cookieName)?.value;
        if (!cookieValue) {
            return null;
        }
        return cookies.decrypt(cookieValue, this.secret);
    }
    async delete(resCookies, state) {
        await resCookies.delete(this.getTransactionCookieName(state));
    }
}

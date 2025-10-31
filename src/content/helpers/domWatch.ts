// helpers/domWatch.ts

type WaitOptions = {
    timeout?: number;      // ms (default 10s)
    root?: Node;           // what to observe (default: document.documentElement or body)
    subtree?: boolean;     // observe subtree (default: true)
};

function defaultRoot(): Node {
    return document.documentElement ?? document.body;
}

/**
 * Generic "wait until check() returns a non-null value" using a MutationObserver.
 * Cleans up observer + timeout automatically.
 */
function waitForMutation<T>(
    check: () => T | null,
    { timeout = 10_000, root = defaultRoot(), subtree = true }: WaitOptions = {}
): Promise<T | null> {
    // Try immediately before subscribing
    const immediate = check();
    if (immediate !== null) return Promise.resolve(immediate);

    return new Promise((resolve) => {
        const observer = new MutationObserver(() => {
            const result = check();
            if (result !== null) {
                observer.disconnect();
                if (timeoutId) clearTimeout(timeoutId);
                resolve(result);
            }
        });

        observer.observe(root, { childList: true, subtree });

        let timeoutId: ReturnType<typeof setTimeout> | undefined;
        if (timeout > 0) {
            timeoutId = setTimeout(() => {
                observer.disconnect();
                resolve(null);
            }, timeout);
        }
    });
}

/** Waits for an element to appear that matches the selector. */
export function waitForElement(
    selector: string,
    opts?: WaitOptions
): Promise<Element | null> {
    return waitForMutation(() => document.querySelector(selector), opts);
}

/** Waits for an element's textContent to satisfy the predicate. */
export async function waitForElementText(
    selector: string,
    predicate: (text: string) => boolean = (t) => t.trim() !== "",
    opts?: WaitOptions
): Promise<string | null> {
    const el = await waitForElement(selector, opts);
    if (!el) return null;

    const read = () => (el.textContent || "").trim();
    const now = read();
    if (predicate(now)) return now;

    return waitForMutation(() => {
        const txt = read();
        return predicate(txt) ? txt : null;
    }, { ...opts, root: el }); // observe only the element subtree for text changes
}

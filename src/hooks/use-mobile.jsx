import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}
``# Life Admin — Full Source (3/5: UI Primitives)

These are the shadcn/ui primitives used by the app. The remaining shadcn/ui files (accordion, alert, alert-dialog, etc.) are unchanged from their default shadcn/ui CLI installation and are not included here.

---

## File: `src/components/ui/button.jsx`


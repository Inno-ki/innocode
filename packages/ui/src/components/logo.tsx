import { ComponentProps } from "solid-js"

const FONT_FAMILY = "var(--font-ui, 'IBM Plex Mono', 'SF Mono', ui-monospace, monospace)"

export const Mark = (props: { class?: string }) => {
  return (
    <svg
      data-component="logo-mark"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="1" y="1" width="22" height="22" rx="6" fill="var(--icon-strong-base)" />
      <text
        x="12"
        y="15"
        text-anchor="middle"
        font-family={FONT_FAMILY}
        font-size="8"
        font-weight="700"
        letter-spacing="1.2"
        fill="var(--icon-weak-base)"
      >
        IC
      </text>
    </svg>
  )
}

export const Splash = (props: Pick<ComponentProps<"svg">, "ref" | "class">) => {
  return (
    <svg
      ref={props.ref}
      data-component="logo-splash"
      classList={{ [props.class ?? ""]: !!props.class }}
      viewBox="0 0 120 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="10" y="10" width="100" height="120" rx="18" fill="var(--icon-strong-base)" />
      <text
        x="60"
        y="78"
        text-anchor="middle"
        font-family={FONT_FAMILY}
        font-size="28"
        font-weight="700"
        letter-spacing="3"
        fill="var(--icon-weak-base)"
      >
        IC
      </text>
    </svg>
  )
}

export const Logo = (props: { class?: string }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 260 36"
      fill="none"
      classList={{ [props.class ?? ""]: !!props.class }}
    >
      <rect x="1" y="4" width="28" height="28" rx="7" fill="var(--icon-strong-base)" />
      <text
        x="15"
        y="23"
        text-anchor="middle"
        font-family={FONT_FAMILY}
        font-size="10"
        font-weight="700"
        letter-spacing="1.4"
        fill="var(--icon-weak-base)"
      >
        IC
      </text>
      <text
        x="40"
        y="24"
        font-family={FONT_FAMILY}
        font-size="14"
        font-weight="700"
        letter-spacing="2"
        fill="var(--icon-strong-base)"
      >
        INNOCODE
      </text>
    </svg>
  )
}

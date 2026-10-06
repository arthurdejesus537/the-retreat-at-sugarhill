type IconName = "chevron-down" | "close" | "arrow-left" | "arrow-right" | "star";

// Ícones de traço simples desenhados para o projeto (o original usa uma icon font própria).
// Tamanho em em: herdam o font-size e a cor do contexto.
const paths: Record<IconName, React.ReactNode> = {
  "chevron-down": <path d="M3 6l5 5 5-5" />,
  close: <path d="M4 4l8 8M12 4l-8 8" />,
  "arrow-left": <path d="M13.5 8h-11M6.5 4l-4 4 4 4" />,
  "arrow-right": <path d="M2.5 8h11M9.5 4l4 4-4 4" />,
  star: (
    <path d="M8 1.5v13M1.5 8h13M3.4 3.4l9.2 9.2M12.6 3.4l-9.2 9.2M5.5 2l5 12M10.5 2l-5 12M2 5.5l12 5M14 5.5l-12 5" />
  ),
};

export function Icon({ name }: { name: IconName }) {
  return (
    <svg
      viewBox="0 0 16 16"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {paths[name]}
    </svg>
  );
}

const toneClasses = {
  default: 'premium-card',
  soft: 'premium-card premium-card-soft',
  quiet: 'premium-card premium-card-quiet',
};

export default function PremiumCard({
  as: Component = 'div',
  tone = 'default',
  hover = false,
  className = '',
  children,
  ...props
}) {
  return (
    <Component
      className={[
        toneClasses[tone] ?? toneClasses.default,
        hover ? 'premium-card-hover' : '',
        className,
      ].join(' ')}
      {...props}
    >
      {children}
    </Component>
  );
}

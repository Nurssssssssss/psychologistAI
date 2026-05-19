import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { usePageTransition } from '../../context/PageTransitionContext.jsx';

function toPathString(to) {
  if (typeof to === 'string') return to;

  return `${to.pathname ?? ''}${to.search ?? ''}${to.hash ?? ''}`;
}

function isModifiedEvent(event) {
  return event.metaKey || event.altKey || event.ctrlKey || event.shiftKey;
}

export default function TransitionNavLink({
  onClick,
  reloadDocument,
  replace,
  state,
  target,
  to,
  preventScrollReset,
  relative,
  ...props
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isTransitioning, runPageTransition } = usePageTransition();

  async function handleClick(event) {
    onClick?.(event);

    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      reloadDocument ||
      target ||
      isModifiedEvent(event)
    ) {
      return;
    }

    const targetPath = toPathString(to);
    const currentPath = `${location.pathname}${location.search}${location.hash}`;

    if (targetPath === currentPath || isTransitioning) {
      event.preventDefault();
      return;
    }

    event.preventDefault();
    await runPageTransition(() => {
      navigate(to, { replace, state, preventScrollReset, relative });
    });
  }

  return (
    <NavLink
      {...props}
      reloadDocument={reloadDocument}
      replace={replace}
      state={state}
      target={target}
      to={to}
      preventScrollReset={preventScrollReset}
      relative={relative}
      onClick={handleClick}
    />
  );
}

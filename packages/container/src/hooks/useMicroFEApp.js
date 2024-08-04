import { useRef, useEffect } from "react";
import ReactDOM from "react-dom/client";
import { useHistory } from "react-router-dom";

export default function useMicroFEApp({ mount, onSignIn }) {
  const history = useHistory();
  const mountDivRef = useRef(null);
  const thisRef = useRef({ mountDiv: null });

  useEffect(() => {
    thisRef.current.mountDiv = mountDivRef.current;

    const { onParentNavigate } = mount(mountDivRef.current, {
      initialPath: history.location.pathname,
      onNavigate: ({ pathname: nextPathname }) => {
        const { pathname } = history.location;

        if (pathname !== nextPathname) {
          history.push(nextPathname);
        }
      },
      onSignIn,
    });

    history.listen(onParentNavigate);
    return () => {
      // Create a root and unmount it properly
      if (thisRef.current.mountDiv) {
        const root = ReactDOM.createRoot(thisRef.current.mountDiv);
        root.unmount();
      }
    };
  }, []);

  return {
    mountDivRef,
  };
}

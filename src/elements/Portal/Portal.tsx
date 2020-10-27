import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';

/**
 * A React Portal to render anything outside React tree
 */
const Portal: React.FC<{
  elementId: string;
}> = ({ children, elementId }) => {
  const el = useRef(document.createElement('div'));

  useEffect(() => {
    const portalRoot = document.getElementById(elementId);

    const element = el.current;
    if (!portalRoot) {
      throw new Error(`Element with id \`${elementId}\` does not exists in DOM.`);
    }
    portalRoot.appendChild(element);

    return () => {
      portalRoot.removeChild(element);
    };
  }, [elementId]);

  return ReactDOM.createPortal(children, el.current);
};

export default Portal;

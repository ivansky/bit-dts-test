import React from "react";

function Modal(props: React.PropsWithChildren<{}>) {
  return (<div>
    {props.children}
  </div>);
}

export { Modal };

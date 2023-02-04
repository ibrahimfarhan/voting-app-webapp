import { Fragment } from "react";

type ShowProps = {
  children: JSX.Element | Array<JSX.Element | null>,
  inCase: boolean,
}

/** Otherwise show second child. */
const ShowFirstChild = ({ children, inCase }: ShowProps) => {

  const modifiedChildren: Array<JSX.Element | null> | JSX.Element = Array.isArray(children) ? children : [children, null];

  return (
    <Fragment>
      {inCase ? modifiedChildren[0] : modifiedChildren[1]}
    </Fragment>
  );
};

export default ShowFirstChild;
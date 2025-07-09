import { Text } from "@radix-ui/themes";
import React, { PropsWithChildren, ReactNode } from "react";

//Don't need this because we are using PropsWithChildren
// interface Props {
//   children: ReactNode;
// }

const ErrorMessage = ({ children }: PropsWithChildren) => {
  if (!children) return null;

  return <Text color="red">{children}</Text>;
};

export default ErrorMessage;

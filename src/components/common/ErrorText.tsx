import { ReactNode } from "react";

interface ErrorTextProps {
  children: ReactNode;
}

export default function ErrorText({ children }: ErrorTextProps) {
  return <small>{children}</small>;
}

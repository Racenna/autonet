import { FC } from "react";

interface Props {
  width?: string | number;
  height?: string | number;
}

export const Spacer: FC<Props> = ({ width, height }) => {
  return <div style={{ width, height }} />;
};

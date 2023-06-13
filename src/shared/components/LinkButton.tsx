import { FC } from "react";
import { useNavigate } from "react-router";
import Button, { ButtonProps } from "@mui/material/Button";
import Typography, { TypographyProps } from "@mui/material/Typography";

interface Props extends ButtonProps {
  path: string;
  textVariant?: TypographyProps["variant"];
}

export const LinkButton: FC<Props> = ({
  path,
  children,
  textVariant = "body2",
  ...buttonProps
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => navigate(path);

  return (
    <Button
      style={{ textTransform: "unset" }}
      onClick={handleNavigate}
      {...buttonProps}
    >
      <Typography variant={textVariant}>{children}</Typography>
    </Button>
  );
};

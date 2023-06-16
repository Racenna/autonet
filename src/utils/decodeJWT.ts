export const decodeJWT = (
  token: string
): { UserId: string; UserName: string } => {
  return JSON.parse(atob(token.split(".")[1]));
};

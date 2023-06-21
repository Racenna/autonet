export const decodeJWT = (
  token: string
): { UserId: string; UserName: string } | undefined => {
  if (!token) return undefined;
  return JSON.parse(atob(token.split(".")[1]));
};

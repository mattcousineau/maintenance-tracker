export { default } from "next-auth/middleware";

export const config = {
  matcher: ["/requests/new", "/requests/:id+/edit"],
};

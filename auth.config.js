export const authConfig = {
  pages: {
    signIn: "/",
  },
  callbacks: {
    async authorized({ token, req }) {
      const isLoggedIn = !!token?.user;
      const isOnDashboard = req.nextUrl.pathname.startsWith('/dashboard');
      
      if (isOnDashboard) {
        if (isLoggedIn) return true;
        return false; 
      } else if (isLoggedIn) {
        return Response.redirect(new URL('/dashboard', req.nextUrl));
      }
      
      return true;
    },
  },
  providers: [],
};

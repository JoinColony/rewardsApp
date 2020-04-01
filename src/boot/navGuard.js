export default ({ router, store }) => {
  // Make sure there's a wallet loaded or redirect to login.
  router.beforeEach(async (to, from, next) => {
    if (store.state.app.user.wallet || to.path == "/") {
      // Continue...
      next();
    } else {
      // Otherwise redirect to login.
      next("/");
    }
  });
};

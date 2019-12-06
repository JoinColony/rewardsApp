export default ({ router, store }) => {
  // Make sure there's a wallet loaded or redirect to login.
  router.beforeEach(async (to, from, next) => {
    // Ensure there's a wallet or that we're going to login.
    if (store.getters["app/getWallet"] || to.path == "/") {
      // Continue...
      next();
    } else {
      // Otherwise redirect to login.
      next("/");
    }
  });
};

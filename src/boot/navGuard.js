export default ({ router, store }) => {
  router.beforeEach(async (to, from, next) => {
    if (store.getters["app/getWallet"] !== null || to.path == "/") {
      next();
    } else {
      next("/");
    }
  });
};

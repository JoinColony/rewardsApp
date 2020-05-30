const routes = [
  {
    path: "/",
    publicPath: "/rewardsApp/",
    component: () => import("layouts/Layout"),
    children: [
      { path: "", component: () => import("pages/Login") },
      { path: "colony", component: () => import("pages/SelectColony") },
      { path: "payouts", component: () => import("pages/Rewards") }
    ]
  }
];

// Always leave this as last one
if (process.env.MODE !== "ssr") {
  routes.push({
    path: "*",
    component: () => import("pages/Error404")
  });
}

export default routes;

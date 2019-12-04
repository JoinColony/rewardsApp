const routes = [
  {
    path: "/",
    component: () => import("layouts/Layout"),
    children: [
      { path: "", component: () => import("pages/Login") },
      { path: "select-colony", component: () => import("pages/SelectColony") }
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

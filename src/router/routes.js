const routes = [
  {
    path: "/",
    component: () => import("layouts/Layout"),
    children: [{ path: "", component: () => import("pages/Index") }]
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

import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
import { getToken } from "@/utils/auth"; // get token from cookie
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const whiteList = ["/login", "/auth-redirect"]; // no redirect whitelist

router.beforeEach(async (to, from, next) => {

	// start progress bar
	NProgress.start();

	// set page title
	document.title = getPageTitle(to.meta.title);

	// determine whether the user has logged in
	const hasToken = getToken();


	if(hasToken) {
		console.log(to);
		if(to.path === "/login") {
			// if is logged in, redirect to the home page
			next({ path: "/" });
			NProgress.done();
		} else {
			// determine whether the user has obtained his permission roles through getInfo
			const hasRoles = store.getters.roles && store.getters.roles.length > 0;
			if(hasRoles) {
				next();
			} else {
				try {
					let { data: { roles, menus } } = await store.dispatch("user/getInfo");
					for(let i = 0; i < menus.length; i++) {
						menus[menus[i].code] = true;
					}
					await store.dispatch("permission/generateRoutes", menus);

					router.addRoutes(store.getters.addRoutes);

					next({ ...to, replace: true });
				} catch (error) {
					await store.dispatch("user/resetToken");
					Message.error(error || "Has Error");
					next(`/login?redirect=${ to.path }`);
					NProgress.done();
				}
			}
		}
	} else {
		/* has no token*/

		if(whiteList.indexOf(to.path) !== -1 || to.name === "login") {
			// in the free login whitelist, go directly
			next();
		} else {
			// other pages that do not have permission to access are redirected to the login page.
			next(`/login?redirect=${ to.path }`);
			NProgress.done();
		}
	}
});

router.afterEach(() => {
	// finish progress bar
	NProgress.done();
});

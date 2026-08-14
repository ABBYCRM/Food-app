import { Router, type IRouter } from "express";
import healthRouter from "./health.js";
import proxyRouter from "./proxy.js";
import pushRouter from "./push.js";

const router: IRouter = Router();

router.use(healthRouter);
router.use(proxyRouter);
router.use(pushRouter);

export default router;

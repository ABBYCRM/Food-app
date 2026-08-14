import { Router, type IRouter } from "express";
import healthRouter from "./health";
import proxyRouter from "./proxy";
import pushRouter from "./push";

const router: IRouter = Router();

router.use(healthRouter);
router.use(proxyRouter);
router.use(pushRouter);

export default router;

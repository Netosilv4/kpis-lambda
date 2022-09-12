import { Request, Response } from "express";
import { headCountChartHandler } from "./services";

export const headCountChart = async (req: Request, res: Response) => {
    const { body, query } = req
    const response = await headCountChartHandler(body, query);
    res.status(200).json(response)
}
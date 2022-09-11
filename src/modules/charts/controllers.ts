import { Request, Response } from "express";
import { headCountChartHandler } from "./services";

export const headCountChart = async (req: Request, res: Response) => {
    const { body } = req
    const response = await headCountChartHandler(body);
    res.status(200).json(response)
}
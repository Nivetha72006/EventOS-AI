import { Response } from "express";

export function success(
  res: Response,
  data: any,
  message = "Success"
) {
  return res.status(200).json({
    success: true,
    message,
    data,
  });
}

export function failure(
  res: Response,
  message = "Something went wrong",
  status = 400
) {
  return res.status(status).json({
    success: false,
    message,
  });
}
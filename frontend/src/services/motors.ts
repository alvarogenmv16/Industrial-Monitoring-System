import api from "./api";

export async function getMotors() {
  const res = await api.get("/motors/");
  return res.data;
}
import jwt from "jsonwebtoken"

const SECRET = process.env.JWT_SECRET || "super-secret-key"

type Payload = {
  session:string,
  website_id:string
}

export function signJwtInfinite(data: Payload): string {
  return jwt.sign(data, SECRET)
}
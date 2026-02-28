type IpApiResponse = {
  status: "success" | "fail";
  countryCode?: string;
};

export async function getCountryCode(ip?: string): Promise<string> {
  try {
    const res = await fetch(`http://ip-api.com/json/${ip}`);

    if (!res.ok) {
      return "IN";
    }

    const data: IpApiResponse = await res.json();

    if (data.status === "success" && data.countryCode) {
      return data.countryCode;
    }

    return "IN";
  } catch {
    return "IN";
  }
}

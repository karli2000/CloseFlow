import { cookies } from "next/headers";
import { dictionaries, type Dictionary, type Locale } from "./dictionaries";

const COOKIE_NAME = "closeflow_locale";

export async function getLocale(): Promise<Locale> {
  const value = (await cookies()).get(COOKIE_NAME)?.value;
  return value === "de" ? "de" : "en";
}

export async function getDictionary(): Promise<Dictionary> {
  const locale = await getLocale();
  return dictionaries[locale] as Dictionary;
}

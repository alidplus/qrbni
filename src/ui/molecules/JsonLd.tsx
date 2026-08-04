import { jsonLdScript, type JsonLd } from "@/server/seo/jsonld";

type Props = {
  data: JsonLd | JsonLd[];
};

/** Server-rendered JSON-LD for search engines. */
export function JsonLdScript({ data }: Props) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLdScript(data) }}
    />
  );
}

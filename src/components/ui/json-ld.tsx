/** Renders a JSON-LD <script>. Pass a schema.org object (or array). */
export function JsonLd({ data }: { data: object | object[] }) {
  return (
    <script
      type="application/ld+json"
      // schema.org payloads are app-generated, not user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
